import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderDrawer } from "./order-drawer";
import { order } from "@/app/test/mocks/order-test-data-builder";
import { withSetup } from "@/app/test/helpers/with-setup";

jest.mock("./order-time-line");

describe("OrderDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render order drawer content", () => {
    const mockOrder = order.withStatus("OPEN").build();

    render(withSetup(<OrderDrawer order={mockOrder} />));

    expect(screen.getByText("Histórico da Ordem")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar ordem" }),
    ).toBeInTheDocument();
  });

  it("should open cancel confirmation modal", async () => {
    const user = userEvent.setup();
    const mockOrder = order.withStatus("OPEN").build();

    render(withSetup(<OrderDrawer order={mockOrder} />));

    await user.click(screen.getByRole("button", { name: "Cancelar ordem" }));

    expect(screen.getByText("Cancelamento de ordem")).toBeInTheDocument();
  });

  it("should disable cancel button for executed and cancelled orders", () => {
    const { rerender } = render(
      withSetup(<OrderDrawer order={order.withStatus("EXECUTED").build()} />),
    );

    expect(
      screen.getByRole("button", { name: "Cancelar ordem" }),
    ).toBeDisabled();

    rerender(
      withSetup(<OrderDrawer order={order.withStatus("CANCELLED").build()} />),
    );

    expect(
      screen.getByRole("button", { name: "Cancelar ordem" }),
    ).toBeDisabled();
  });
});
