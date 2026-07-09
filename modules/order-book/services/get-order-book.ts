import type { Order } from "@/modules/orders";

interface FetchOrderBookResponse {
  buyOrders: Order[];
  sellOrders: Order[];
  midPrice: number | null;
}

export async function fetchOrderBook(): Promise<FetchOrderBookResponse> {
  const res = await fetch(`http://localhost:3001/book`);
  return res.json();
}
