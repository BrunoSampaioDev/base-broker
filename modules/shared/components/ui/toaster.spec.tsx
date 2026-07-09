import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.unmock("@/modules/shared/components/ui/toaster");
jest.unmock("./toaster");

import { withprovider } from "@/modules/shared/test/helpers/with-provider";
import { Toaster, toaster } from "./toaster";

describe("Toaster", () => {
  afterEach(() => {
    act(() => {
      toaster.remove();
    });
  });

  it("should render title, description and a dismiss button for a closable toast", async () => {
    render(withprovider(<Toaster />));

    act(() => {
      toaster.create({
        type: "success",
        title: "Operacao concluida",
        description: "A ordem foi criada",
        closable: true,
      });
    });

    expect(await screen.findByText("Operacao concluida")).toBeInTheDocument();
    expect(screen.getByText("A ordem foi criada")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render a spinner for a loading toast", async () => {
    render(withprovider(<Toaster />));

    act(() => {
      toaster.create({
        type: "loading",
        title: "Processando",
      });
    });

    const title = await screen.findByText("Processando");
    const toastRoot = title.closest('[role="status"]');

    expect(toastRoot?.querySelector(".chakra-spinner")).toBeInTheDocument();
  });

  it("should render an action button when the toast has an action", async () => {
    render(withprovider(<Toaster />));

    act(() => {
      toaster.create({
        type: "info",
        title: "Ordem cancelada",
        action: { label: "Desfazer", onClick: jest.fn() },
      });
    });

    expect(
      await screen.findByRole("button", { name: "Desfazer" }),
    ).toBeInTheDocument();
  });

  it("should dismiss the toast when the close button is clicked", async () => {
    const user = userEvent.setup();

    render(withprovider(<Toaster />));

    act(() => {
      toaster.create({
        type: "success",
        title: "Ordem criada",
        closable: true,
      });
    });

    expect(await screen.findByText("Ordem criada")).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.queryByText("Ordem criada")).not.toBeInTheDocument();
    });
  });
});
