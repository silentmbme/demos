import { useMemo, useState } from "react";
import type { ApexOptions } from "apexcharts";
import { Download, MoreHorizontal, Plus, SlidersHorizontal } from "lucide-react";

import { ApexChart } from "@/components/charts/ApexChart";
import { Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { mergeOptions, useChartTheme } from "@/lib/chart-config";

/* =====================================================
   Types
===================================================== */

type Mode =
  | "apex"
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "radar"
  | "radial"
  | "scatter"
  | "mixed"
  | "heatmap"
  | "treemap"
  | "sparkline";

type ChartType =
  | "line"
  | "area"
  | "bar"
  | "donut"
  | "pie"
  | "radialBar"
  | "radar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "treemap";

type ChartSpec = {
  title: string;
  description: string;
  type: ChartType;
  series: ApexOptions["series"];
  options: ApexOptions;
  height?: number;
  className?: string;
};

/* =====================================================
   Copy
===================================================== */

const copy: Record<Mode, [string, string]> = {
  apex: ["Apex Charts", "Practical chart patterns built with live ApexCharts options."],

  line: ["Line Charts", "Trend, comparison, time-series and forecast chart patterns."],

  area: ["Area Charts", "Volume and movement patterns with layered, readable areas."],

  bar: ["Bar Charts", "Comparisons, rankings and stacked category breakdowns."],

  pie: ["Pie & Donut Charts", "Composition, share and progress charts for business data."],

  radar: ["Radar Charts", "Multi-dimensional scorecards and comparative profiles."],

  radial: ["Radial Charts", "Goal completion and compact circular performance indicators."],

  scatter: [
    "Scatter & Bubble Charts",
    "Distribution patterns, correlation and weighted data points.",
  ],

  mixed: ["Mixed Charts", "Layered chart types for comparing related measures in one view."],

  heatmap: ["Heatmap Charts", "Dense activity and performance patterns across two dimensions."],

  treemap: ["Treemap Charts", "Hierarchy and proportional contribution in a compact visual."],

  sparkline: ["Sparkline Charts", "Small, context-rich charts designed for compact metrics."],
};

/* =====================================================
   Shared Labels
===================================================== */

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* =====================================================
   Chart Tile
===================================================== */

function Tile({ spec }: { spec: ChartSpec }) {
  return (
    <Card
      title={spec.title}
      description={spec.description}
      className={spec.className}
      action={
        <button
          type="button"
          className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label={`${spec.title} options`}
        ></button>
      }
    >
      <ApexChart
        type={spec.type}
        options={spec.options}
        series={spec.series}
        height={spec.height ?? 280}
      />
    </Card>
  );
}

/* =====================================================
   Metric Card
===================================================== */

function metric(label: string, value: string, detail: string) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>

      <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{detail}</p>
    </div>
  );
}

/* =====================================================
   Charts Showcase App
===================================================== */

