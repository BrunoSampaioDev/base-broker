import "@testing-library/jest-dom";

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
});

jest.mock("./modules/shared/components/ui/toaster", () => ({
  toaster: {
    create: jest.fn(),
  },
  Toaster: () => null,
}));
