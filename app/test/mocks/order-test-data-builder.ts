import type { Order } from "@/app/types/order";

class OrderBuilder {
  private order: Order;

  constructor() {
    this.order = {
      id: "ad89c88e-37a3-475c-885e-0729caa7736a",
      instrument: "PETR4",
      side: "BUY",
      price: 43,
      quantity: 700,
      remaining: 360,
      status: "CANCELLED",
      createdAt: "2026-04-03T02:33:10.603Z",
    };
  }

  static create() {
    return new OrderBuilder();
  }

  withId(id: string) {
    this.order.id = id;
    return this;
  }

  withInstrument(instrument: string) {
    this.order.instrument = instrument;
    return this;
  }

  withSide(side: Order["side"]) {
    this.order.side = side;
    return this;
  }

  withPrice(price: number) {
    this.order.price = price;
    return this;
  }

  withQuantity(quantity: number) {
    this.order.quantity = quantity;
    return this;
  }

  withRemaining(remaining: number) {
    this.order.remaining = remaining;
    return this;
  }

  withStatus(status: Order["status"]) {
    this.order.status = status;
    return this;
  }

  withCreatedAt(date: string) {
    this.order.createdAt = date;
    return this;
  }

  build(): Order {
    return { ...this.order };
  }
}

export const order = new OrderBuilder();
