import { render, waitFor } from "@testing-library/react";
import { StockChart } from "./stock";
import { useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

const makeReadonlySearchParams = (query = "") =>
  new URLSearchParams(query) as unknown as ReturnType<typeof useSearchParams>;

describe("StockChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseSearchParams.mockReturnValue(makeReadonlySearchParams());
  });

  it("should render tradingview container with provided height", () => {
    const { container } = render(<StockChart height={420} />);

    const root = container.querySelector(
      ".tradingview-widget-container",
    ) as HTMLDivElement;
    const widget = container.querySelector(
      ".tradingview-widget-container__widget",
    ) as HTMLDivElement;

    expect(root).toBeInTheDocument();
    expect(widget).toBeInTheDocument();
    expect(root.style.minHeight).toBe("420px");
    expect(widget.style.height).toBe("420px");
  });

  it("should inject tradingview script with default PETR4 symbol", async () => {
    const { container } = render(<StockChart />);

    await waitFor(() => {
      const script = container.querySelector(
        ".tradingview-widget-container__widget script",
      ) as HTMLScriptElement;

      expect(script).toBeInTheDocument();
      expect(script.src).toContain(
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      );

      const config = JSON.parse(script.innerHTML) as {
        symbol: string;
        interval: string;
      };

      expect(config.symbol).toBe("BMFBOVESPA:PETR4");
      expect(config.interval).toBe("60");
    });
  });

  it("should inject tradingview script with ticker from query string", async () => {
    mockedUseSearchParams.mockReturnValue(
      makeReadonlySearchParams("ticker=VALE3"),
    );

    const { container } = render(<StockChart interval="15" />);

    await waitFor(() => {
      const script = container.querySelector(
        ".tradingview-widget-container__widget script",
      ) as HTMLScriptElement;
      const config = JSON.parse(script.innerHTML) as {
        symbol: string;
        interval: string;
      };

      expect(config.symbol).toBe("BMFBOVESPA:VALE3");
      expect(config.interval).toBe("15");
    });
  });
});
