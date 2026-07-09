"use client";

import { Flex } from "@chakra-ui/react";
import { OrderBook } from "@/modules/order-book";
import { OrderForm, OrdersTable } from "@/modules/orders";
import { StockChart } from "@/modules/market";
import { Toaster } from "@/modules/shared";

export default function Dashboard() {
  return (
    <Flex height="100vh" overflow="hidden">
      <Toaster />
      <OrderBook />
      <Flex
        direction="column"
        gap="1"
        width="100%"
        minHeight="0"
        overflowY="auto"
      >
        <StockChart />
        <Flex gap="1">
          <OrderForm side={"BUY"} />
          <OrderForm side={"SELL"} />
        </Flex>
        <OrdersTable />
      </Flex>
    </Flex>
  );
}
