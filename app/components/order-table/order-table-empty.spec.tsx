import { render, screen } from "@testing-library/react";
import { OrderTableEmpty } from "./order-table-empty";
import { withprovider } from "@/app/test/helpers/with-provider";

describe("OrderTableEmpty", () => {
  it("should render the empty state message", () => {
    render(withprovider(<OrderTableEmpty />));

    expect(screen.getByText("Nenhuma ordem encontrada")).toBeInTheDocument();
  });
});
