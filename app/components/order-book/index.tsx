"use client";

import { Box, Text, VStack, HStack, Spinner, Flex } from "@chakra-ui/react";
import type { Order } from "@/app/types/order";
import { format } from "@/app/helpers/formaters";
import { useGetOrderBook } from "@/app/hooks/use-get-order-book";

export function OrderBook() {
  const { data, isLoading, isError } = useGetOrderBook();

  const hiddenScrollbarStyles = {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  };

  const RenderRow = (order: Order, isSell: boolean) => {
    const color = isSell ? "#B22222" : "#00B67A";
    return (
      <HStack
        key={order.id}
        justifyContent="space-between"
        p="0.4"
        fontSize="xs"
      >
        <Text color={color}>{format.currency(order.price)}</Text>
        <Text color="whiteAlpha.600">{order.quantity}</Text>
        <Text color="whiteAlpha.600">{order.instrument}</Text>
      </HStack>
    );
  };

  if (isLoading)
    return (
      <Flex
        width="350px"
        justifyContent="center"
        alignItems="center"
        gap="0.5rem"
      >
        <Spinner size="md" color="whiteAlpha.400" />
        <Text color="white">Carregando ordens...</Text>
      </Flex>
    );

  if (isError)
    return (
      <Flex
        width="350px"
        justifyContent="center"
        alignItems="center"
        gap="0.5rem"
      >
        <Text color="white">Erro ao carregar ordens</Text>
      </Flex>
    );

  return (
    <Box
      width="350px"
      minHeight="100vh"
      bg="#171717"
      borderRight="1px solid #2E2E3E"
      p="2"
    >
      <Box mb="4" maxHeight="50vh" overflowY="auto" css={hiddenScrollbarStyles}>
        <Text fontWeight="bold" mb="2" color="whiteAlpha.800">
          Livro de ordens
        </Text>
        <VStack gap="1" align="stretch">
          {data?.sellOrders.map((order) => RenderRow(order, true))}
        </VStack>
      </Box>
      <Text fontWeight="bold" mb="2" color="whiteAlpha.800">
        {data?.midPrice !== null
          ? format.currency(data?.midPrice as number)
          : "Sem preço médio"}
      </Text>
      <Box maxHeight="50vh" overflowY="auto" css={hiddenScrollbarStyles}>
        <VStack gap="1" align="stretch">
          {data?.buyOrders.map((order) => RenderRow(order, false))}
        </VStack>
      </Box>
    </Box>
  );
}
