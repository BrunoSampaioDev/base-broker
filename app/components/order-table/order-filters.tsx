"use client";

import { useState } from "react";
import {
  Text,
  HStack,
  Button,
  Input,
  createListCollection,
  Flex,
  Portal,
  Select,
  Box,
} from "@chakra-ui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchOrders } from "@/app/services/get-orders";
import type { OrderFilters as OrderFiltersTypes } from "@/app/types/order";
import type { OrderStatus } from "@/app/types/shared-types";

export function OrderFilters({
  children,
  ordersLength,
}: {
  children: React.ReactNode;
  ordersLength: number;
}) {
  const [page, setPage] = useState(1);

  const sideCollection = createListCollection({
    items: [
      { label: "Compra", value: "BUY" },
      { label: "Venda", value: "SELL" },
    ],
  });

  const statusCollection = createListCollection({
    items: [
      { label: "Aberta", value: "OPEN" },
      { label: "Parcial", value: "PARTIAL" },
      { label: "Executada", value: "EXECUTED" },
      { label: "Cancelada", value: "CANCELLED" },
    ],
  });

  const { register, handleSubmit, setValue } = useForm<OrderFiltersTypes>();

  const queryClient = useQueryClient();

  const filterMutation = useMutation({
    mutationFn: (filters: OrderFiltersTypes) =>
      fetchOrders({ ...filters, page }),
    onSuccess: (data) => {
      queryClient.setQueryData(["orders"], data);
    },
  });

  const onFilterSubmit = (filters: OrderFiltersTypes) => {
    filterMutation.mutate(filters);
  };

  function onClearFilters() {
    ["id", "instrument", "side", "status", "date"].forEach((key) => {
      if (key === "side" || key === "status") {
        setValue(key as keyof OrderFiltersTypes, undefined);
      } else {
        setValue(key as keyof OrderFiltersTypes, "");
      }
    });
  }

  return (
    <>
      <Box bg="#171717">
        <form onSubmit={handleSubmit(onFilterSubmit)}>
          <Flex justifyContent="flex-end" p="0 1rem">
            <HStack mb="2" gap="2" w="80%" mt="0.5rem">
              <Input
                data-testid="id"
                placeholder="ID"
                size="sm"
                {...register("id")}
              />
              <Input
                data-testid="ticker"
                placeholder="Ticker"
                size="sm"
                {...register("instrument")}
              />
              <Select.Root
                data-testid="side"
                size="sm"
                collection={sideCollection}
                onValueChange={(details) =>
                  setValue("side", details.value[0] as "BUY" | "SELL")
                }
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="lado" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content defaultValue="">
                      {sideCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              <Select.Root
                data-testid="status"
                size="sm"
                collection={statusCollection}
                onValueChange={(details) =>
                  setValue("status", details.value[0] as OrderStatus)
                }
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="status" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {statusCollection.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              <Input
                data-testid="date"
                type="date"
                size="sm"
                color="whiteAlpha.600"
                {...register("date")}
              />
              <Button
                color="whiteAlpha.600"
                variant="surface"
                size="sm"
                type="submit"
                loading={filterMutation.isPending}
              >
                Filtrar
              </Button>
              <Button
                color="whiteAlpha.600"
                variant="surface"
                size="sm"
                type="submit"
                loading={filterMutation.isPending}
                onClick={onClearFilters}
              >
                Limpar Filtros
              </Button>
            </HStack>
          </Flex>
        </form>
      </Box>
      {children}
      <Flex width="100%" justifyContent="center" height="20px" pb="1rem">
        <HStack mt="4" gap="2">
          <Button
            data-testid="previous-page"
            size="xs"
            variant="ghost"
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              onFilterSubmit({ page: page - 1 });
            }}
            disabled={page === 1}
          >
            {"<"}
          </Button>

          <Text color="white.500">Página {page}</Text>

          <Button
            data-testid="next-page"
            size="xs"
            variant="ghost"
            onClick={() => {
              setPage((p) => p + 1);
              onFilterSubmit({ page: page + 1 });
            }}
            disabled={ordersLength < 5}
          >
            {">"}
          </Button>
        </HStack>
      </Flex>
    </>
  );
}
