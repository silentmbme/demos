import { useMemo, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  CreditCard,
  Download,
  Gauge,
  Plus,
  Rocket,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { toast } from "sonner";

import { ApexChart } from "@/components/charts/ApexChart";

import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";

import { Badge, Card, Delta, PageHeader } from "./widgets";

import { Button } from "@/components/ui/button";

/* =====================================================
   Customer Accounts
===================================================== */

const accounts = [
  {
    name: "Northstar Labs",
    plan: "Enterprise",
    mrr: "$8,400",
    health: "Excellent",
    score: 94,
    owner: "JM",
  },
  {
    name: "Cedar & Co.",
    plan: "Growth",
    mrr: "$3,200",
    health: "Growing",
    score: 82,
    owner: "AK",
  },
  {
    name: "Atlas Studio",
    plan: "Business",
    mrr: "$2,880",
    health: "Watch",
    score: 61,
    owner: "RL",
  },
  {
    name: "Kinetic Systems",
    plan: "Enterprise",
    mrr: "$12,400",
    health: "Excellent",
    score: 96,
    owner: "SD",
  },
];

/* =====================================================
   Stat Component
===================================================== */

interface StatProps {
  label: string;
  value: string;
  delta: number;
  note: string;
  icon: typeof Activity;
  color: string;
}

function Stat({ label, value, delta, note, icon: Icon, color }: StatProps) {
  return (
    <div className="vexui-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12.5px] font-medium text-muted-foreground">{label}</p>

          <p className="mt-2 text-[28px] font-semibold leading-none tracking-tight">{value}</p>
        </div>

        <span className={`grid size-10 place-items-center rounded-xl ${color}`}>
          <Icon className="size-[19px]" />
        </span>
      </div>

      <div className="mt-4">
        <Delta value={delta} caption={note} />
      </div>
    </div>
  );
}

/* =====================================================
   SaaS Dashboard
===================================================== */

export function SaasDashboard() {
  const { base } = useChartTheme();

  const [period, setPeriod] = useState("This month");

  const [segment, setSegment] = useState("All customers");

  /* =====================================================
     Revenue Chart
  ===================================================== */

  const revenueOptions = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "line",
          toolbar: {
            show: false,
          },
        },

        colors: [token("--primary"), token("--chart-3")],

        stroke: {
          curve: "smooth",
          width: [0, 3],
        },

        plotOptions: {
          bar: {
            columnWidth: "48%",
            borderRadius: 6,
          },
        },

        fill: {
          type: ["solid", "gradient"],

          gradient: {
            opacityFrom: 0.32,
            opacityTo: 0.04,
          },
        },

        dataLabels: {
          enabled: false,
        },

        xaxis: {
          categories: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        },

        yaxis: {
          labels: {
            formatter: (value: number) => `$${value}K`,
          },
        },

        tooltip: {
          y: {
            formatter: (value: number) => `$${value.toFixed(1)}K`,
          },
        },

        grid: {
          borderColor: token("--border"),
          strokeDashArray: 4,
        },

        legend: {
          position: "top",
          horizontalAlign: "right",
          fontSize: "12px",
        },
      }),
    [base],
  );

  /* =====================================================
     Retention Cohort Heatmap
  ===================================================== */

  const cohortOptions = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "heatmap",
          toolbar: {
            show: false,
          },
        },

        dataLabels: {
          enabled: false,
        },

        colors: [token("--primary")],

        plotOptions: {
          heatmap: {
            shadeIntensity: 0.42,
            radius: 4,

            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 60,
                  color: token("--muted"),
                },
                {
                  from: 61,
                  to: 80,
                  color: token("--chart-2"),
                },
                {
                  from: 81,
                  to: 100,
                  color: token("--primary"),
                },
              ],
            },
          },
        },

        xaxis: {
          categories: ["Month 0", "M1", "M2", "M3", "M4", "M5"],
        },

        legend: {
          show: false,
        },
      }),
    [base],
  );

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="SaaS growth center"
        subtitle="Recurring revenue, customer health and product adoption in one operating view."
        breadcrumb={["Vexui", "Dashboards", "SaaS"]}
        actions={
          <>
            <select
              aria-label="Reporting period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>This month</option>

              <option>Last quarter</option>

              <option>Year to date</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Revenue report exported")}
            >
              <Download />
              Export
            </Button>

            <Button size="sm" onClick={() => toast.success("Customer invite ready")}>
              <Plus />
              Invite customer
            </Button>
          </>
        }
      />

      {/* =================================================
          KPI Cards
      ================================================= */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Monthly recurring revenue"
          value="$184.6K"
          delta={9.4}
          note="net growth this month"
          icon={CreditCard}
          color="bg-primary/12 text-primary"
        />

        <Stat
          label="Net revenue retention"
          value="116.8%"
          delta={4.2}
          note="above 110% target"
          icon={ArrowUpRight}
          color="bg-success/14 text-success"
        />

        <Stat
          label="Active subscriptions"
          value="8,462"
          delta={6.8}
          note="258 net new accounts"
          icon={UsersRound}
          color="bg-info/14 text-info"
        />

        <Stat
          label="Account health score"
          value="88.4"
          delta={2.1}
          note="portfolio average"
          icon={Gauge}
          color="bg-warning/16 text-warning"
        />
      </div>

      {/* =================================================
          MRR Movement + Forecast
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        {/* MRR Movement */}

        <Card
          className="xl:col-span-8"
          title="MRR movement"
          description={`${period}  expansion is offsetting churn`}
          action={
            <Badge variant="dot" tone="success">
              Forecast on track
            </Badge>
          }
        >
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["Starting MRR", "$161.3K", "neutral"],
              ["New business", "+$18.4K", "success"],
              ["Expansion", "+$12.9K", "success"],
              ["Churn & contraction", "-$8.0K", "danger"],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-xl border bg-background/60 p-3">
                <p className="text-[11px] text-muted-foreground">{label}</p>

                <p
                  className={`mt-1 text-lg font-semibold ${
                    tone === "success"
                      ? "text-success"
                      : tone === "danger"
                        ? "text-destructive"
                        : ""
                  }`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <ApexChart
              type="line"
              height={290}
              options={revenueOptions}
              series={[
                {
                  name: "MRR",
                  type: "column",
                  data: [131, 141, 148, 158, 169, 184.6],
                },
                {
                  name: "MRR target",
                  type: "area",
                  data: [132, 140, 149, 160, 171, 184],
                },
              ]}
            />
          </div>
        </Card>

        {/* Growth Forecast */}

        <Card
          className="xl:col-span-4"
          title="Growth forecast"
          description="Expected month-end outcome"
        >
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <p className="text-xs font-medium text-primary-foreground/70">Projected MRR</p>

            <p className="mt-2 text-3xl font-semibold">$197.2K</p>

            <p className="mt-2 text-sm text-primary-foreground/80">106.8% of August target</p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-[86%] rounded-full bg-white" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border p-3">
              <p className="text-xs text-muted-foreground">Expansion pipeline</p>

              <b className="mt-1 block text-lg">$28.4K</b>
            </div>

            <div className="rounded-xl border p-3">
              <p className="text-xs text-muted-foreground">At-risk MRR</p>

              <b className="mt-1 block text-lg text-warning">$7.9K</b>
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full"
            size="sm"
            onClick={() => toast.info("Forecast assumptions opened")}
          >
            <Rocket />
            Review forecast
          </Button>
        </Card>
      </div>

      {/* =================================================
          Customer Portfolio + Activation
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        {/* Customer Portfolio */}

        <Card
          className="xl:col-span-7"
          title="Customer portfolio"
          description="Accounts that need attention and accounts ready to grow"
          bodyClassName="p-0"
          action={
            <select
              aria-label="Customer segment"
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
              className="h-8 rounded-md border bg-background px-2 text-xs"
            >
              <option>All customers</option>

              <option>Enterprise</option>

              <option>Growth</option>

              <option>At risk</option>
            </select>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[610px] text-start text-sm">
              <thead className="border-b bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Account</th>

                  <th className="px-3 py-3">Plan</th>

                  <th className="px-3 py-3">MRR</th>

                  <th className="px-3 py-3">Health</th>

                  <th className="px-5 py-3 text-end">Owner</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {accounts.map((account) => (
                  <tr key={account.name} className="hover:bg-muted/35">
                    <td className="px-5 py-3.5">
                      <b>{account.name}</b>

                      <small className="mt-0.5 block text-xs text-muted-foreground">
                        Last active today
                      </small>
                    </td>

                    <td className="px-3 py-3.5">
                      <Badge tone={account.plan === "Enterprise" ? "primary" : "info"}>
                        {account.plan}
                      </Badge>
                    </td>

                    <td className="px-3 py-3.5 font-semibold">{account.mrr}</td>

                    <td className="px-3 py-3.5">
                      <Badge
                        variant="dot"
                        tone={account.health === "Watch" ? "warning" : "success"}
                      >
                        {account.health}
                        {"  "}
                        {account.score}
                      </Badge>
                    </td>

                    <td className="px-5 py-3.5 text-end">
                      <span className="inline-grid size-8 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {account.owner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activation Journey */}

        <Card
          className="xl:col-span-5"
          title="Activation journey"
          description="New workspace progress over the last 30 days"
        >
          <div className="space-y-4">
            {[
              ["Trial created", "1,284", "100%", "bg-primary"],
              ["Team invited", "1,068", "83%", "bg-info"],
              ["First workflow", "864", "67%", "bg-success"],
              ["Core feature adopted", "618", "48%", "bg-warning"],
              ["Converted to paid", "509", "40%", "bg-violet-500"],
            ].map(([label, count, width, color]) => (
              <div key={label} className="flex items-center gap-3">
                <span className={`size-2.5 rounded-full ${color}`} />

                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <b>{label}</b>

                    <span className="text-muted-foreground">{width}</span>
                  </div>

                  <div className="mt-2 h-1.5 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{
                        width,
                      }}
                    />
                  </div>
                </div>

                <b className="w-10 text-end text-sm">{count}</b>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-success/25 bg-success/8 p-3 text-sm">
            <b className="text-success">Activation insight</b>

            <p className="mt-1 text-muted-foreground">
              Teams that invite 3+ members in week one convert 2.4 more often.
            </p>
          </div>
        </Card>
      </div>

      {/* =================================================
          Retention + Product Health
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        {/* Retention Cohorts */}

        <Card
          className="xl:col-span-7"
          title="Retention cohorts"
          description="Percentage of customers active after joining"
        >
          <ApexChart
            type="heatmap"
            height={265}
            options={cohortOptions}
            series={[
              {
                name: "Mar cohort",
                data: [100, 94, 90, 88, 87, 86],
              },
              {
                name: "Apr cohort",
                data: [100, 93, 89, 87, 85, 0],
              },
              {
                name: "May cohort",
                data: [100, 95, 91, 89, 0, 0],
              },
              {
                name: "Jun cohort",
                data: [100, 94, 92, 0, 0, 0],
              },
              {
                name: "Jul cohort",
                data: [100, 96, 0, 0, 0, 0],
              },
            ]}
          />
        </Card>

        {/* Product Health */}

        <Card
          className="xl:col-span-5"
          title="Product health"
          description="Signals from the active customer base"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Weekly active teams", "4,982", "+11.2%", "success"],
              ["Feature adoption", "72.4%", "+5.1 pts", "success"],
              ["Support response", "8 min", "within SLA", "info"],
              ["Open incidents", "2", "being resolved", "warning"],
            ].map(([label, value, detail, tone]) => (
              <div key={label} className="rounded-xl border p-4">
                <p className="text-xs text-muted-foreground">{label}</p>

                <b className="mt-2 block text-xl">{value}</b>

                <small
                  className={
                    tone === "success"
                      ? "text-success"
                      : tone === "warning"
                        ? "text-warning"
                        : "text-info"
                  }
                >
                  {detail}
                </small>
              </div>
            ))}
          </div>

          {/* Platform Status */}

          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/55 p-4">
            <span className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-success/14 text-success">
                <ShieldCheck className="size-5" />
              </span>

              <span>
                <b className="block text-sm">Platform status</b>

                <small className="text-xs text-muted-foreground">
                  All core systems operational
                </small>
              </span>
            </span>

            <Badge tone="success" variant="dot">
              99.99%
            </Badge>
          </div>
        </Card>
      </div>
    </>
  );
}
