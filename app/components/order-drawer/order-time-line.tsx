import { format } from "@/app/helpers/formaters";
import { useGetOrderHistory } from "@/app/hooks/use-get-order-history";
import type { Order } from "@/app/types/order";
import type { OrderStatus } from "@/app/types/shared-types";
import { Timeline } from "@chakra-ui/react";
import {
  LuCheckCheck,
  LuCircleOff,
  LuCirclePlus,
  LuCircleX,
} from "react-icons/lu";

function StatusIcon({ status }: { status: Order["status"] }) {
  if (status === "EXECUTED") return <LuCheckCheck />;
  if (status === "CANCELLED") return <LuCircleX />;
  if (status === "PARTIAL") return <LuCircleOff />;
}

export function OrderTimeLine({ order }: { order: Order }) {
  const { data } = useGetOrderHistory(order.id);

  const statusTranslate: Record<Order["status"], string> = {
    PARTIAL: "Execução parcial",
    EXECUTED: "Ordem Executada",
    CANCELLED: "Ordem Cancelada",
    OPEN: "Criação da ordem",
  };

  return (
    <Timeline.Root maxW="400px">
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>
            <LuCirclePlus />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>Criação da ordem</Timeline.Title>
          <Timeline.Description>{`Tipo de ordem: ${format.side(order.side).side}`}</Timeline.Description>
          <Timeline.Description>{`Data: ${format.date(order.createdAt)}`}</Timeline.Description>
          <Timeline.Description>{`Hora: ${format.hour(order.createdAt)}`}</Timeline.Description>
          <Timeline.Description>{`Ativo: ${order.instrument}`}</Timeline.Description>
          <Timeline.Description>{`Quantidade: ${order.quantity}`}</Timeline.Description>
          <Timeline.Description>{`Valor: R$ ${format.currency(order.price)}`}</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>

      {data?.map((history) => {
        return (
          <Timeline.Item key={history.id}>
            <Timeline.Connector>
              <Timeline.Separator />
              <Timeline.Indicator>
                <StatusIcon status={history.status} />
              </Timeline.Indicator>
            </Timeline.Connector>
            <Timeline.Content>
              <Timeline.Content>
                <Timeline.Title>
                  {statusTranslate[history.status as OrderStatus]}
                </Timeline.Title>
                <Timeline.Description>{`Data: ${format.date(history.timestamp)}`}</Timeline.Description>
                <Timeline.Description>{`Hora: ${format.hour(history.timestamp)}`}</Timeline.Description>
                <Timeline.Description>
                  {history.status === "CANCELLED"
                    ? history.tradedQuantity > 0
                      ? `Quantidade total executada: ${history.tradedQuantity}`
                      : null
                    : `Quantidade executada: ${history.tradedQuantity}`}
                </Timeline.Description>
                <Timeline.Description>
                  {history.remaining > 0 &&
                    `Quantidade ${history.status === "CANCELLED" ? "cancelada" : "restante"}: ${history.remaining}`}
                </Timeline.Description>
              </Timeline.Content>
            </Timeline.Content>
          </Timeline.Item>
        );
      })}
    </Timeline.Root>
  );
}
