import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderForm } from "./form-order";
import { withSetup } from "@/app/test/helpers/with-setup";
import { createOrder } from "@/app/services/create-order";
import { masks } from "@/app/helpers/masks";
import { toaster } from "@/app/components/ui/toaster";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("../../services/create-order");
jest.mock("../../helpers/masks");

const mockCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>;
const mockFormatBRL = masks.formatBRL as jest.MockedFunction<
  typeof masks.formatBRL
>;

describe("OrderForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateOrder.mockResolvedValue({ ok: true } as Response);
    mockFormatBRL.mockImplementation((value) => value);
    mockReplace.mockReset();
  });

  it("should render the form with all three input fields", () => {
    render(withSetup(<OrderForm side="BUY" />));

    expect(screen.getByPlaceholderText("Ex: TAEE11")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ex: 1.234,56")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ex: 20")).toBeInTheDocument();
  });

  it("should render with BUY button when side is BUY", () => {
    render(withSetup(<OrderForm side="BUY" />));

    expect(screen.getByRole("button")).toHaveTextContent("Comprar");
  });

  it("should render with SELL button when side is SELL", () => {
    render(withSetup(<OrderForm side="SELL" />));

    expect(screen.getByRole("button")).toHaveTextContent("Vender");
  });

  it("should show error message when ticker is not provided", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Tiker é obrigatório.")).toBeInTheDocument();
    });
  });

  it("should show error message when ticker has less than 5 characters", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Um tiker tem no mínimo 5 caracteres."),
      ).toBeInTheDocument();
    });
  });

  it("should show error message when ticker has more than 6 characters", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4999");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Um tiker tem no máximo 6 caracteres."),
      ).toBeInTheDocument();
    });
  });

  it("should show error when ticker format is invalid", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "1234AB");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Formato inválido (ex: PETR4 ou TAEE11)"),
      ).toBeInTheDocument();
    });
  });

  it("should show error when ticker is not in valid tickers list", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "FAKE5");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Ticker não encontrado")).toBeInTheDocument();
    });
  });

  it("should show error message when price is not provided", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Preço é obrigatório.")).toBeInTheDocument();
    });
  });

  it("should show error message when quantity is not provided", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "100");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Quantidade é obrigatória.")).toBeInTheDocument();
    });
  });

  it("should show error when quantity is less than 1", async () => {
    const user = userEvent.setup();
    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "100");
    await user.type(screen.getByPlaceholderText("Ex: 20"), "0.1");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Quantidade deve ser no mínimo 1"),
      ).toBeInTheDocument();
    });
  });

  it("should call formatBRL when price input changes", async () => {
    const user = userEvent.setup();

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "1");

    await waitFor(() => {
      expect(mockFormatBRL).toHaveBeenCalledWith("1");
    });
  });

  it("should submit form with correct data when all validations pass", async () => {
    const user = userEvent.setup();

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "10000");
    await user.type(screen.getByPlaceholderText("Ex: 20"), "100");

    await user.click(screen.getByRole("button", { name: "Comprar" }));

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledWith({
        instrument: "PETR4",
        side: "BUY",
        price: 100,
        quantity: 100,
      });
    });
  });

  it("should show loading state while submitting", async () => {
    const user = userEvent.setup();

    let resolveCreateOrder: () => void = () => {};
    const createOrderPromise = new Promise<Response>((resolve) => {
      resolveCreateOrder = () => resolve({ ok: true } as Response);
    });

    mockCreateOrder.mockReturnValue(createOrderPromise);

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "100");
    await user.type(screen.getByPlaceholderText("Ex: 20"), "50");

    const button = screen.getByRole("button", { name: "Comprar" });
    await user.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent("Processando...");
    });

    resolveCreateOrder();

    await waitFor(() => {
      expect(button).toHaveTextContent("Comprar");
    });
  });

  it("should reset form after successful submission", async () => {
    const user = userEvent.setup();
    mockCreateOrder.mockResolvedValue({ ok: true } as Response);
    mockFormatBRL.mockImplementation((value) => value);

    render(withSetup(<OrderForm side="BUY" />));

    const tickerInput = screen.getByPlaceholderText(
      "Ex: TAEE11",
    ) as HTMLInputElement;
    const priceInput = screen.getByPlaceholderText(
      "Ex: 1.234,56",
    ) as HTMLInputElement;
    const quantityInput = screen.getByPlaceholderText(
      "Ex: 20",
    ) as HTMLInputElement;

    await user.type(tickerInput, "PETR4");
    await user.type(priceInput, "100");
    await user.type(quantityInput, "50");

    await user.click(screen.getByRole("button", { name: "Comprar" }));

    await waitFor(() => {
      expect(tickerInput.value).toBe("");
      expect(priceInput.value).toBe("");
      expect(quantityInput.value).toBe("");
    });
  });

  it("should attempt to submit after successful form validation", async () => {
    const user = userEvent.setup();

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "100");
    await user.type(screen.getByPlaceholderText("Ex: 20"), "50");

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalled();
    });
  });

  it("should submit with SELL side when side prop is SELL", async () => {
    const user = userEvent.setup();
    mockFormatBRL.mockImplementation((value) => value);

    render(withSetup(<OrderForm side="SELL" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "VALE3");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "50");
    await user.type(screen.getByPlaceholderText("Ex: 20"), "100");

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockCreateOrder).toHaveBeenCalledWith({
        instrument: "VALE3",
        side: "SELL",
        price: 0.5,
        quantity: 100,
      });
    });
  });

  it("should update query string with ticker when a valid ticker is typed", async () => {
    const user = userEvent.setup();

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/?ticker=PETR4", {
        scroll: false,
      });
    });
  });

  it("should not update query string when ticker is not in allowed list", async () => {
    const user = userEvent.setup();

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "FAKE5");
    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Ticker não encontrado")).toBeInTheDocument();
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should call toaster.create on successful order creation", async () => {
    const user = userEvent.setup();
    const mockToasterCreate = jest.spyOn(toaster, "create");

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "100");
    await user.type(screen.getByPlaceholderText("Ex: 20"), "50");

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockToasterCreate).toHaveBeenCalledWith({
        title: "Ordem criada com sucesso",
        description: expect.stringContaining("PETR4"),
        type: "success",
      });
    });

    mockToasterCreate.mockRestore();
  });

  it("should call toaster.create on order creation error", async () => {
    const user = userEvent.setup();
    const mockToasterCreate = jest.spyOn(toaster, "create");
    mockCreateOrder.mockRejectedValue(new Error("Order creation failed"));

    render(withSetup(<OrderForm side="BUY" />));

    await user.type(screen.getByPlaceholderText("Ex: TAEE11"), "PETR4");
    await user.type(screen.getByPlaceholderText("Ex: 1.234,56"), "100");
    await user.type(screen.getByPlaceholderText("Ex: 20"), "50");

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockToasterCreate).toHaveBeenCalledWith({
        title: "Erro ao criar ordem",
        description: expect.stringContaining("PETR4"),
        type: "error",
      });
    });

    mockToasterCreate.mockRestore();
  });
});
