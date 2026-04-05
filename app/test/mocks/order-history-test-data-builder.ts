import type { OrderHistory } from "@/app/types/history";

class OrderHistoryBuilder {
  private history: OrderHistory;

  constructor() {
    this.history = {
      id: "history-1",
      orderId: "ad89c88e-37a3-475c-885e-0729caa7736a",
      instrument: "PETR4",
      side: "BUY",
      price: 43,
      quantity: 700,
      tradedQuantity: 100,
      remaining: 200,
      status: "PARTIAL",
      createdAt: "2026-04-03T02:33:10.603Z",
      timestamp: "2026-04-03T03:33:10.603Z",
    };
  }

  withId(id: string) {
    this.history.id = id;
    return this;
  }

  withOrderId(orderId: string) {
    this.history.orderId = orderId;
    return this;
  }

  withInstrument(instrument: string) {
    this.history.instrument = instrument;
    return this;
  }

  withSide(side: OrderHistory["side"]) {
    this.history.side = side;
    return this;
  }

  withPrice(price: number) {
    this.history.price = price;
    return this;
  }

  withQuantity(quantity: number) {
    this.history.quantity = quantity;
    return this;
  }

  withTradedQuantity(tradedQuantity: number) {
    this.history.tradedQuantity = tradedQuantity;
    return this;
  }

  withRemaining(remaining: number) {
    this.history.remaining = remaining;
    return this;
  }

  withStatus(status: OrderHistory["status"]) {
    this.history.status = status;
    return this;
  }

  withCreatedAt(createdAt: string) {
    this.history.createdAt = createdAt;
    return this;
  }

  withTimestamp(timestamp: string) {
    this.history.timestamp = timestamp;
    return this;
  }

  build(): OrderHistory {
    return { ...this.history };
  }
}

export const orderHistory = new OrderHistoryBuilder();
