import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { useGetOrderHistory } from "./use-get-order-history";
import { fetchOrderHistory } from "../services/get-order-history";
import { orderHistory } from "../test/mocks/order-history-test-data-builder";

jest.mock("../services/get-order-history");
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

const mockedFetchOrderHistory = fetchOrderHistory as jest.MockedFunction<
  typeof fetchOrderHistory
>;
const mockedUseQuery = useQuery as unknown as jest.Mock;

describe("useGetOrderHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseQuery.mockReturnValue({
      data: [orderHistory.build()],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      status: "success",
    });
  });

  it("should call useQuery with correct queryKey", () => {
    const orderId = "ad89c88e-37a3-475c-885e-0729caa7736a";

    renderHook(() => useGetOrderHistory(orderId));

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["history", orderId],
      }),
    );
  });

  it("should call fetchOrderHistory from queryFn with order id", async () => {
    const order = orderHistory.build();

    renderHook(() => useGetOrderHistory(order.id));

    const queryOptions = mockedUseQuery.mock.calls[0]?.[0];
    await queryOptions.queryFn();

    expect(mockedFetchOrderHistory).toHaveBeenCalledWith(order.id);
  });

  it("should expose loading state from useQuery", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
      status: "pending",
    });

    const { result } = renderHook(() =>
      useGetOrderHistory("ad89c88e-37a3-475c-885e-0729caa7736d"),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBe(false);
  });

  it("should expose error state from useQuery", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: jest.fn(),
      status: "error",
    });

    const { result } = renderHook(() =>
      useGetOrderHistory("ad89c88e-37a3-475c-885e-0729caa7736f"),
    );

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
