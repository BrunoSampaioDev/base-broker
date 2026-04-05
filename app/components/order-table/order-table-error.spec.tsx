import { render } from "@testing-library/react";
import { withprovider } from "@/app/test/helpers/with-provider";
import { OrderTableError } from "./order-table-error";

describe("OrderTableError", () => {
  it("should render the error state message", () => {
    const { getByText } = render(withprovider(<OrderTableError />));

    expect(getByText("Erro ao buscar ordens")).toBeInTheDocument();
  });
});
