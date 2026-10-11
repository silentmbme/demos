import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { ApexOptions } from "apexcharts";
import { useChartTheme } from "@/lib/chart-config";

const ReactApexChart = lazy(() => import("react-apexcharts"));

export interface ApexChartProps {
  options: ApexOptions;
  series: ApexOptions["series"];
  type:
    | "line"
    | "area"
    | "bar"
    | "donut"
    | "pie"
    | "polarArea"
    | "radialBar"
    | "radar"
    | "heatmap"
    | "scatter"
    | "bubble"
    | "treemap";
  height?: number | string | undefined;
  width?: number | string | undefined;
}

function Skeleton({ height }: { height?: number | string | undefined }) {
  return (
    <div
      className="w-full animate-pulse rounded-lg bg-muted"
      style={{ height: typeof height === "number" ? `${height}px` : (height ?? "260px") }}
      aria-hidden
    />
  );
}

function ThemedChart({ options, series, type, height, width }: ApexChartProps) {
  // Remounts whenever the mode or skin changes so Apex re-reads resolved tokens.
  const { themeKey } = useChartTheme();
  return (
    <Suspense fallback={<Skeleton height={height} />}>
      <ReactApexChart
        key={themeKey}
        options={options}
        series={series as never}
        type={type}
        height={height}
        width={width}
      />
    </Suspense>
  );
}

export function ApexChart({ options, series, type, height = 260, width }: ApexChartProps) {
  return (
    <ClientOnly fallback={<Skeleton height={height} />}>
      <ThemedChart options={options} series={series} type={type} height={height} width={width} />
    </ClientOnly>
  );
}
