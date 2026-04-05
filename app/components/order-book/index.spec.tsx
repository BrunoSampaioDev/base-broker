import { render, screen } from "@testing-library/react";
import { OrderBook } from "./index";
import { useGetOrderBook } from "@/app/hooks/use-get-order-book";
import { OrderBookBuilder } from "@/app/test/mocks/order-book-test-data-builder";
import { withSetup } from "@/app/test/helpers/with-setup";
import { format } from "@/app/helpers/formaters";

jest.mock("../../hooks/use-get-order-book");

const mockedUseGetOrderBook = useGetOrderBook as jest.Mock;

describe("OrderBook", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state", () => {
    mockedUseGetOrderBook.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(withSetup(<OrderBook />));

    expect(screen.getByText("Carregando ordens...")).toBeInTheDocument();
    expect(
      screen.queryByText("Erro ao carregar ordens"),
    ).not.toBeInTheDocument();
  });

  it("should render error state", () => {
    mockedUseGetOrderBook.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(withSetup(<OrderBook />));

    expect(screen.getByText("Erro ao carregar ordens")).toBeInTheDocument();
    expect(screen.queryByText("Carregando ordens...")).not.toBeInTheDocument();
  });

  it("should render order book with buy and sell orders and mid price", () => {
    const orderBook = OrderBookBuilder.create().build();

    mockedUseGetOrderBook.mockReturnValue({
      data: orderBook,
      isLoading: false,
      isError: false,
    });

    render(withSetup(<OrderBook />));

    expect(screen.getByText("Livro de ordens")).toBeInTheDocument();
    expect(
      screen.getByText(format.currency(orderBook.midPrice as number)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(format.currency(orderBook.sellOrders[0].price)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(format.currency(orderBook.buyOrders[0].price)),
    ).toBeInTheDocument();

    expect(screen.getAllByText("PETR4")).toHaveLength(2);
  });

  it("should render fallback text when midPrice is null", () => {
    const orderBookWithoutMidPrice = OrderBookBuilder.create()
      .withMidPrice(null)
      .build();

    mockedUseGetOrderBook.mockReturnValue({
      data: orderBookWithoutMidPrice,
      isLoading: false,
      isError: false,
    });

    render(withSetup(<OrderBook />));

    expect(screen.getByText("Sem preço médio")).toBeInTheDocument();
  });
});
