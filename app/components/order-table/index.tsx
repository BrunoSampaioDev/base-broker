"use client";

import { Box } from "@chakra-ui/react";

import { useGetOrders } from "@/app/hooks/use-get-orders";
import { OrderFilters } from "./order-filters";
import { OrderTableLoading } from "./order-table-loading";
import { OrderTableError } from "./order-table-error";
import { OrderTableEmpty } from "./order-table-empty";
import { OrdersTableContent } from "./orders-table-content";

export function OrdersTable() {
  const { data: orders = [], isLoading, isError } = useGetOrders();

  return (
    <Box fontSize="0.8rem">
      <OrderFilters ordersLength={orders.length}>
        <>
          {isLoading && <OrderTableLoading />}
          {isError && <OrderTableError />}
          {!isLoading && !isError && orders?.length === 0 && (
            <OrderTableEmpty />
          )}
          <OrdersTableContent data={orders} />
        </>
      </OrderFilters>
    </Box>
  );
}
