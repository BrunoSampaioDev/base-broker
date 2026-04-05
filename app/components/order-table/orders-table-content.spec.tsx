import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrdersTableContent } from "./orders-table-content";
import { withSetup } from "@/app/test/helpers/with-setup";
import { order } from "@/app/test/mocks/order-test-data-builder";
import type { Order } from "@/app/types/order";

describe("OrdersTableContent", () => {
  it("should render the order table content with the correct data", () => {
    render(withSetup(<OrdersTableContent data={[order.build()]} />));
    expect(screen.getByText("PETR4")).toBeInTheDocument();
    expect(screen.getByText("Compra")).toBeInTheDocument();
    expect(screen.getByText("R$ 43,00")).toBeInTheDocument();
    expect(screen.getByText("360")).toBeInTheDocument();
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
    expect(screen.getByText("03/04/26 ás 02:33")).toBeInTheDocument();
  });

  it.each<[Order["side"], string]>([
    ["BUY", "Compra"],
    ["SELL", "Venda"],
  ])(
    "should render the correct side text for side %s",
    (side, translatedText) => {
      render(
        withSetup(<OrdersTableContent data={[order.withSide(side).build()]} />),
      );

      expect(screen.getByText(translatedText)).toBeInTheDocument();
    },
  );

  it.each<[Order["status"], string]>([
    ["OPEN", "Aberta"],
    ["PARTIAL", "Parcial"],
    ["CANCELLED", "Cancelada"],
    ["EXECUTED", "Executada"],
  ])(
    "should render the correct status text for status %s",
    (status, translatedStatus) => {
      render(
        withSetup(
          <OrdersTableContent data={[order.withStatus(status).build()]} />,
        ),
      );

      const statusElement = screen.getByText(translatedStatus);
      expect(statusElement).toBeInTheDocument();
    },
  );

  it("should sort by Instrumento asc and desc when clicking header column", async () => {
    const user = userEvent.setup();

    const firstOrder = order
      .withId("ad89c88e-37a3-475c-885e-0729caa7736r")
      .withInstrument("VALE3")
      .build();

    const secondOrder = order
      .withId("ad89c88e-37a3-475c-885e-0729caa7736t")
      .withInstrument("BBDC4")
      .build();

    const thirdOrder = order
      .withId("ad89c88e-37a3-475c-885e-0729caa7736u")
      .withInstrument("PETR4")
      .build();

    const { container } = render(
      withSetup(
        <OrdersTableContent data={[firstOrder, secondOrder, thirdOrder]} />,
      ),
    );

    await user.click(screen.getByRole("button", { name: /Instrumento/i }));

    let rows = container.querySelectorAll("tbody tr");
    expect(rows[0].querySelectorAll("td")[1]).toHaveTextContent("BBDC4");
    expect(rows[1].querySelectorAll("td")[1]).toHaveTextContent("PETR4");
    expect(rows[2].querySelectorAll("td")[1]).toHaveTextContent("VALE3");

    await user.click(screen.getByRole("button", { name: /Instrumento/i }));

    rows = container.querySelectorAll("tbody tr");
    expect(rows[0].querySelectorAll("td")[1]).toHaveTextContent("VALE3");
    expect(rows[1].querySelectorAll("td")[1]).toHaveTextContent("PETR4");
    expect(rows[2].querySelectorAll("td")[1]).toHaveTextContent("BBDC4");
  });
});
