import { createOrder } from "./create-order";

describe("createOrder", () => {
  const fetchMock = globalThis.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch with the correct endpoint and request options", async () => {
    const payload = {
      instrument: "PETR4",
      side: "BUY" as const,
      price: 43,
      quantity: 700,
    };

    await createOrder(payload);

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3001/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instrument: "PETR4",
        side: "BUY",
        price: 43,
        quantity: 700,
      }),
    });
  });

  it("should return the response from fetch", async () => {
    const response = { ok: true, status: 201 } as Response;
    fetchMock.mockResolvedValue(response);

    const result = await createOrder({
      instrument: "VALE3",
      side: "SELL",
      price: 50,
      quantity: 100,
    });

    expect(result).toBe(response);
  });

  it("should propagate fetch errors", async () => {
    const fetchError = new Error("network error");
    fetchMock.mockRejectedValue(fetchError);

    await expect(
      createOrder({
        instrument: "ITUB4",
        side: "BUY",
        price: 30,
        quantity: 20,
      }),
    ).rejects.toThrow("network error");
  });
});
