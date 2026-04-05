import { fetchOrders } from "./get-orders";

describe("fetchOrders", () => {
  const fetchMock = globalThis.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch with the correct endpoint and query params", async () => {
    const filters = {
      page: 2,
      perPage: 10,
      id: "123",
      instrument: "PETR4",
      side: "BUY" as const,
      status: "OPEN" as const,
      date: "2026-04-03",
    };

    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);

    await fetchOrders(filters);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/orders?_page=2&_limit=10&_sort=createdAt&_order=desc&id_like=123&instrument_like=PETR4&side=BUY&status=OPEN&createdAt_like=2026-04-03",
    );
  });

  it("should return parsed json from response", async () => {
    const orders = [
      {
        id: "order-1",
        instrument: "PETR4",
        side: "BUY",
        price: 43,
        quantity: 700,
        status: "OPEN",
        createdAt: "2026-04-03T02:33:10.603Z",
        remaining: 700,
      },
    ];

    fetchMock.mockResolvedValue({
      json: jest.fn().mockResolvedValue(orders),
    } as unknown as Response);

    const result = await fetchOrders({ page: 1, perPage: 5 });

    expect(result).toEqual(orders);
  });

  it("should propagate fetch errors", async () => {
    const fetchError = new Error("network error");
    fetchMock.mockRejectedValue(fetchError);

    await expect(fetchOrders({ page: 1, perPage: 5 })).rejects.toThrow(
      "network error",
    );
  });
});
