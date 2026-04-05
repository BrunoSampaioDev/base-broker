import { render, screen } from "@testing-library/react";
import { withSetup } from "@/app/test/helpers/with-setup";
import { OrderTimeLine } from "./order-time-line";
import { order } from "@/app/test/mocks/order-test-data-builder";
import { orderHistory } from "@/app/test/mocks/order-history-test-data-builder";
import { useGetOrderHistory } from "../../hooks/use-get-order-history";
import type { OrderHistory } from "@/app/types/history";

jest.mock("../../hooks/use-get-order-history");
const mockedUseGetOrderHistory = useGetOrderHistory as jest.MockedFunction<
  typeof useGetOrderHistory
>;

describe("OrderTimeLine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseGetOrderHistory.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any);
  });

  it("should call useGetOrderHistory with order id", () => {
    const mockOrder = order.withStatus("OPEN").build();

    render(withSetup(<OrderTimeLine order={mockOrder} />));

    expect(mockedUseGetOrderHistory).toHaveBeenCalledWith(mockOrder.id);
  });

  it("should render creation block timeline data", () => {
    render(
      withSetup(<OrderTimeLine order={order.withStatus("OPEN").build()} />),
    );

    expect(screen.getByText("Criação da ordem")).toBeInTheDocument();
    expect(screen.getByText("Tipo de ordem: Compra")).toBeInTheDocument();
    expect(screen.getByText("Data: 03/04/26")).toBeInTheDocument();
    expect(screen.getByText("Hora: 02:33")).toBeInTheDocument();
    expect(screen.getByText("Ativo: PETR4")).toBeInTheDocument();
    expect(screen.getByText("Quantidade: 700")).toBeInTheDocument();
    expect(screen.getByText("Valor: R$ R$ 43,00")).toBeInTheDocument();
  });

  it.each<[OrderHistory["status"], string]>([
    ["PARTIAL", "Execução parcial"],
    ["EXECUTED", "Ordem Executada"],
    ["CANCELLED", "Ordem Cancelada"],
  ])("should render translated title for status %s", (status, translated) => {
    mockedUseGetOrderHistory.mockReturnValue({
      data: [orderHistory.withStatus(status).build()],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(withSetup(<OrderTimeLine order={order.build()} />));

    expect(screen.getByText(translated)).toBeInTheDocument();
    expect(screen.getAllByText("Data: 03/04/26")).toHaveLength(2);
    expect(screen.getByText("Hora: 03:33")).toBeInTheDocument();
  });

  it("should render cancelled executed quantity when tradedQuantity is greater than zero", () => {
    mockedUseGetOrderHistory.mockReturnValue({
      data: [
        orderHistory
          .withStatus("CANCELLED")
          .withTradedQuantity(50)
          .withRemaining(0)
          .build(),
      ],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(withSetup(<OrderTimeLine order={order.build()} />));

    expect(
      screen.getByText("Quantidade total executada: 50"),
    ).toBeInTheDocument();
  });

  it("should not render cancelled executed quantity when tradedQuantity is zero", () => {
    mockedUseGetOrderHistory.mockReturnValue({
      data: [
        orderHistory
          .withStatus("CANCELLED")
          .withTradedQuantity(0)
          .withRemaining(0)
          .build(),
      ],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(withSetup(<OrderTimeLine order={order.build()} />));

    expect(
      screen.queryByText(/Quantidade total executada:/),
    ).not.toBeInTheDocument();
  });

  it("should render remaining and cancelled labels based on status", () => {
    mockedUseGetOrderHistory.mockReturnValue({
      data: [
        orderHistory
          .withStatus("PARTIAL")
          .withTradedQuantity(120)
          .withRemaining(80)
          .build(),
        orderHistory
          .withId("ad89c88e-37a3-475c-885e-0729caa7736b")
          .withStatus("CANCELLED")
          .withTradedQuantity(30)
          .withRemaining(70)
          .build(),
      ],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    } as any);

    render(withSetup(<OrderTimeLine order={order.build()} />));

    expect(screen.getByText("Quantidade executada: 120")).toBeInTheDocument();
    expect(screen.getByText("Quantidade restante: 80")).toBeInTheDocument();
    expect(screen.getByText("Quantidade cancelada: 70")).toBeInTheDocument();
  });
});
