"use client";
import { Box, Button, Input, Flex } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/app/services/create-order";
import { masks } from "@/app/helpers/masks";
import type { Order } from "@/app/types/order";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toaster } from "../ui/toaster";
import { format } from "@/app/helpers/formaters";

interface OrderFormFiels {
  instrument: string;
  price: number;
  quantity: number;
}

export function OrderForm({ side }: { side: Order["side"] }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrderFormFiels>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function resetForm() {
    const fields: Array<keyof OrderFormFiels> = [
      "instrument",
      "price",
      "quantity",
    ];
    fields.forEach((field) => {
      setValue(field, "");
    });
  }

  const instrument = watch("instrument");

  const createOrderMutation = useMutation({
    mutationFn: (order: OrderFormFiels) => createOrder({ ...order, side }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["orders"] });
      queryClient.refetchQueries({ queryKey: ["orderBook"] });
      resetForm();
      toaster.create({
        title: "Ordem criada com sucesso",
        description: `Ordem de ${format.side(side).side} para ${instrument} criada com sucesso!`,
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Erro ao criar ordem",
        description: `Não foi possível criar a ordem de ${format.side(side).side} para ${instrument}.`,
        type: "error",
      });
    },
  });

  const onSubmit = (order: OrderFormFiels) => {
    const formatedPrice = order.price as unknown as string;
    const numericPrice = Number(formatedPrice.replace(/\D/g, "")) / 100;
    const numericQuantity = Number(order.quantity);
    createOrderMutation.mutate({
      ...order,
      price: numericPrice,
      quantity: numericQuantity,
    });
  };

  const validTickers = ["PETR4", "VALE3", "ITUB4", "BBDC4", "TAEE11"];

  const selectedTicker = watch("instrument");

  useEffect(() => {
    if (selectedTicker && validTickers.includes(selectedTicker)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("ticker", selectedTicker);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }
  }, [selectedTicker]);

  return (
    <Box
      fontSize="0.8rem"
      borderWidth="1px"
      p="2"
      width="full"
      bg="#171717"
      borderColor="#2E2E3E"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb="3">
          <label
            style={{ color: "#F0F0F0", display: "block", marginBottom: "4px" }}
          >
            Ticker
          </label>
          <Controller
            name="instrument"
            control={control}
            rules={{
              required: "Tiker é obrigatório.",
              maxLength: {
                value: 6,
                message: "Um tiker tem no máximo 6 caracteres.",
              },
              minLength: {
                value: 5,
                message: "Um tiker tem no mínimo 5 caracteres.",
              },
              pattern: {
                value: /^[A-Z]{4}\d{1,2}$/,
                message: "Formato inválido (ex: PETR4 ou TAEE11)",
              },
              validate: (value) => {
                if (!validTickers.includes(value)) {
                  return "Ticker não encontrado";
                }
                if (!/[A-Z]{4}/.test(value)) {
                  return "Ticker deve começar com 4 letras";
                }
                if (!/\d{1,2}$/.test(value)) {
                  return "Ticker deve terminar com número";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Input
                size={"sm"}
                fontSize="0.8rem"
                {...field}
                value={field.value ?? ""}
                onChange={(event) => {
                  field.onChange(event.target.value.toUpperCase());
                }}
                placeholder="Ex: TAEE11"
                color="whiteAlpha.600"
                background="whiteAlpha.50"
                borderColor={errors.instrument ? "red.500" : "whiteAlpha.200"}
                _hover={{ borderColor: "#FFB800" }}
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="instrument"
            render={({ message }) => <p>{message}</p>}
          />
        </Box>

        <Flex justifyContent="space-between" gap="0.5rem">
          <Box mb="3" w="100%">
            <label
              style={{
                color: "#F0F0F0",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Preço
            </label>
            <Controller
              name="price"
              control={control}
              rules={{
                required: "Preço é obrigatório.",
              }}
              render={({ field }) => (
                <Input
                  size={"sm"}
                  fontSize="0.8rem"
                  type="text"
                  inputMode="decimal"
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const formatted = masks.formatBRL(raw);
                    field.onChange(formatted);
                  }}
                  placeholder="Ex: 1.234,56"
                  color="whiteAlpha.600"
                  background="whiteAlpha.50"
                  borderColor={errors.price ? "red.500" : "whiteAlpha.200"}
                  _hover={{ borderColor: "#FFB800" }}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="price"
              render={({ message }) => <p>{message}</p>}
            />
          </Box>

          <Box mb="3" w="100%">
            <label
              style={{
                color: "#F0F0F0",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Quantidade
            </label>
            <Controller
              name="quantity"
              control={control}
              rules={{
                required: "Quantidade é obrigatória.",
                validate: (value) => {
                  if (value < 1) {
                    return "Quantidade deve ser no mínimo 1";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <Input
                  pattern=""
                  fontSize="0.8rem"
                  size={"sm"}
                  type="number"
                  {...field}
                  placeholder="Ex: 20"
                  color="whiteAlpha.600"
                  background="whiteAlpha.50"
                  borderColor={errors.quantity ? "red.500" : "whiteAlpha.200"}
                  _hover={{ borderColor: "#FFB800" }}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="quantity"
              render={({ message }) => <p>{message}</p>}
            />
          </Box>
        </Flex>

        <Button
          size="sm"
          w="100%"
          type="submit"
          bg={side === "BUY" ? "#00B67A" : "#FF5C5C"}
          color="#F0F0F0"
          _hover={{ bg: side === "BUY" ? "#00A36F" : "#E14C4C" }}
          disabled={createOrderMutation.isPending}
        >
          {createOrderMutation.isPending
            ? "Processando..."
            : side === "BUY"
              ? "Comprar"
              : "Vender"}
        </Button>
      </form>
    </Box>
  );
}
