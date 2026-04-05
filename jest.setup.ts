import React from "react";
import "@testing-library/jest-dom";

type ChakraToastMockData = {
  type?: string;
  title?: string;
  description?: string;
  action?: { label: string };
  closable?: boolean;
};

declare global {
  var __chakraCreateToasterMock: jest.Mock;
  var __chakraToastMockData: ChakraToastMockData;
}

const mockCreateToaster = jest.fn(() => ({ create: jest.fn() }));
globalThis.__chakraCreateToasterMock = mockCreateToaster;
globalThis.__chakraToastMockData = {
  type: "success",
  title: "Default title",
  description: "Default description",
  action: undefined,
  closable: false,
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

if (typeof global.structuredClone === "undefined") {
  global.structuredClone = (obj) => {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
  };
}

const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
Object.defineProperty(globalThis, "fetch", {
  value: fetchMock,
  writable: true,
  configurable: true,
});

beforeEach(() => {
  fetchMock.mockReset();
});

const replaceMock = jest.fn();
const pushMock = jest.fn();
const backMock = jest.fn();
const forwardMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock,
    back: backMock,
    forward: forwardMock,
    refresh: refreshMock,
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  replaceMock.mockReset();
  pushMock.mockReset();
  backMock.mockReset();
  forwardMock.mockReset();
  refreshMock.mockReset();
  globalThis.__chakraToastMockData = {
    type: "success",
    title: "Default title",
    description: "Default description",
    action: undefined,
    closable: false,
  };
});

jest.mock("@chakra-ui/react", () => {
  const actual = jest.requireActual("@chakra-ui/react");
  const Div = ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", null, children);

  const shouldForwardProp = (key: string) =>
    key === "children" ||
    key === "role" ||
    key === "type" ||
    key === "disabled" ||
    key === "onClick" ||
    key === "value" ||
    key === "name" ||
    key === "placeholder" ||
    key === "id" ||
    key === "htmlFor" ||
    key.startsWith("data-") ||
    key.startsWith("aria-");

  const Box = ({
    children,
    as,
    ...props
  }: {
    children?: React.ReactNode;
    as?: React.ElementType;
    [key: string]: unknown;
  }) => {
    const element = as || "div";
    const forwardedProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => shouldForwardProp(key)),
    );

    return React.createElement(
      element,
      { "data-testid": "box", ...forwardedProps },
      children,
    );
  };
  const Button = ({
    children,
    loading,
    onClick,
    disabled,
    type,
    "data-testid": dataTestId,
  }: {
    children?: React.ReactNode;
    loading?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    "data-testid"?: string;
  }) =>
    React.createElement(
      "button",
      {
        onClick,
        disabled,
        type,
        "data-testid": dataTestId,
        "data-loading": loading ? "true" : "false",
      },
      children,
    );

  const ChakraToaster = ({
    toaster,
    insetInline,
    children,
  }: {
    toaster?: unknown;
    insetInline?: unknown;
    children?:
      | ((toast: ChakraToastMockData) => React.ReactNode)
      | React.ReactNode;
  }) =>
    React.createElement(
      "div",
      {
        "data-testid": "chakra-toaster",
        "data-has-toaster": String(Boolean(toaster)),
        "data-inset-inline": JSON.stringify(insetInline),
      },
      typeof children === "function"
        ? children(globalThis.__chakraToastMockData)
        : null,
    );

  const Spinner = () =>
    React.createElement("span", { "data-testid": "spinner" });
  const Stack = ({ children }: { children?: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "stack" }, children);

  const Toast = {
    Root: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "toast-root" }, children),
    Indicator: () =>
      React.createElement("span", { "data-testid": "toast-indicator" }),
    Title: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("span", null, children),
    Description: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("span", null, children),
    ActionTrigger: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(
        "button",
        { "data-testid": "toast-action" },
        children,
      ),
    CloseTrigger: () =>
      React.createElement("button", { "data-testid": "toast-close" }, "x"),
  };

  return {
    ...actual,
    Box,
    Button,
    Toaster: ChakraToaster,
    Spinner,
    Stack,
    Toast,
    createToaster: mockCreateToaster,
    CloseButton: ({ onClick }: { onClick?: () => void }) =>
      React.createElement("button", { onClick, type: "button" }, "fechar"),
    IconButton: ({
      children,
      onClick,
      disabled,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
    }: {
      children?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      "aria-label"?: string;
      "data-testid"?: string;
    }) =>
      React.createElement(
        "button",
        {
          type: "button",
          onClick,
          disabled,
          "aria-label": ariaLabel,
          "data-testid": dataTestId,
        },
        children,
      ),
    Portal: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "portal" }, children),
    Drawer: {
      Root: Div,
      Trigger: Div,
      Positioner: Div,
      Content: Div,
      Header: Div,
      Title: ({ children }: { children?: React.ReactNode }) =>
        React.createElement("h2", null, children),
      Body: Div,
      Footer: Div,
      CloseTrigger: Div,
    },
  };
});

jest.mock("./app/components/ui/toaster", () => ({
  toaster: {
    create: jest.fn(),
  },
  Toaster: () => null,
}));
