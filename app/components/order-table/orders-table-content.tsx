"use client";

import { useMemo, useState } from "react";
import { Box } from "@chakra-ui/react";
import { OrderDrawer } from "../order-drawer/order-drawer";
import type { Order } from "@/app/types/order";
import { format } from "@/app/helpers/formaters";
import {
  OrderTableHead,
  type SortDirection,
  type SortField,
} from "./order-table-head";

type OrdersTableContentProps = {
  data: Order[] | [];
};

export function OrdersTableContent({ data }: OrdersTableContentProps) {
  const [sortedBy, setSortedBy] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  function handleSort(field: SortField) {
    if (sortedBy === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortedBy(field);
    setSortDirection("asc");
  }

  const sortedOrders = useMemo(() => {
    if (!sortedBy) return data;

    const sorted = [...data].sort((a, b) => {
      const valueA =
        sortedBy === "createdAt"
          ? new Date(a.createdAt).getTime()
          : a[sortedBy];
      const valueB =
        sortedBy === "createdAt"
          ? new Date(b.createdAt).getTime()
          : b[sortedBy];

      if (typeof valueA === "number" && typeof valueB === "number") {
        return valueA - valueB;
      }

      return String(valueA).localeCompare(String(valueB));
    });

    return sortDirection === "asc" ? sorted : sorted.reverse();
  }, [data, sortDirection, sortedBy]);

  return (
    <Box
      overflowX="auto"
      borderWidth="1px"
      borderColor="#2E2E3E"
      p="1"
      bg="#222222"
    >
      <Box as="table" width="full" borderCollapse="collapse">
        <OrderTableHead
          sortedBy={sortedBy}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <Box as="tbody">
          {sortedOrders?.map((order: Order, index: number) => (
            <Box
              as="tr"
              key={order.id}
              bg={index % 2 !== 0 ? "#222222" : "#171717"}
              _hover={{ bg: "#2E2E3E" }}
            >
              <Box as="td" p="1" color="white.500">
                {order.id.slice(0, 8)}
              </Box>
              <Box as="td" p="1" color="white.500">
                {order.instrument}
              </Box>
              <Box as="td" p="1" color={format.side(order.side).color}>
                {format.side(order.side).side}
              </Box>
              <Box as="td" p="1" color="white.500">
                {format.currency(order.price)}
              </Box>
              <Box as="td" p="1" color="white.500">
                {order.quantity}
              </Box>
              <Box as="td" p="1" color="white.500">
                {order.remaining}
              </Box>
              <Box as="td" p="1" color={format.status(order.status).color}>
                {format.status(order.status).status}
              </Box>
              <Box as="td" p="1" color="white.500">
                {`${format.date(order.createdAt)} ás ${format.hour(order.createdAt)}`}
              </Box>
              <Box as="td" p="1">
                <OrderDrawer order={order} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
