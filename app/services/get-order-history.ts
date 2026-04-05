import { type OrderHistory } from "../types/history";

export async function fetchOrderHistory(
  orderId: string,
): Promise<OrderHistory[]> {
  const params = new URLSearchParams();

  params.append("_sort", "timestamp");
  params.append("orderId", orderId);

  const res = await fetch(`http://localhost:3001/history?${params.toString()}`);

  return res.json();
}
