import { cancelOrder } from "./cancel-order";

describe("cancelOrder", () => {
  const fetchMock = globalThis.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch with the correct endpoint and request options", async () => {
    const orderId = "694b3cdd-2450-4af6-9a74-2f9857dc320e";

    await cancelOrder(orderId);

    expect(fetchMock).toHaveBeenCalledWith(
      `http://localhost:3001/orders/${orderId}/cancel`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      },
    );
  });

  it("should return the response from fetch", async () => {
    const response = { ok: true, status: 200 } as Response;
    fetchMock.mockResolvedValue(response);

    const result = await cancelOrder("694b3cdd-2450-4af6-9a74-2f9857dc320e");

    expect(result).toBe(response);
  });

  it("should propagate fetch errors", async () => {
    const fetchError = new Error("network error");
    fetchMock.mockRejectedValue(fetchError);

    await expect(
      cancelOrder("694b3cdd-2450-4af6-9a74-2f9857dc320e"),
    ).rejects.toThrow("network error");
  });
});
