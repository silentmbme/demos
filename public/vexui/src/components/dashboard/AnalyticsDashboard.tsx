import { useState } from "react";

import {
  CalendarDays,
  ChevronDown,
  Download,
  Globe2,
  MonitorSmartphone,
  MousePointerClick,
  Plus,
  UsersRound,
} from "lucide-react";

import { ApexChart } from "@/components/charts/ApexChart";

import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";

import { Badge, Card, PageHeader } from "./widgets";

import { Button } from "@/components/ui/button";

/* =====================================================
   Chart Days
===================================================== */

const days = ["Aug 1", "Aug 5", "Aug 9", "Aug 13", "Aug 17", "Aug 21", "Aug 25", "Aug 31"];

/* =====================================================
   Metric Component
===================================================== */

interface MetricProps {
  icon: typeof UsersRound;
  label: string;
  value: string;
  trend: string;
}

function Metric({ icon: Icon, label, value, trend }: MetricProps) {
  return (
    <div className="flex items-center gap-3 border-e border-border px-1 last:border-0 sm:px-4">
      {/* Icon */}
      <span className="icon-tile size-10">
        <Icon className="size-[18px]" />
      </span>

      {/* Content */}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-0.5 text-xl font-semibold">{value}</p>

        <p className="text-[11px] text-success">{trend}</p>
      </div>
    </div>
  );
}

/* =====================================================
   Analytics Dashboard
===================================================== */

