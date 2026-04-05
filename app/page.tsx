"use client";

import { Flex } from "@chakra-ui/react";
import { OrderForm, OrderBook, StockChart, OrdersTable } from "./components";
import { Toaster } from "@/app/components/ui/toaster";

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
