import { render, screen } from "@testing-library/react";

jest.unmock("@/app/components/ui/toaster");
jest.unmock("./toaster");

import { Toaster, toaster } from "./toaster";

describe("Toaster", () => {
  beforeEach(() => {
    globalThis.__chakraToastMockData = {
      type: "success",
      title: "Default title",
      description: "Default description",
      action: undefined,
      closable: false,
    };
  });

  it("should create toaster with expected configuration", () => {
    expect(globalThis.__chakraCreateToasterMock).toHaveBeenCalledWith({
      placement: "bottom-end",
      pauseOnPageIdle: true,
    });
    expect(toaster).toBeDefined();
  });

  it("should render chakra toaster with default insetInline", () => {
    render(<Toaster />);

    expect(screen.getByTestId("portal")).toBeInTheDocument();
    expect(screen.getByTestId("chakra-toaster")).toHaveAttribute(
      "data-has-toaster",
      "true",
    );
    expect(screen.getByTestId("chakra-toaster")).toHaveAttribute(
      "data-inset-inline",
      JSON.stringify({ mdDown: "4" }),
    );
  });

  it("should render toast title, description and indicator for non-loading toast", () => {
    globalThis.__chakraToastMockData = {
      type: "success",
      title: "Operacao concluida",
      description: "A ordem foi criada",
      closable: true,
    };

    render(<Toaster />);

    expect(screen.getByText("Operacao concluida")).toBeInTheDocument();
    expect(screen.getByText("A ordem foi criada")).toBeInTheDocument();
    expect(screen.getByTestId("toast-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("toast-close")).toBeInTheDocument();
  });

  it("should render spinner and action when toast type is loading", () => {
    globalThis.__chakraToastMockData = {
      type: "loading",
      title: "Processando",
      action: { label: "Desfazer" },
      closable: false,
    };

    render(<Toaster />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
    expect(screen.getByTestId("toast-action")).toHaveTextContent("Desfazer");
    expect(screen.queryByTestId("toast-indicator")).not.toBeInTheDocument();
  });
});
