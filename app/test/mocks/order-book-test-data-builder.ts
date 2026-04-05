import type { Order } from "@/app/types/order";

interface OrderBook {
  buyOrders: Order[];
  sellOrders: Order[];
  midPrice: number | null;
}

class OrderBookBuilder {
  private orderBook: OrderBook;

  constructor() {
    this.orderBook = {
      buyOrders: [
        {
          id: "ad89c88e-37a3-475c-885e-0729caa7736s",
          instrument: "PETR4",
          side: "BUY",
          price: 25.5,
          quantity: 100,
          remaining: 100,
          status: "OPEN",
          createdAt: "2026-04-03T02:33:10.603Z",
        },
      ],
      sellOrders: [
        {
          id: "b1f2c3d4-5678-90ab-cdef-1234567890ax",
          instrument: "PETR4",
          side: "SELL",
          price: 26.5,
          quantity: 100,
          remaining: 100,
          status: "OPEN",
          createdAt: "2026-04-03T02:33:10.603Z",
        },
      ],
      midPrice: 26.0,
    };
  }

  static create() {
    return new OrderBookBuilder();
  }

  withBuyOrders(buyOrders: Order[]) {
    this.orderBook.buyOrders = buyOrders;
    return this;
  }

  withSellOrders(sellOrders: Order[]) {
    this.orderBook.sellOrders = sellOrders;
    return this;
  }

  withMidPrice(midPrice: number | null) {
    this.orderBook.midPrice = midPrice;
    return this;
  }

  withEmptyOrders() {
    this.orderBook.buyOrders = [];
    this.orderBook.sellOrders = [];
    this.orderBook.midPrice = null;
    return this;
  }

  build(): OrderBook {
    return { ...this.orderBook };
  }
}

export { OrderBookBuilder };
