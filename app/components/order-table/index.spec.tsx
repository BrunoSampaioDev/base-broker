import { render, screen } from "@testing-library/react";
import { OrdersTable } from "./index";
import { useGetOrders } from "@/app/hooks/use-get-orders";
import type { Order } from "@/app/types/order";
import { order } from "@/app/test/mocks/order-test-data-builder";

jest.mock("../../hooks/use-get-orders");
const mockedUseGetOrders = useGetOrders as jest.Mock;

jest.mock("./order-filters", () => ({
  OrderFilters: ({
    children,
    ordersLength,
  }: {
    children: React.ReactNode;
    ordersLength: number;
  }) => (
    <div data-testid="order-filters" data-orders-length={ordersLength}>
      {children}
    </div>
  ),
}));

jest.mock("./order-table-loading", () => ({
  OrderTableLoading: () => (
    <div data-testid="order-table-loading">Loading...</div>
  ),
}));

jest.mock("./order-table-error", () => ({
  OrderTableError: () => <div data-testid="order-table-error">Error</div>,
}));

jest.mock("./order-table-empty", () => ({
  OrderTableEmpty: () => <div data-testid="order-table-empty">Empty</div>,
}));

jest.mock("./orders-table-content", () => ({
  OrdersTableContent: ({ data }: { data: Order[] | [] }) => (
    <div data-testid="orders-table-content" data-length={data?.length || 0}>
      Content
    </div>
  ),
}));

describe("OrdersTable", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render filter correctly", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("order-filters")).toBeInTheDocument();
    expect(screen.getByTestId("orders-table-content")).toBeInTheDocument();
  });

  it("should render loading state when isLoading is true", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("order-table-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("order-table-error")).not.toBeInTheDocument();
    expect(screen.queryByTestId("order-table-empty")).not.toBeInTheDocument();
  });

  it("should render error state when isError is true", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("order-table-error")).toBeInTheDocument();
    expect(screen.queryByTestId("order-table-loading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("order-table-empty")).not.toBeInTheDocument();
  });

  it("should render empty state when orders array is empty", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("order-table-empty")).toBeInTheDocument();
    expect(screen.queryByTestId("order-table-loading")).not.toBeInTheDocument();
    expect(screen.queryByTestId("order-table-error")).not.toBeInTheDocument();
  });

  it("should render content when orders array has data", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [order.withSide("SELL").build(), order.withSide("BUY").build()],
      isLoading: false,
      isError: false,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("orders-table-content")).toBeInTheDocument();
    expect(screen.getByTestId("orders-table-content")).toHaveAttribute(
      "data-length",
      "2",
    );
    expect(screen.queryByTestId("order-table-empty")).not.toBeInTheDocument();
    expect(screen.queryByTestId("order-table-loading")).not.toBeInTheDocument();
  });

  it("should pass correct ordersLength to OrderFilters", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [order.build()],
      isLoading: false,
      isError: false,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("order-filters")).toHaveAttribute(
      "data-orders-length",
      "1",
    );
  });

  it("should prioritize loading state over error and empty states", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [],
      isLoading: true,
      isError: true,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("order-table-loading")).toBeInTheDocument();
    expect(screen.getByTestId("order-table-error")).toBeInTheDocument();
    expect(screen.queryByTestId("order-table-empty")).not.toBeInTheDocument();
  });

  it("should prioritize error state over empty state", () => {
    mockedUseGetOrders.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(<OrdersTable />);

    expect(screen.getByTestId("order-table-error")).toBeInTheDocument();
    expect(screen.queryByTestId("order-table-empty")).not.toBeInTheDocument();
    expect(screen.queryByTestId("order-table-loading")).not.toBeInTheDocument();
  });
});
