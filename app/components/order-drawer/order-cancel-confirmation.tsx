import { cancelOrder } from "@/app/services/cancel-order";
import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  Input,
  Portal,
  Text,
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toaster } from "../ui/toaster";

export function CancelOrderConfirmation({
  open,
  onClose,
  orderId,
  disableCancelButton,
}: {
  open: boolean;
  onClose: (value: boolean) => void;
  orderId: string;
  disableCancelButton: () => void;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["history", orderId] });
      toaster.create({
        title: "Ordem cancelada com sucesso",
        description: `Ordem cancelada com sucesso. ID: ${orderId}`,
        type: "success",
      });
      disableCancelButton();
    },
    onError: () => {
      toaster.create({
        title: "Erro ao cancelar ordem",
        description: `Não foi possível cancelar a ordem. ID: ${orderId}`,
        type: "error",
      });
    },
  });

  function onSubmit() {
    cancelOrderMutation.mutate(orderId);
    onClose(false);
  }

  return (
    <HStack wrap="wrap" gap="4">
      <Dialog.Root
        placement="center"
        motionPreset="slide-in-bottom"
        open={open}
        onEscapeKeyDown={() => onClose(false)}
        onInteractOutside={() => onClose(false)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Cancelamento de ordem</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Text color="whiteAlpha.600">
                    Digite sua assinatura eletrônica para cancelar da ordem.
                  </Text>
                  <Flex flexDirection="column" gap="0.5rem">
                    <Input
                      type="password"
                      {...register("cancelConfirmation", {
                        required:
                          "A assinatura eletrônica é obrigatória para cancelar a ordem.",
                      })}
                      placeholder="Digite qualquer coisa para confirmar"
                      mt="4"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="cancelConfirmation"
                      render={({ message }) => <p>{message}</p>}
                    />
                  </Flex>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button
                      data-testid="close-button"
                      variant="outline"
                      onClick={() => onClose(false)}
                    >
                      Fechar
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    type="submit"
                    bg="red.500"
                    color="white"
                    _hover={{ bg: "red.600" }}
                  >
                    Cancelar Ordem
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild onClick={() => onClose(false)}>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </form>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
}
