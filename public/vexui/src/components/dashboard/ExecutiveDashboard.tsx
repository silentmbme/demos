import { Download, MoreHorizontal, Plus } from "lucide-react";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import {
  activityFeed,
  executiveKpis,
  months,
  profitSeries,
  recentTransactions,
  revenueSeries,
  salesByRegion,
  teamPerformance,
  topProducts,
} from "@/data/mock-data";
import { Avatar, Badge, Card, Delta, KpiCard, PageHeader, TargetCard } from "./widgets";
import { Button } from "@/components/ui/button";

const statusTone = {
  Paid: "success",
  Pending: "warning",
  Failed: "danger",
} as const;

const feedTone = {
  success: "bg-success",
  primary: "bg-primary",
  warning: "bg-warning",
  info: "bg-info",
} as const;

export function ExecutiveDashboard() {
  const { base } = useChartTheme();

  const revenueOptions = mergeOptions(base, {
    chart: { type: "area", stacked: false },
    colors: [token("--primary"), token("--chart-2"), token("--chart-3")],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 0.4, opacityFrom: 0.28, opacityTo: 0.02, stops: [0, 95] },
    },
    xaxis: { categories: months },
    yaxis: { labels: { formatter: (v: number) => `$${Math.round(v)}k` } },
  });

  const profitOptions = mergeOptions(base, {
    chart: { type: "bar" },
    colors: [token("--chart-3")],
    plotOptions: { bar: { columnWidth: "45%", borderRadius: 5, borderRadiusApplication: "end" } },
    xaxis: { categories: months },
    yaxis: { labels: { formatter: (v: number) => `${Math.round(v)}%` } },
    legend: { show: false },
  });

  const regionOptions = mergeOptions(base, {
    chart: { type: "donut" },
    labels: salesByRegion.labels,
    stroke: { width: 0 },
    legend: { position: "bottom", horizontalAlign: "center" },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            value: {
              fontSize: "20px",
              fontWeight: 600,
              formatter: (v: string) => `$${(Number(v) / 1000).toFixed(1)}k`,
            },
            total: {
              show: true,
              label: "Total sales",
              fontSize: "12px",
              formatter: () =>
                `$${(salesByRegion.data.reduce((a, b) => a + b, 0) / 1000).toFixed(1)}k`,
            },
          },
        },
      },
    },
  });

  return (
    <>
      <PageHeader
        title="Executive overview"
        subtitle="Company-wide performance for August 2026"
        breadcrumb={["Vexui", "Dashboards", "Executive"]}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" className="h-9 gap-2">
              <Plus className="size-4" /> New report
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {executiveKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          title="Revenue overview"
          description="Revenue vs operating expenses, in thousands"
          className="xl:col-span-2"
          action={<Badge tone="primary">FY 2026</Badge>}
        >
          <ApexChart type="area" height={310} options={revenueOptions} series={revenueSeries} />
        </Card>

        <Card
          title="Sales by region"
          description="Closed-won revenue by territory"
          className="border-info/25"
        >
          <ApexChart
            type="donut"
            height={330}
            options={regionOptions}
            series={salesByRegion.data}
          />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card title="Profit overview" description="Gross margin by month" className="xl:col-span-2">
          <ApexChart type="bar" height={280} options={profitOptions} series={profitSeries} />
        </Card>

        <div className="grid gap-4">
          <TargetCard label="Q3 revenue" value="$1.86M" target="$2.40M" progress={78} />
          <TargetCard label="Net retention" value="112%" target="120%" progress={64} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          title="Top products"
          description="Ranked by revenue this month"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <button
              className="text-muted-foreground hover:text-foreground"
              aria-label="Product options"
            >
              <MoreHorizontal className="size-[18px]" />
            </button>
          }
        >
          <div className="table-scroll">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-start text-[12px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Units</th>
                  <th className="px-5 py-3 font-semibold">Revenue</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr
                    key={p.sku}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-[12px] text-muted-foreground">{p.sku}</p>
                    </td>
                    <td className="hidden px-5 py-3.5 text-muted-foreground sm:table-cell">
                      {p.units.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 font-medium">{p.revenue}</td>
                    <td className="hidden px-5 py-3.5 sm:table-cell">
                      <Delta value={p.growth} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Team performance" description="Quota attainment this quarter">
          <ul className="space-y-4">
            {teamPerformance.map((m) => (
              <li key={m.name} className="flex items-center gap-3">
                <Avatar initials={m.initials} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-[13.5px] font-medium">{m.name}</p>
                    <span className="text-[12.5px] font-semibold">{m.quota}%</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground">
                    {m.role} {m.deals} deals
                  </p>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${["bg-primary", "bg-info", "bg-success", "bg-warning"][teamPerformance.indexOf(m) % 4]}`}
                      style={{ width: `${m.quota}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card
          title="Recent transactions"
          description="Latest payment activity across accounts"
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          <div className="table-scroll">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-border text-start text-[12px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Transaction</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{t.customer}</p>
                      <p className="text-[12px] text-muted-foreground">{t.id}</p>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.method}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.date}</td>
                    <td className="px-5 py-3.5 font-medium">{t.amount}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone={statusTone[t.status as keyof typeof statusTone]}>
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Activity feed" description="Company updates from the last 24 hours">
          <ol className="relative space-y-5 border-s border-border ps-5">
            {activityFeed.map((a) => (
              <li key={a.title} className="relative">
                <span
                  className={`absolute -start-[26px] top-1.5 size-2.5 rounded-full ring-4 ring-card ${feedTone[a.tone]}`}
                />
                <p className="text-[13.5px] font-medium">{a.title}</p>
                <p className="text-[12.5px] text-muted-foreground">{a.detail}</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">{a.time}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
