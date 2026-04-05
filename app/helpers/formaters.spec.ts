import type { OrderSide, OrderStatus } from "../types/shared-types";
import { format, type OrderSideMap } from "./formaters";

describe("formaters", () => {
  describe("currency", () => {
    it.each([
      [1, "R$ 1,00"],
      [10, "R$ 10,00"],
      [100, "R$ 100,00"],
      [1000, "R$ 1.000,00"],
      [10000, "R$ 10.000,00"],
    ])("should format value %s to currency format %s", (input, expected) => {
      expect(format.currency(input)).toEqual(expected);
    });
  });

  describe("date", () => {
    it.each([
      ["2026-01-01T00:00:00Z", "01/01/26"],
      ["2026-12-31T23:59:59Z", "31/12/26"],
    ])("should format date string %s to date format %s", (input, expected) => {
      expect(format.date(input)).toEqual(expected);
    });
  });

  describe("hour", () => {
    it.each([
      ["2026-01-01T00:00:00Z", "00:00"],
      ["2026-12-31T23:59:59Z", "23:59"],
    ])("should format date string %s to hour format %s", (input, expected) => {
      expect(format.hour(input)).toEqual(expected);
    });
  });

  describe("side", () => {
    it.each<[OrderSide, OrderSideMap]>([
      ["BUY", { side: "Compra", color: "green.500" }],
      ["SELL", { side: "Venda", color: "red.500" }],
    ])("should format order side %s to side format %o", (input, expected) => {
      expect(format.side(input)).toEqual(expected);
    });
  });

  describe("status", () => {
    it.each<[OrderStatus, { status: string; color: string }]>([
      ["OPEN", { status: "Aberta", color: "green.500" }],
      ["PARTIAL", { status: "Parcial", color: "yellow.500" }],
      ["EXECUTED", { status: "Executada", color: "white.500" }],
      ["CANCELLED", { status: "Cancelada", color: "red.500" }],
    ])(
      "should format order status %s to status format %o",
      (input, expected) => {
        expect(format.status(input)).toEqual(expected);
      },
    );
  });
});
