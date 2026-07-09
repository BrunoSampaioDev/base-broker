import { fetchOrderHistory } from "./get-order-history";

describe("fetchOrderHistory", () => {
  const fetchMock = globalThis.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch with the correct endpoint and query params", async () => {
    const orderId = "ad89c88e-37a3-475c-885e-0729caa7736a";
    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    await fetchOrderHistory(orderId);

    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:3001/history?_sort=timestamp&orderId=${orderId}`,
    );
  });

  it("should return parsed json from response", async () => {
    const history = [
      {
        id: "history-1",
        orderId: "ad89c88e-37a3-475c-885e-0729caa7736a",
        instrument: "PETR4",
        side: "BUY",
        price: 43,
        quantity: 700,
        tradedQuantity: 100,
        remaining: 600,
        status: "PARTIAL",
        createdAt: "2026-04-03T02:33:10.603Z",
        timestamp: "2026-04-03T03:33:10.603Z",
      },
    ];

    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue(history),
    } as unknown as Response);

    const result = await fetchOrderHistory(
      "ad89c88e-37a3-475c-885e-0729caa7736a",
    );

    expect(result).toEqual(history);
  });

  it("should propagate fetch errors", async () => {
    const fetchError = new Error("network error");
    fetchMock.mockRejectedValue(fetchError);

    await expect(
      fetchOrderHistory("ad89c88e-37a3-475c-885e-0729caa7736a"),
    ).rejects.toThrow("network error");
  });
});
