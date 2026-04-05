import { fetchOrderBook } from "./get-order-book";
import { OrderBookBuilder } from "@/app/test/mocks/order-book-test-data-builder";

describe("fetchOrderBook", () => {
  const fetchMock = globalThis.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch with the correct endpoint", async () => {
    const emptyOrderBook = OrderBookBuilder.create().withEmptyOrders().build();

    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue(emptyOrderBook),
    } as unknown as Response);

    await fetchOrderBook();

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3001/book");
  });

  it("should return parsed json with buyOrders, sellOrders and midPrice", async () => {
    const mockOrderBook = OrderBookBuilder.create().build();

    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockOrderBook),
    } as unknown as Response);

    const result = await fetchOrderBook();

    expect(result).toEqual(mockOrderBook);
    expect(result.buyOrders).toHaveLength(1);
    expect(result.sellOrders).toHaveLength(1);
    expect(result.midPrice).toBe(26.0);
  });

  it("should propagate fetch errors", async () => {
    const fetchError = new Error("network error");
    fetchMock.mockRejectedValue(fetchError);

    await expect(fetchOrderBook()).rejects.toThrow("network error");
  });
});
