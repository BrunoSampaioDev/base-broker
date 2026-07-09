import { useQuery } from "@tanstack/react-query";
import { fetchOrderBook } from "../services/get-order-book";

export function useGetOrderBook() {
  const { data, isLoading, isError, refetch, ...rest } = useQuery({
    queryKey: ["orderBook"],
    queryFn: () => fetchOrderBook(),
  });
  return { data, isLoading, isError, refetch, ...rest };
}