export function AnalyticsDashboard() {
  /* ---------------------------------------------------
     States
  --------------------------------------------------- */

  const [activeTab, setActiveTab] = useState("Overview");

  const [traffic, setTraffic] = useState("All traffic");

  /* ---------------------------------------------------
     Chart Theme
  --------------------------------------------------- */

  const { base } = useChartTheme();

  /* =====================================================
     Visitors Chart Options
  ===================================================== */

  const visitors = mergeOptions(base, {
    chart: {
      type: "bar",
      height: 350,
    },

    colors: [token("--primary"), token("--chart-2")],

    xaxis: {
      categories: days,
    },

    yaxis: {
      labels: {
        formatter: (value: number) => `${Math.round(value)}k`,
      },
    },

    stroke: {
      curve: "smooth",
      width: [0, 3],
    },

    plotOptions: {
      bar: {
        columnWidth: "48%",
        borderRadius: 5,
      },
    },

    markers: {
      size: [0, 4],

      hover: {
        size: 6,
      },
    },

    grid: {
      padding: {
        left: 6,
        right: 12,
      },
    },
  });

  /* =====================================================
     Device Chart Options
  ===================================================== */

  const device = mergeOptions(base, {
    chart: {
      type: "radar",
    },

    colors: [token("--primary"), token("--chart-2")],

    xaxis: {
      categories: ["Engagement", "Pages / visit", "Conversion", "Speed", "Retention"],
    },

    yaxis: {
      show: false,
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

    legend: {
      position: "bottom",
    },
  });

  /* =====================================================
     Conversion Chart Options
  ===================================================== */

  const conversion = mergeOptions(base, {
    chart: {
      type: "bar",
    },

    colors: [token("--primary")],

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        barHeight: "54%",
      },
    },

    xaxis: {
      categories: ["Product page", "Pricing", "Start trial", "Activation"],
    },

    dataLabels: {
      enabled: true,

      formatter: (value: number) => `${value}%`,

      style: {
        fontSize: "11px",
      },
    },

    legend: {
      show: false,
    },

    grid: {
      padding: {
        right: 24,
      },
    },
  });

  /* =====================================================
     Render
  ===================================================== */

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Analytics"
        subtitle="See how visitors discover, explore and convert across your product."
        breadcrumb={["Vexui", "Dashboards", "Analytics"]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download />
              Export
            </Button>

            <Button size="sm">
              <Plus />
              Create report
            </Button>
          </>
        }
      />

      {/* =================================================
          Filters
      ================================================= */}

      <Card bodyClassName="p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Tabs */}

          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-muted p-1">
            <Button
              size="sm"
              variant={activeTab === "Overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("Overview")}
            >
              Overview
            </Button>

            <Button
              size="sm"
              variant={activeTab === "Acquisition" ? "default" : "ghost"}
              onClick={() => setActiveTab("Acquisition")}
            >
              Acquisition
            </Button>

            <Button
              size="sm"
              variant={activeTab === "Behavior" ? "default" : "ghost"}
              onClick={() => setActiveTab("Behavior")}
            >
              Behavior
            </Button>

            <Button
              size="sm"
              variant={activeTab === "Conversion" ? "default" : "ghost"}
              onClick={() => setActiveTab("Conversion")}
            >
              Conversion
            </Button>
          </div>

          {/* Filters */}

          <div className="flex flex-wrap items-center gap-2 lg:ms-auto">
            {/* Traffic Filter */}

            <label className="relative">
              <Globe2
                className="
                  pointer-events-none
                  absolute
                  start-3
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <select
                value={traffic}
                onChange={(event) => setTraffic(event.target.value)}
                className="
                  h-8
                  appearance-none
                  rounded-md
                  border
                  bg-background
                  py-0
                  ps-9
                  pe-8
                  text-xs
                "
              >
                <option>All traffic</option>

                <option>Organic traffic</option>

                <option>Paid traffic</option>

                <option>Referral traffic</option>
              </select>

              <ChevronDown
                className="
                  pointer-events-none
                  absolute
                  end-2
                  top-1/2
                  size-3.5
                  -translate-y-1/2
                  text-muted-foreground
                "
              />
            </label>

            {/* Date */}

            <Button size="sm" variant="outline">
              <CalendarDays />
              Aug 131, 2026
            </Button>
          </div>
        </div>
      </Card>

      {/* =================================================
          Audience Metrics
      ================================================= */}

      <Card
        className="mt-4"
        title="Audience pulse"
        description="A quick read on this periods web performance"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={UsersRound} label="Visitors" value="84,268" trend="+14.2% vs Jul" />

          <Metric
            icon={MousePointerClick}
            label="Engaged sessions"
            value="52,614"
            trend="+8.4% vs Jul"
          />

          <Metric
            icon={MonitorSmartphone}
            label="Avg. session"
            value="4m 18s"
            trend="+9.1% vs Jul"
          />

          <Metric icon={Globe2} label="Conversion rate" value="4.56%" trend="+0.62 pts vs Jul" />
        </div>
      </Card>

      {/* =================================================
          Main Charts
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        {/* Visitors & Sessions */}

        <Card
          className="xl:col-span-3"
          title="Visitors & sessions"
          description="Daily volume across the selected period"
        >
          <ApexChart
            type="bar"
            height={350}
            options={visitors}
            series={[
              {
                name: "Visitors",
                type: "column",
                data: [8.4, 10.8, 9.6, 13.2, 12.1, 15.8, 14.3, 17.6],
              },
              {
                name: "Sessions",
                type: "line",
                data: [6.8, 8.1, 7.7, 10.4, 9.2, 12.5, 11.8, 13.9],
              },
            ]}
          />
        </Card>

        {/* Device Engagement */}

        <Card
          className="xl:col-span-2"
          title="Device engagement profile"
          description="How desktop and mobile audiences behave"
        >
          <ApexChart
            type="radar"
            height={292}
            options={device}
            series={[
              {
                name: "Desktop",
                data: [78, 72, 64, 82, 68],
              },
              {
                name: "Mobile",
                data: [62, 54, 48, 58, 52],
              },
            ]}
          />

          <div className="mt-1 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="font-semibold">78</p>

              <p className="text-muted-foreground">Desktop score</p>
            </div>

            <div>
              <p className="font-semibold">62</p>

              <p className="text-muted-foreground">Mobile score</p>
            </div>

            <div>
              <p className="font-semibold">64</p>

              <p className="text-muted-foreground">Average score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* =================================================
          Acquisition / Conversion / Browser
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-6">
        {/* Acquisition */}

        <Card className="xl:col-span-2" title="Acquisition mix" description="Sessions by source">
          <div className="space-y-4">
            {[
              ["Organic search", "32,840", 68, "bg-primary"],
              ["Direct", "18,920", 52, "bg-chart-2"],
              ["Paid social", "14,482", 36, "bg-chart-3"],
              ["Partner referrals", "8,604", 22, "bg-chart-4"],
            ].map(([name, count, width, color]) => (
              <div key={name as string}>
                <div className="flex justify-between text-sm">
                  <span>{name}</span>

                  <span className="font-semibold">{count}</span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{
                      width: `${width}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversion Funnel */}

        <Card
          className="xl:col-span-2"
          title="Conversion funnel"
          description="Visitors advancing through the product journey"
        >
          <ApexChart
            type="bar"
            height={260}
            options={conversion}
            series={[
              {
                name: "Conversion",
                data: [100, 64, 31, 18],
              },
            ]}
          />
        </Card>

        {/* Browser Distribution */}

        <Card
          className="xl:col-span-2"
          title="Browser distribution"
          description="Browser share and experience quality"
        >
          <div className="space-y-3">
            {[
              ["Chrome", "62%", "Excellent"],
              ["Safari", "19%", "Excellent"],
              ["Edge", "11%", "Good"],
              ["Firefox", "5%", "Good"],
            ].map(([browser, share, status]) => (
              <div
                key={browser}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{browser}</p>

                  <p className="text-xs text-muted-foreground">{share} of traffic</p>
                </div>

                <Badge tone={status === "Excellent" ? "success" : "info"}>{status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* =================================================
          Top Pages / Locations
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        {/* Top Pages */}

        <Card
          className="xl:col-span-3"
          title="Top pages"
          description="Content attracting the most qualified audience"
          bodyClassName="p-0"
        >
          <div className="overflow-x-auto">
            <table className="vexui-table min-w-[620px]">
              <thead>
                <tr>
                  <th>Page</th>

                  <th>Views</th>

                  <th>Engagement</th>

                  <th>Conversions</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["/workspace/overview", "18,482", "68.4%", "842"],
                  ["/solutions/teams", "12,946", "54.1%", "486"],
                  ["/pricing", "8,254", "42.8%", "392"],
                  ["/resources/report", "6,812", "61.2%", "184"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td
                        key={cell}
                        className={index === 0 ? "font-medium" : "text-muted-foreground"}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Locations */}

        <Card
          className="xl:col-span-2"
          title="Top locations"
          description="Visitor volume by market"
        >
          <div className="space-y-4">
            {[
              ["United States", "24,680", "29%"],
              ["United Kingdom", "11,240", "13%"],
              ["Germany", "8,920", "11%"],
              ["Singapore", "6,482", "8%"],
            ].map(([country, visitors, share], index) => (
              <div key={country} className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{country}</p>

                  <p className="text-xs text-muted-foreground">{share} of total visitors</p>
                </div>

                <span className="text-sm font-semibold">{visitors}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
