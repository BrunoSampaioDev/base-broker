"use client";

import { Flex } from "@chakra-ui/react";
import { OrderForm, OrderBook, StockChart, OrdersTable } from "./components";

export default function Dashboard() {
  return (
    <Flex>
      <OrderBook />
      <Flex direction="column" gap="1" width="100%">
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
