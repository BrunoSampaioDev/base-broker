import { render } from "@testing-library/react";
import { withprovider } from "@/app/test/helpers/with-provider";
import { OrderTableHead } from "./order-table-head";

const headercolumns = [
  "ID",
  "Instrumento",
  "Lado",
  "Preço",
  "Quantidade",
  "Restante",
  "Status",
  "Criada em",
  "Ação",
];
describe("OrderTableHead", () => {
  it("should render the order table header", () => {
    const { getByText } = render(
      withprovider(
        <table>
          <OrderTableHead />
        </table>,
      ),
    );

    headercolumns.forEach((header) => {
      expect(getByText(new RegExp(header))).toBeInTheDocument();
    });
  });
});
