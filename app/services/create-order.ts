import type { CreateOrder } from "../types/order";

export async function createOrder(order: CreateOrder) {
  const res = await fetch("http://localhost:3001/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instrument: order.instrument,
      side: order.side,
      price: Number(order.price),
      quantity: Number(order.quantity),
    }),
  });
  return res;
}
