import type { Order } from "../types/order";

interface FetchOrderBookResponse {
  buyOrders: Order[];
  sellOrders: Order[];
  midPrice: number | null;
}

export async function fetchOrderBook(): Promise<FetchOrderBookResponse> {
  const res = await fetch(`http://localhost:3001/book`);
  return res.json();
}
