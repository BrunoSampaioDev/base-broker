import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { useGetOrderBook } from "./use-get-order-book";
import { fetchOrderBook } from "../services/get-order-book";
import { OrderBookBuilder } from "../test/mocks/order-book-test-data-builder";

jest.mock("../services/get-order-book");
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

const mockedFetchOrderBook = fetchOrderBook as jest.MockedFunction<
  typeof fetchOrderBook
>;
const mockedUseQuery = useQuery as unknown as jest.Mock;

describe("useGetOrderBook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseQuery.mockReturnValue({
      data: OrderBookBuilder.create().build(),
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      status: "success",
    });
  });

  it("should call useQuery with correct queryKey", () => {
    renderHook(() => useGetOrderBook());

    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["orderBook"],
      }),
    );
  });

  it("should call fetchOrderBook from queryFn", async () => {
    renderHook(() => useGetOrderBook());

    const queryOptions = mockedUseQuery.mock.calls[0]?.[0];
    await queryOptions.queryFn();

    expect(mockedFetchOrderBook).toHaveBeenCalled();
  });

  it("should expose loading state from useQuery", () => {
    mockedUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
      status: "pending",
    });

    const { result } = renderHook(() => useGetOrderBook());

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

    const { result } = renderHook(() => useGetOrderBook());

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
