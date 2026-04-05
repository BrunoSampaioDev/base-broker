import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CancelOrderConfirmation } from "./order-cancel-confirmation";
import { withSetup } from "@/app/test/helpers/with-setup";
import { cancelOrder } from "@/app/services/cancel-order";
import { toaster } from "@/app/components/ui/toaster";

jest.mock("../../services/cancel-order");

const mockCancelOrder = cancelOrder as jest.MockedFunction<typeof cancelOrder>;

describe("CancelOrderConfirmation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      open: true,
      onClose: jest.fn(),
      orderId: "order-123",
      ...props,
    };

    return render(withSetup(<CancelOrderConfirmation {...defaultProps} />));
  };

  it("should render modal when open is true", () => {
    renderComponent({ open: true });
    expect(screen.getByText("Cancelamento de ordem")).toBeInTheDocument();
  });

  it("should not render modal content when open is false", () => {
    render(
      withSetup(
        <CancelOrderConfirmation
          open={false}
          onClose={jest.fn()}
          orderId="order-123"
        />,
      ),
    );
    expect(screen.queryByText("Cancelamento de ordem")).not.toBeInTheDocument();
  });

  it("should call onClose(false) when close button is clicked", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(
      withSetup(
        <CancelOrderConfirmation
          open={true}
          onClose={onClose}
          orderId="order-123"
        />,
      ),
    );

    await user.click(screen.getByTestId("close-button"));

    expect(onClose).toHaveBeenCalledWith(false);
  });

  it("should display error message when submitting empty form", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(
      screen.getByRole("button", {
        name: /cancelar ordem/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          /a assinatura eletrônica é obrigatória para cancelar a ordem/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("should not call mutation if form validation fails", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(
      screen.getByRole("button", {
        name: /cancelar ordem/i,
      }),
    );

    await waitFor(() => {
      expect(mockCancelOrder).not.toHaveBeenCalled();
    });
  });

  it("should call cancelOrder mutation when form is submitted with valid data", async () => {
    const user = userEvent.setup();

    renderComponent();

    const input = screen.getByPlaceholderText(
      /digite qualquer coisa para confirmar/i,
    );
    await user.type(input, "any-confirmation");

    const submitButton = screen.getByRole("button", {
      name: /cancelar ordem/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCancelOrder).toHaveBeenCalledWith("order-123");
    });
  });

  it("should call onClose(false) after successful cancellation", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      withSetup(
        <CancelOrderConfirmation
          open={true}
          onClose={onClose}
          orderId="order-123"
        />,
      ),
    );

    const input = screen.getByPlaceholderText(
      /digite qualquer coisa para confirmar/i,
    );
    await user.type(input, "confirmation");

    await user.click(
      screen.getByRole("button", {
        name: /cancelar ordem/i,
      }),
    );

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledWith(false);
    });
  });

  it("should display modal title and description", () => {
    renderComponent();

    expect(screen.getByText("Cancelamento de ordem")).toBeInTheDocument();
    expect(
      screen.getByText(
        /digite sua assinatura eletrônica para cancelar da ordem/i,
      ),
    ).toBeInTheDocument();
  });

  it("should display password input field", () => {
    renderComponent();

    const input = screen.getByPlaceholderText(
      /digite qualquer coisa para confirmar/i,
    );
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });

  it("should display close and cancel buttons", () => {
    renderComponent();

    expect(screen.getByTestId("close-button")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /cancelar ordem/i,
      }),
    ).toBeInTheDocument();
  });

  it("should call toaster.create on successful cancellation", async () => {
    const user = userEvent.setup();
    const mockToasterCreate = jest.spyOn(toaster, "create");

    renderComponent();

    await user.type(
      screen.getByPlaceholderText(/digite qualquer coisa para confirmar/i),
      "confirmation",
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancelar ordem/i,
      }),
    );

    await waitFor(() => {
      expect(mockToasterCreate).toHaveBeenCalledWith({
        title: "Ordem cancelada com sucesso",
        description: expect.stringContaining("order-123"),
        type: "success",
      });
    });

    mockToasterCreate.mockRestore();
  });

  it("should call toaster.create on cancellation error", async () => {
    const user = userEvent.setup();
    const mockToasterCreate = jest.spyOn(toaster, "create");
    mockCancelOrder.mockRejectedValue(new Error("Cancellation failed"));

    renderComponent();

    await user.type(
      screen.getByPlaceholderText(/digite qualquer coisa para confirmar/i),
      "confirmation",
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancelar ordem/i,
      }),
    );

    await waitFor(() => {
      expect(mockToasterCreate).toHaveBeenCalledWith({
        title: "Erro ao cancelar ordem",
        description: expect.stringContaining("order-123"),
        type: "error",
      });
    });

    mockToasterCreate.mockRestore();
  });
});
