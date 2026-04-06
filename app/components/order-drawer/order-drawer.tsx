import {
  Button,
  CloseButton,
  Drawer,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import { OrderTimeLine } from "./order-time-line";
import type { Order } from "@/app/types/order";
import { CancelOrderConfirmation } from "./order-cancel-confirmation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function OrderDrawer({ order }: { order: Order }) {
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
  const queryClient = useQueryClient();
  const [disableCancelButton, setDisableCancelButton] = useState(false);

  return (
    <>
      <CancelOrderConfirmation
        open={openModalConfirmation}
        onClose={setOpenModalConfirmation}
        orderId={order.id}
        disableCancelButton={() => setDisableCancelButton(true)}
      />
      <Drawer.Root
        closeOnInteractOutside={false}
        modal={false}
        onOpenChange={(details) => {
          if (!details.open) {
            queryClient.refetchQueries({ queryKey: ["orders"] });
          }
        }}
      >
        <Drawer.Trigger asChild>
          <IconButton rounded="full" variant="plain" size="xs">
            <FaRegEdit />
          </IconButton>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Positioner pointerEvents="none">
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Histórico da Ordem</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <OrderTimeLine order={order} />
              </Drawer.Body>
              <Drawer.Footer>
                <Button
                  width="100%"
                  onClick={() => setOpenModalConfirmation(true)}
                  bg="red.500"
                  color="white"
                  _hover={{ bg: "red.600" }}
                  disabled={
                    disableCancelButton ||
                    order.status === "EXECUTED" ||
                    order.status === "CANCELLED"
                  }
                >
                  Cancelar ordem
                </Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}
