"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

type StockChartProps = {
  interval?: string;
  height?: number;
};

export function StockChart({ interval = "60", height = 380 }: StockChartProps) {
  const widgetRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();

  const ticker = searchParams.get("ticker");

  useEffect(() => {
    const widgetContainer = widgetRef.current;
    if (!widgetContainer) return;

    widgetContainer.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BMFBOVESPA:${ticker || "PETR4"}`,
      interval,
      timezone: "America/Sao_Paulo",
      theme: "dark",
      style: "1",
      locale: "br",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      support_host: "https://www.tradingview.com",
    });

    widgetContainer.appendChild(script);

    return () => {
      widgetContainer.innerHTML = "";
    };
  }, [interval, ticker]);

  return (
    <div
      className="tradingview-widget-container"
      style={{ width: "100%", minHeight: `${height}px` }}
    >
      <div
        className="tradingview-widget-container__widget"
        ref={widgetRef}
        style={{ width: "100%", height: `${height}px` }}
      />
    </div>
  );
}

export default StockChart;
