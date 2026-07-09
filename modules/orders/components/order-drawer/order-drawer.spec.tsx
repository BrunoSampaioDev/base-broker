import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderDrawer } from "./order-drawer";
import { order } from "@/modules/shared/test/mocks/order-test-data-builder";
import { withSetup } from "@/modules/shared/test/helpers/with-setup";

jest.mock("./order-time-line");

describe("OrderDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render order drawer content", async () => {
    const user = userEvent.setup();
    const mockOrder = order.withStatus("OPEN").build();

    render(withSetup(<OrderDrawer order={mockOrder} />));

    await user.click(
      screen.getByRole("button", { name: "Ver histórico da ordem" }),
    );

    expect(screen.getByText("Histórico da Ordem")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar ordem" }),
    ).toBeInTheDocument();
  });

  it("should open cancel confirmation modal", async () => {
    const user = userEvent.setup();
    const mockOrder = order.withStatus("OPEN").build();

    render(withSetup(<OrderDrawer order={mockOrder} />));

    await user.click(
      screen.getByRole("button", { name: "Ver histórico da ordem" }),
    );
    await user.click(screen.getByRole("button", { name: "Cancelar ordem" }));

    expect(screen.getByText("Cancelamento de ordem")).toBeInTheDocument();
  });

  it("should disable cancel button for executed and cancelled orders", async () => {
    const user = userEvent.setup();

    const { unmount } = render(
      withSetup(<OrderDrawer order={order.withStatus("EXECUTED").build()} />),
    );

    await user.click(
      screen.getByRole("button", { name: "Ver histórico da ordem" }),
    );

    expect(
      screen.getByRole("button", { name: "Cancelar ordem" }),
    ).toBeDisabled();

    unmount();

    render(
      withSetup(<OrderDrawer order={order.withStatus("CANCELLED").build()} />),
    );

    await user.click(
      screen.getByRole("button", { name: "Ver histórico da ordem" }),
    );

    expect(
      screen.getByRole("button", { name: "Cancelar ordem" }),
    ).toBeDisabled();
  });
});
