import { render } from "@testing-library/react";
import { withprovider } from "@/app/test/helpers/with-provider";
import { OrderTableLoading } from "./order-table-loading";

describe("OrderTableLoading", () => {
  it("should render the loading state message", () => {
    const { getByText } = render(withprovider(<OrderTableLoading />));

    expect(getByText("Carregando ordens...")).toBeInTheDocument();
  });
});
