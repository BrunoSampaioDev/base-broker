export async function cancelOrder(orderId: string) {
  const res = await fetch(`http://localhost:3001/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  return res;
}
