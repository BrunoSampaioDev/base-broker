import type { Order } from "./order";

export interface OrderHistory extends Order {
  orderId: string;
  tradedQuantity: number;
  remaining: number;
  timestamp: string;
}
