import { useQuery } from "@tanstack/react-query";
import { fetchOrderHistory } from "../services/get-order-history";
import type { OrderHistory } from "../types/history";

export function useGetOrderHistory(orderId: string) {
  const { data, isLoading, isError, refetch, ...rest } = useQuery<
    OrderHistory[]
  >({
    queryKey: ["history", orderId],
    queryFn: () => fetchOrderHistory(orderId),
  });
  return { data, isLoading, isError, refetch, ...rest };
}
