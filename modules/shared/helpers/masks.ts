import { format } from "./formaters";

const formatBRL = (value: string) => {
  const row = Number(value.replace(/\D/g, ""));

  return format.currency(Number(row / 100));
};

export const masks = {
  formatBRL,
};
