import type { Order, OrderFilters } from "../types/order";

export async function fetchOrders(filters: OrderFilters): Promise<Order[]> {
  const params = new URLSearchParams();
  params.append("_page", String(filters.page || 1));
  params.append("_limit", String(filters.perPage || 5));
  params.append("_sort", "createdAt");
  params.append("_order", "desc");

  if (filters.id) params.append("id_like", filters.id);
  if (filters.instrument) params.append("instrument_like", filters.instrument);
  if (filters.side) params.append("side", filters.side);
  if (filters.status) params.append("status", filters.status);
  if (filters.date) params.append("createdAt_like", filters.date);

  const res = await fetch(`http://localhost:3001/orders?${params.toString()}`);

  return res.json();
}
