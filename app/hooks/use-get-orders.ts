import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../services/get-orders";
import type { OrderFilters } from "../types/order";

export function useGetOrders(filters?: OrderFilters, page?: number) {
  const { data, isLoading, isError, refetch, ...rest } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchOrders({ ...filters, page }),
  });
  return { data, isLoading, isError, refetch, ...rest };
}