export function ChartsShowcaseApp({ mode }: { mode: Mode }) {
  const { base } = useChartTheme();

  const [range, setRange] = useState("This year");

  const [compact, setCompact] = useState(false);

  const specs = useMemo(() => buildSpecs(mode, base, range), [mode, base, range]);

  const [title, subtitle] = copy[mode];

  return (
    <div className="space-y-5 pb-8">
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        breadcrumb={["Vexui", "Charts", title]}
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-4" />
              Export
            </Button>

            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              Create report
            </Button>
          </>
        }
      />

      {/* =================================================
          Apex Overview Metrics
      ================================================= */}

      {mode === "apex" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metric("Total revenue", "$284,620", "+18.6% vs last year")}

          {metric("Conversion rate", "4.82%", "+0.7% vs last month")}

          {metric("New customers", "8,249", "+12.3% vs last month")}

          {metric("Active campaigns", "24", "3 launching this week")}
        </div>
      )}

      {/* =================================================
          Chart Controls
      ================================================= */}

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />

          <span className="text-sm font-medium">Chart controls</span>

          <Badge tone="primary">Live data</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["7 days", "30 days", "This year"].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setRange(item)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                range === item
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCompact((value) => !value)}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            {compact ? "Comfortable" : "Compact"}
          </button>
        </div>
      </div>

      {/* =================================================
          Chart Grid
      ================================================= */}

      <div className={cn("grid gap-4", compact ? "xl:grid-cols-3" : "xl:grid-cols-2")}>
        {specs.map((spec) => (
          <Tile key={spec.title} spec={spec} />
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   Build Chart Specifications
===================================================== */

function buildSpecs(mode: Mode, base: ApexOptions, range: string): ChartSpec[] {
  /* ===================================================
     Option Merger
  =================================================== */

  const option = (override: ApexOptions) => mergeOptions(base, override);

  /* ===================================================
     Shared Sales Data
  =================================================== */

  const sales =
    range === "7 days"
      ? [18, 25, 22, 34, 28, 39, 44]
      : range === "30 days"
        ? [32, 38, 35, 47, 43, 55, 50, 63]
        : [42, 48, 45, 56, 62, 58, 70, 76];

  /* ===================================================
     Line Chart Builder
  =================================================== */

  const line = (name: string, data = sales, extra: ApexOptions = {}): ChartSpec => ({
    title: name,
    description: "Performance across the selected period",

    type: "line",

    series: [
      {
        name: "Current period",
        data,
      },
      {
        name: "Previous period",
        data: data.map((value) => Math.max(10, value - 9)),
      },
    ],

    options: option({
      chart: {
        type: "line",
      },

      xaxis: {
        categories: months,
      },

      markers: {
        size: 3,

        hover: {
          size: 5,
        },
      },

      ...extra,
    }),
  });

  /* ===================================================
     Area Chart Builder
  =================================================== */

  const area = (name: string, extra: ApexOptions = {}): ChartSpec => ({
    title: name,
    description: "Volume trend across the selected period",

    type: "area",

    series: [
      {
        name: "Revenue",
        data: sales,
      },
      {
        name: "Forecast",
        data: sales.map((value) => value - 12),
      },
    ],

    options: option({
      chart: {
        type: "area",
      },

      xaxis: {
        categories: months,
      },

      fill: {
        type: "gradient",

        gradient: {
          opacityFrom: 0.42,
          opacityTo: 0.03,
          stops: [0, 95, 100],
        },
      },

      ...extra,
    }),
  });

  /* ===================================================
     Bar Chart Builder
  =================================================== */

  const bars = (name: string, extra: ApexOptions = {}): ChartSpec => ({
    title: name,
    description: "Category comparison for the current period",

    type: "bar",

    series: [
      {
        name: "Orders",
        data: [44, 52, 38, 61, 48, 56],
      },
      {
        name: "Returns",
        data: [12, 14, 10, 18, 12, 16],
      },
    ],

    options: option({
      chart: {
        type: "bar",
      },

      xaxis: {
        categories: ["Direct", "Organic", "Email", "Social", "Partner", "Referral"],
      },

      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "52%",
        },
      },

      ...extra,
    }),
  });

  /* ===================================================
     Pie / Donut Builder
  =================================================== */

  const donut = (name: string, pie = false): ChartSpec => ({
    title: name,
    description: "Distribution by source",

    type: pie ? "pie" : "donut",

    series: [44, 26, 17, 13],

    options: option({
      chart: {
        type: pie ? "pie" : "donut",
      },

      labels: ["Organic", "Direct", "Paid", "Partner"],

      legend: {
        position: "bottom",
        horizontalAlign: "center",
      },

      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: !pie,

              total: {
                show: !pie,
                label: "Sessions",

                formatter: () => "84.6K",
              },
            },
          },
        },
      },
    }),
  });

  /* ===================================================
     Radar Chart Builder
  =================================================== */

  const radar = (name: string): ChartSpec => ({
    title: name,
    description: "Scorecard across five customer dimensions",

    type: "radar",

    series: [
      {
        name: "This month",

        data: [78, 83, 72, 88, 64],
      },
      {
        name: "Last month",

        data: [64, 70, 68, 73, 58],
      },
    ],

    options: option({
      chart: {
        type: "radar",
      },

      xaxis: {
        categories: ["Quality", "Speed", "Reach", "Retention", "Value"],
      },

      stroke: {
        width: 2,
      },

      fill: {
        opacity: 0.2,
      },

      markers: {
        size: 3,
      },
    }),
  });

  /* ===================================================
     Radial Chart Builder
  =================================================== */

  const radial = (name: string, values = [76, 58, 89]): ChartSpec => ({
    title: name,
    description: "Current goal completion by workstream",

    type: "radialBar",

    series: values,

    options: option({
      chart: {
        type: "radialBar",
      },

      labels: ["Revenue", "Retention", "Quality"],

      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },

      plotOptions: {
        radialBar: {
          hollow: {
            size: "34%",
          },

          dataLabels: {
            name: {
              fontSize: "12px",
            },

            value: {
              fontSize: "22px",
              fontWeight: 700,
            },

            total: {
              show: true,
              label: "Average",

              formatter: () =>
                `${Math.round(values.reduce((total, value) => total + value, 0) / values.length)}%`,
            },
          },
        },
      },
    }),
  });

  /* ===================================================
     Scatter / Bubble Builder
  =================================================== */

  const scatter = (name: string, bubble = false): ChartSpec => ({
    title: name,

    description: bubble
      ? "Weighted opportunity data across account value and fit"
      : "Distribution of response time and satisfaction",

    type: bubble ? "bubble" : "scatter",

    series: bubble
      ? [
          {
            name: "Enterprise",

            data: [
              [12, 28, 18],
              [18, 42, 15],
              [27, 36, 24],
              [36, 54, 19],
              [45, 61, 28],
            ],
          },
          {
            name: "Growth",

            data: [
              [9, 18, 12],
              [15, 26, 16],
              [24, 34, 15],
              [32, 29, 20],
            ],
          },
        ]
      : [
          {
            name: "Support",

            data: [
              [2, 86],
              [3, 79],
              [4, 75],
              [5, 64],
              [6, 59],
              [7, 52],
            ],
          },
          {
            name: "Success",

            data: [
              [2, 94],
              [3, 89],
              [4, 85],
              [5, 78],
              [6, 75],
              [7, 69],
            ],
          },
        ],

    options: option({
      chart: {
        type: bubble ? "bubble" : "scatter",

        zoom: {
          enabled: true,
        },
      },

      xaxis: {
        tickAmount: 6,

        title: {
          text: bubble ? "Account value ($K)" : "Response time (hours)",
        },
      },

      yaxis: {
        title: {
          text: bubble ? "Fit score" : "Satisfaction score",
        },
      },

      markers: {
        size: bubble ? undefined : 6,
      },
    }),
  });

  /* ===================================================
     Heatmap Builder
  =================================================== */

  const heat = (name: string): ChartSpec => ({
    title: name,
    description: "Activity intensity by weekday and hour",

    type: "heatmap",

    series: ["09:00", "11:00", "13:00", "15:00", "17:00"].map((item, index) => ({
      name: item,

      data: week.map((day, dayIndex) => ({
        x: day,

        y: 12 + ((index * 13 + dayIndex * 17) % 78),
      })),
    })),

    options: option({
      chart: {
        type: "heatmap",
      },

      plotOptions: {
        heatmap: {
          shadeIntensity: 0.48,
          radius: 4,

          colorScale: {
            ranges: [
              {
                from: 0,
                to: 25,
                color: "#e0e7ff",
              },
              {
                from: 26,
                to: 50,
                color: "#818cf8",
              },
              {
                from: 51,
                to: 100,
                color: "#4f46e5",
              },
            ],
          },
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
    }),
  });

  /* ===================================================
     Treemap Builder
  =================================================== */

  const tree = (name: string): ChartSpec => ({
    title: name,
    description: "Share of revenue by product family",

    type: "treemap",

    series: [
      {
        data: [
          {
            x: "Analytics",
            y: 32,
          },
          {
            x: "Platform",
            y: 26,
          },
          {
            x: "Automation",
            y: 19,
          },
          {
            x: "Support",
            y: 14,
          },
          {
            x: "Partners",
            y: 9,
          },
        ],
      },
    ],

    options: option({
      chart: {
        type: "treemap",
      },

      legend: {
        show: false,
      },

      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },

      dataLabels: {
        enabled: true,

        style: {
          fontSize: "13px",
        },

        formatter: (
          text: string,
          opts: {
            value?: number;
          },
        ) => `${text}\n${opts.value ?? ""}%`,
      },
    }),
  });

  /* ===================================================
     Sparkline Builder
  =================================================== */

  const spark = (name: string, type: "line" | "area" | "bar", values: number[]): ChartSpec => ({
    title: name,
    description: "Compact metric trend for quick scanning",

    type,
    series: [
      {
        name,
        data: values,
      },
    ],

    height: 150,

    options: option({
      chart: {
        type,

        sparkline: {
          enabled: true,
        },
      },

      stroke: {
        curve: "smooth",
        width: 3,
      },

      fill:
        type === "area"
          ? {
              type: "gradient",

              gradient: {
                opacityFrom: 0.55,

                opacityTo: 0.04,
              },
            }
          : {
              opacity: 1,
            },

      plotOptions:
        type === "bar"
          ? {
              bar: {
                borderRadius: 4,
                columnWidth: "55%",
              },
            }
          : {},

      tooltip: {
        enabled: true,
      },

      grid: {
        show: false,
      },
    }),
  });

  /* ===================================================
     General Apex Charts
  =================================================== */

  const general = [
    line("Revenue performance"),

    area("Monthly active users"),

    bars("Orders by channel"),

    donut("Traffic sources"),

    radial("Team goals"),

    radar("Experience score"),

    scatter("Service response"),

    heat("Engagement activity"),

    tree("Product portfolio"),
  ];

  /* ===================================================
     Apex
  =================================================== */

  if (mode === "apex") {
    return general;
  }

  /* ===================================================
     Line Charts
  =================================================== */

  if (mode === "line") {
    return [
      line("Revenue trend"),

      line("Forecast vs actual", [24, 28, 31, 36, 42, 40, 49, 57], {
        forecastDataPoints: {
          count: 2,
          fillOpacity: 0.35,
          dashArray: 5,
        },
      }),

      {
        ...line("Multi-series comparison"),

        series: [
          {
            name: "Enterprise",
            data: [28, 35, 31, 44, 39, 52, 57, 61],
          },
          {
            name: "Growth",
            data: [19, 24, 27, 29, 35, 37, 44, 49],
          },
          {
            name: "Starter",
            data: [12, 16, 15, 20, 19, 23, 26, 31],
          },
        ],
      },
    ];
  }

  /* ===================================================
     Area Charts
  =================================================== */

  if (mode === "area") {
    return [
      area("Revenue movement"),

      {
        ...area("Stacked product usage", {
          chart: {
            type: "area",
            stacked: true,
          },
        }),

        series: [
          {
            name: "Core",
            data: [21, 28, 25, 34, 31, 40, 38, 45],
          },
          {
            name: "Automations",
            data: [13, 17, 19, 21, 25, 28, 31, 34],
          },
          {
            name: "Insights",
            data: [8, 11, 10, 16, 14, 18, 21, 23],
          },
        ],
      },

      {
        ...area("Negative and positive change"),

        series: [
          {
            name: "Net growth",

            data: [12, -4, 16, 9, -7, 22, 14, 27],
          },
        ],

        options: option({
          chart: {
            type: "area",
          },

          xaxis: {
            categories: months,
          },

          colors: ["#10b981"],

          fill: {
            type: "gradient",

            gradient: {
              opacityFrom: 0.48,

              opacityTo: 0.08,
            },
          },
        }),
      },
    ];
  }

  /* ===================================================
     Bar Charts
  =================================================== */

  if (mode === "bar") {
    return [
      bars("Channel performance"),

      {
        ...bars("Pipeline by stage", {
          chart: {
            type: "bar",
            stacked: true,
          },

          plotOptions: {
            bar: {
              borderRadius: 5,
              horizontal: true,
            },
          },
        }),

        series: [
          {
            name: "Qualified",

            data: [42, 35, 28, 19],
          },
          {
            name: "In review",

            data: [25, 18, 16, 12],
          },
        ],

        options: option({
          chart: {
            type: "bar",
            stacked: true,
          },

          xaxis: {
            categories: ["Discovery", "Solution", "Proposal", "Negotiation"],
          },

          plotOptions: {
            bar: {
              horizontal: true,
              borderRadius: 5,
            },
          },
        }),
      },

      {
        ...bars("Quarterly target", {
          plotOptions: {
            bar: {
              horizontal: true,
              borderRadius: 6,
            },
          },
        }),

        series: [
          {
            name: "Attainment",

            data: [84, 72, 96, 61],
          },
        ],

        options: option({
          chart: {
            type: "bar",
          },

          xaxis: {
            categories: ["North", "South", "East", "West"],

            max: 100,
          },

          plotOptions: {
            bar: {
              horizontal: true,
              borderRadius: 6,
            },
          },
        }),
      },
    ];
  }

  /* ===================================================
     Pie & Donut Charts
  =================================================== */

  if (mode === "pie") {
    return [
      donut("Audience mix"),

      donut("Customer segment share", true),

      {
        ...donut("Plan adoption"),

        series: [52, 31, 17],

        options: option({
          chart: {
            type: "donut",
          },

          labels: ["Pro", "Growth", "Starter"],

          plotOptions: {
            pie: {
              donut: {
                size: "68%",

                labels: {
                  show: true,

                  total: {
                    show: true,
                    label: "Customers",

                    formatter: () => "8,249",
                  },
                },
              },
            },
          },
        }),
      },
    ];
  }

  /* ===================================================
     Radar Charts
  =================================================== */

  if (mode === "radar") {
    return [
      radar("Experience score"),

      {
        ...radar("Team capability"),

        series: [
          {
            name: "Product",

            data: [84, 72, 90, 68, 78],
          },
          {
            name: "Sales",

            data: [74, 86, 64, 82, 72],
          },
          {
            name: "Support",

            data: [78, 76, 75, 88, 84],
          },
        ],
      },

      {
        ...radar("Benchmark comparison"),

        series: [
          {
            name: "Workspace",

            data: [78, 83, 72, 88, 64],
          },
          {
            name: "Industry",

            data: [65, 68, 62, 70, 58],
          },
        ],
      },
    ];
  }

  /* ===================================================
     Radial Charts
  =================================================== */

  if (mode === "radial") {
    return [
      radial("Team goals"),

      radial("Operational health", [94, 82, 71]),

      {
        ...radial("Launch readiness", [88]),

        options: option({
          chart: {
            type: "radialBar",
          },

          labels: ["Ready"],

          plotOptions: {
            radialBar: {
              hollow: {
                size: "62%",
              },

              dataLabels: {
                name: {
                  fontSize: "14px",
                },

                value: {
                  fontSize: "30px",
                  fontWeight: 700,
                },
              },
            },
          },
        }),
      },
    ];
  }

  /* ===================================================
     Scatter / Bubble Charts
  =================================================== */

  if (mode === "scatter") {
    return [
      scatter("Satisfaction distribution"),

      scatter("Opportunity weighting", true),

      {
        ...scatter("Regional clusters"),

        series: [
          {
            name: "Americas",

            data: [
              [12, 27],
              [18, 36],
              [24, 30],
              [30, 48],
            ],
          },
          {
            name: "EMEA",

            data: [
              [22, 19],
              [27, 26],
              [34, 31],
              [41, 43],
            ],
          },
          {
            name: "APAC",

            data: [
              [30, 38],
              [35, 45],
              [42, 51],
              [48, 56],
            ],
          },
        ],
      },
    ];
  }

  /* ===================================================
     Mixed Charts
  =================================================== */

  if (mode === "mixed") {
    return [
      {
        ...bars("Orders and conversion"),

        series: [
          {
            name: "Orders",
            type: "column",

            data: [420, 510, 480, 640, 590, 720, 680, 810],
          },
          {
            name: "Conversion",
            type: "line",

            data: [3.4, 3.7, 3.5, 4.1, 3.8, 4.3, 4.0, 4.6],
          },
        ],

        options: option({
          chart: {
            type: "line",
          },

          xaxis: {
            categories: months,
          },

          stroke: {
            width: [0, 3],

            curve: "smooth",
          },

          yaxis: [
            {
              title: {
                text: "Orders",
              },
            },
            {
              opposite: true,

              title: {
                text: "Conversion %",
              },
            },
          ],
        }),
      },

      {
        ...area("Revenue and margin"),

        type: "line",

        series: [
          {
            name: "Revenue",
            type: "area",

            data: [52, 61, 58, 73, 69, 84, 80, 92],
          },
          {
            name: "Margin",
            type: "line",

            data: [31, 34, 32, 38, 36, 42, 41, 46],
          },
        ],

        options: option({
          chart: {
            type: "line",
          },

          xaxis: {
            categories: months,
          },

          stroke: {
            width: [0, 3],

            curve: "smooth",
          },

          fill: {
            type: ["gradient", "solid"],

            gradient: {
              opacityFrom: 0.38,

              opacityTo: 0.03,
            },
          },
        }),
      },

      {
        ...bars("Budget versus actual"),

        series: [
          {
            name: "Actual",
            type: "column",

            data: [44, 52, 48, 61, 57, 68, 64, 74],
          },
          {
            name: "Budget",
            type: "line",

            data: [46, 50, 52, 58, 60, 64, 68, 70],
          },
        ],
      },
    ];
  }

  /* ===================================================
     Heatmap Charts
  =================================================== */

  if (mode === "heatmap") {
    return [
      heat("Team engagement"),

      {
        ...heat("Support demand"),

        series: ["Chat", "Email", "Phone", "Social"].map((item, index) => ({
          name: item,

          data: week.map((day, dayIndex) => ({
            x: day,

            y: 8 + ((index * 18 + dayIndex * 11) % 84),
          })),
        })),
      },
    ];
  }

  /* ===================================================
     Treemap Charts
  =================================================== */

  if (mode === "treemap") {
    return [
      tree("Product portfolio"),

      {
        ...tree("Revenue by region"),

        series: [
          {
            data: [
              {
                x: "North America",
                y: 44,
              },
              {
                x: "Europe",
                y: 26,
              },
              {
                x: "Asia Pacific",
                y: 18,
              },
              {
                x: "Latin America",
                y: 8,
              },
              {
                x: "MEA",
                y: 4,
              },
            ],
          },
        ],
      },

      {
        ...tree("Marketing contribution"),

        series: [
          {
            data: [
              {
                x: "Organic",
                y: 38,
              },
              {
                x: "Paid",
                y: 27,
              },
              {
                x: "Lifecycle",
                y: 18,
              },
              {
                x: "Partners",
                y: 10,
              },
              {
                x: "Events",
                y: 7,
              },
            ],
          },
        ],
      },
    ];
  }

  /* ===================================================
     Sparkline Charts
  =================================================== */

  return [
    spark("Weekly signups", "area", [12, 16, 14, 21, 18, 25, 28, 31, 29, 36]),

    spark("Daily revenue", "line", [24, 31, 28, 39, 34, 46, 43, 51, 48, 58]),

    spark("Tickets closed", "bar", [18, 24, 20, 31, 28, 35, 33, 41, 37, 46]),

    spark("Retention trend", "area", [72, 73, 73, 75, 76, 77, 76, 78, 80, 81]),
  ];
}
