import type { OrderSide, OrderStatus } from "../types/shared-types";

function currency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
    .format(value)
    .replace(/\u00A0/g, " ");
}

function date(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function hour(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export interface OrderSideMap {
  side: "Compra" | "Venda";
  color: string;
}

function side(value: OrderSide): OrderSideMap {
  return value === "BUY"
    ? { side: "Compra", color: "green.500" }
    : { side: "Venda", color: "red.500" };
}

type TranslationStatusMap = "Aberta" | "Parcial" | "Executada" | "Cancelada";
type StatusMap = Record<
  OrderStatus,
  { status: TranslationStatusMap; color: string }
>;

function status(value: OrderStatus): {
  status: TranslationStatusMap;
  color: string;
} {
  const statusMap: StatusMap = {
    OPEN: { status: "Aberta", color: "green.500" },
    PARTIAL: { status: "Parcial", color: "yellow.500" },
    EXECUTED: { status: "Executada", color: "white.500" },
    CANCELLED: { status: "Cancelada", color: "red.500" },
  };

  return statusMap[value];
}

export const format = {
  currency,
  date,
  hour,
  side,
  status,
};
