import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { useGetOrders } from "./use-get-orders";
import { fetchOrders } from "../services/get-orders";
import { order } from "../test/mocks/order-test-data-builder";
import type { OrderFilters } from "../types/order";

jest.mock("../services/get-orders");
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

const mockedFetchOrders = fetchOrders as jest.MockedFunction<
  typeof fetchOrders
>;
const mockedUseQuery = useQuery as unknown as jest.Mock;

describe("useGetOrders", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseQuery.mockReturnValue({
      data: [order.build()],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      status: "success",
    });
  });

  it("should call useQuery with correct queryKey", () => {
    renderHook(() => useGetOrders());

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["orders"],
      }),
    );
  });

  it("should call fetchOrders from queryFn with correct params", async () => {
    const filters: OrderFilters = {
      instrument: "PETR4",
      side: "BUY",
      status: "OPEN",
      date: "03/04/26",
      id: "123",
    };
    const page = 2;

    renderHook(() => useGetOrders(filters, page));

    const queryOptions = mockedUseQuery.mock.calls[0]?.[0];
    await queryOptions.queryFn();

    expect(mockedFetchOrders).toHaveBeenCalledWith({
      ...filters,
      page,
    });
  });

  it("should expose loading state from useQuery", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
      status: "pending",
    });

    const { result } = renderHook(() => useGetOrders());

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

    const { result } = renderHook(() => useGetOrders());

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
