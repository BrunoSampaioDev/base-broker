import { withSetup } from "@/app/test/helpers/with-setup";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { OrderFilters } from "./order-filters";
import userEvent from "@testing-library/user-event";
import { fetchOrders } from "@/app/services/get-orders";

const mockedMutate = jest.fn();
const mockedSetQueryData = jest.fn();

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");

  type MutationConfig = {
    mutationFn?: (data: unknown) => Promise<unknown> | unknown;
    onSuccess?: (data: unknown) => void;
  };

  return {
    ...actual,
    useMutation: (config: MutationConfig) => {
      return {
        mutate: async (data: unknown) => {
          mockedMutate(data);
          if (config.mutationFn) {
            const result = await config.mutationFn(data);
            if (config.onSuccess) {
              config.onSuccess(result);
            }
          }
        },
        isPending: false,
        reset: jest.fn(),
      };
    },
    useQueryClient: () => ({
      setQueryData: mockedSetQueryData,
    }),
  };
});

jest.mock("../../services/get-orders");
const mockedFetchOrders = fetchOrders as jest.MockedFunction<
  typeof fetchOrders
>;

describe("OrderFilters", () => {
  it("should render filter correctly", () => {
    render(
      withSetup(
        <OrderFilters ordersLength={1}>
          <div>mock content</div>
        </OrderFilters>,
      ),
    );
    expect(screen.getByTestId("side")).toBeInTheDocument();
    expect(screen.getByTestId("status")).toBeInTheDocument();
    expect(screen.getByTestId("id")).toBeInTheDocument();
    expect(screen.getByTestId("ticker")).toBeInTheDocument();
    expect(screen.getByTestId("date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filtrar" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Limpar Filtros" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("next-page")).toBeInTheDocument();
    expect(screen.getByTestId("previous-page")).toBeInTheDocument();
    expect(screen.getByText("Página 1")).toBeInTheDocument();
  });

  it("should call mutation, setQuery and fetchOrders with correct params", async () => {
    const user = userEvent.setup();
    mockedFetchOrders.mockResolvedValue([]);

    render(
      withSetup(
        <OrderFilters ordersLength={1}>
          <div>mock content</div>
        </OrderFilters>,
      ),
    );

    fireEvent.change(
      screen.getByTestId("side").querySelector("select") as HTMLSelectElement,
      { target: { value: "BUY" } },
    );
    fireEvent.change(
      screen.getByTestId("status").querySelector("select") as HTMLSelectElement,
      { target: { value: "OPEN" } },
    );
    fireEvent.change(screen.getByTestId("date"), {
      target: { value: "1990-12-30" },
    });
    await user.type(screen.getByTestId("ticker"), "PETR4");
    await user.type(
      screen.getByTestId("id"),
      "694b3cdd-2450-4af6-9a74-2f9857dc320e",
    );
    await user.click(screen.getByRole("button", { name: "Filtrar" }));

    await waitFor(() => {
      expect(mockedMutate).toHaveBeenCalledWith({
        instrument: "PETR4",
        id: "694b3cdd-2450-4af6-9a74-2f9857dc320e",
        side: "BUY",
        status: "OPEN",
        date: "1990-12-30",
      });
    });
    expect(mockedFetchOrders).toHaveBeenCalledWith({
      instrument: "PETR4",
      id: "694b3cdd-2450-4af6-9a74-2f9857dc320e",
      side: "BUY",
      status: "OPEN",
      date: "1990-12-30",
      page: 1,
    });

    expect(mockedSetQueryData).toHaveBeenCalledWith(
      ["orders"],
      expect.any(Array),
    );
  });

  it("should clear typed filters when clicking on Limpar Filtros", async () => {
    const user = userEvent.setup();

    render(
      withSetup(
        <OrderFilters ordersLength={1}>
          <div>mock content</div>
        </OrderFilters>,
      ),
    );

    const tickerInput = screen.getByTestId("ticker") as HTMLInputElement;
    const idInput = screen.getByTestId("id") as HTMLInputElement;
    const datePicker = screen.getByTestId("date") as HTMLInputElement;

    await user.type(tickerInput, "PETR4");
    await user.type(idInput, "694b3cdd-2450-4af6-9a74-2f9857dc320e");
    fireEvent.change(datePicker, { target: { value: "1990-12-30" } });

    await user.click(screen.getByRole("button", { name: "Limpar Filtros" }));

    await waitFor(() => {
      expect(tickerInput.value).toBe("");
      expect(idInput.value).toBe("");
      expect(datePicker.value).toBe("");
    });
  });
});
