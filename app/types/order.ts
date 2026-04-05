import type { OrderSide, OrderStatus } from "./shared-types";

export interface OrderFilters {
  id?: string;
  instrument?: string;
  side?: OrderSide;
  status?: OrderStatus;
  date?: string;
  page?: number;
  perPage?: number;
}

export interface Order {
  id: string;
  instrument: string;
  side: OrderSide;
  price: number;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  remaining: number;
}

export interface CreateOrder {
  instrument: string;
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
}
