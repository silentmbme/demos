import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Copy,
  Download,
  Megaphone,
  MousePointer2,
  Plus,
  Send,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { Badge, Card, PageHeader } from "./widgets";
import { Button } from "@/components/ui/button";

const campaigns = [
  ["Autumn product launch", "Paid social  Email", "$18,420", "4.8x", "Live", "success"],
  ["Workflow playbook", "Content  Organic", "$7,860", "3.2x", "Live", "success"],
  ["Partner co-marketing", "Events  Partner", "$5,400", "2.1x", "Review", "warning"],
  ["Enterprise retargeting", "Paid search", "$12,770", "3.9x", "Optimizing", "info"],
] as const;

export function MarketingDashboard() {
  const { base } = useChartTheme();
  const [period, setPeriod] = useState("This month");
  const [campaignLive, setCampaignLive] = useState(true);

  const demandChart = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "area",
          toolbar: { show: false },
        },
        colors: [token("--primary"), token("--chart-2")],
        stroke: {
          curve: "smooth",
          width: [3, 2],
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.38,
            opacityTo: 0.03,
          },
        },
        xaxis: {
          categories: ["Aug 1", "Aug 5", "Aug 9", "Aug 13", "Aug 17", "Aug 21", "Aug 25", "Aug 29"],
        },
        yaxis: {
          labels: {
            formatter: (value: number) => `${Math.round(value / 1000)}k`,
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          borderColor: token("--border"),
          strokeDashArray: 4,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
        },
      }),
    [base],
  );

  const channelChart = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "donut",
        },
        labels: ["Paid social", "Organic", "Email", "Partners", "Direct"],
        colors: [
          token("--primary"),
          token("--chart-2"),
          token("--chart-3"),
          token("--warning"),
          token("--muted-foreground"),
        ],
        stroke: {
          colors: [token("--card")],
          width: 4,
        },
        legend: {
          position: "bottom",
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "68%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Qualified leads",
                  formatter: () => "2,846",
                },
              },
            },
          },
        },
      }),
    [base],
  );

  const conversionChart = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "bar",
          toolbar: { show: false },
        },
        colors: [token("--chart-2")],
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 6,
            barHeight: "54%",
          },
        },
        xaxis: {
          categories: ["Visits", "Engaged", "Leads", "Meetings", "Won"],
          max: 100,
          labels: {
            formatter: (value: string) => `${value}%`,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (value: number) => `${value}%`,
        },
        grid: {
          borderColor: token("--border"),
          strokeDashArray: 4,
        },
      }),
    [base],
  );

  return (
    <>
      <PageHeader
        title="Marketing command center"
        subtitle="Plan campaigns, measure demand, and turn attention into qualified pipeline."
        breadcrumb={["Vexui", "Dashboards", "Marketing"]}
        actions={
          <>
            <select
              aria-label="Reporting period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>This month</option>
              <option>Last month</option>
              <option>Quarter to date</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Marketing report exported")}
            >
              <Download />
              Export
            </Button>

            <Button size="sm" onClick={() => toast.success("Campaign draft created")}>
              <Plus />
              Create campaign
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-12">
        <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-card xl:col-span-7 sm:p-8">
          <div className="absolute -end-20 -top-20 size-72 rounded-full border-[28px] border-white/10" />
          <div className="absolute bottom-[-110px] end-28 size-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Sparkles className="size-3.5" />
                Campaign focus
              </span>

              <h2 className="mt-5 max-w-xl text-3xl text-white font-semibold tracking-tight">
                The autumn launch is building momentum.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-white/80">
                Audience engagement is 18% above plan. Move the best-performing social segment into
                the retargeting workflow today.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => setCampaignLive((value) => !value)}
              >
                <Megaphone />
                {campaignLive ? "Campaign live" : "Resume campaign"}
              </Button>

              <button
                type="button"
                onClick={() => toast.info("Campaign brief copied")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white"
              >
                <Copy className="size-4" />
                Copy brief
              </button>
            </div>
          </div>
        </section>

        <Card className="xl:col-span-5" title="Growth scoreboard" description={period}>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Pipeline influenced", "$426K", "+14.8%", "text-success"],
              ["Qualified leads", "2,846", "+9.2%", "text-success"],
              ["Cost per lead", "$34.20", "6.1%", "text-success"],
              ["Campaign ROI", "3.8x", "+0.4x", "text-primary"],
            ].map(([label, value, delta, color]) => (
              <div key={label} className="rounded-xl border bg-muted/20 p-4">
                <p className="text-xs text-muted-foreground">{label}</p>

                <p className="mt-2 text-2xl font-semibold">{value}</p>

                <p className={`mt-1 text-xs font-semibold ${color}`}>{delta} vs previous period</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-8"
          title="Demand momentum"
          description="Qualified demand generated across acquisition and nurture programs"
        >
          <ApexChart
            type="area"
            height={300}
            options={demandChart}
            series={[
              {
                name: "Pipeline influenced",
                data: [26, 32, 29, 43, 47, 52, 61, 68],
              },
              {
                name: "Media spend",
                data: [18, 20, 24, 26, 31, 34, 38, 42],
              },
            ]}
          />
        </Card>

        <Card
          className="xl:col-span-4"
          title="Channel quality"
          description="Where qualified demand begins"
        >
          <ApexChart
            type="donut"
            height={288}
            options={channelChart}
            series={[34, 27, 18, 12, 9]}
          />
        </Card>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-7"
          title="Campaign portfolio"
          description="Revenue contribution and next optimization action"
        >
          <div className="divide-y rounded-xl border">
            {campaigns.map(([name, channel, revenue, roi, status, tone]) => (
              <div key={name} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Target className="size-4" />
                </span>

                <span className="min-w-40 flex-1">
                  <b className="block text-sm">{name}</b>
                  <small className="text-xs text-muted-foreground">{channel}</small>
                </span>

                <span className="text-sm">
                  <small className="block text-xs text-muted-foreground">Pipeline</small>
                  <b>{revenue}</b>
                </span>

                <span className="text-sm">
                  <small className="block text-xs text-muted-foreground">ROI</small>
                  <b>{roi}</b>
                </span>

                <Badge tone={tone}>{status}</Badge>

                <button
                  type="button"
                  onClick={() => toast.info(`${name} opened`)}
                  className="text-xs font-semibold text-primary"
                >
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="xl:col-span-5"
          title="Conversion ladder"
          description="The journey from attention to revenue"
        >
          <ApexChart
            type="bar"
            height={255}
            options={conversionChart}
            series={[
              {
                name: "Conversion",
                data: [100, 62, 27, 11, 4],
              },
            ]}
          />
        </Card>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-4"
          title="Audience signals"
          description="Segments worth activating now"
        >
          <div className="space-y-3">
            {[
              ["Operations leaders", "418 engaged accounts", "High intent", "success", UsersRound],
              ["Scaling SaaS teams", "296 product-page returns", "Rising", "info", MousePointer2],
              ["Agency partners", "18 co-sell opportunities", "Review", "warning", Send],
            ].map(([name, note, status, tone, Icon]) => (
              <button
                type="button"
                key={name as string}
                onClick={() => toast.info(`${name} audience opened`)}
                className="flex w-full items-center gap-3 rounded-xl border p-3 text-start transition hover:border-primary/30"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-primary">
                  <Icon className="size-4" />
                </span>

                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{name}</b>
                  <small className="block truncate text-xs text-muted-foreground">{note}</small>
                </span>

                <Badge tone={tone as "success" | "info" | "warning"}>{status}</Badge>
              </button>
            ))}
          </div>
        </Card>

        <Card
          className="xl:col-span-4"
          title="Content pulse"
          description="Assets moving prospects forward"
        >
          <div className="space-y-4">
            {[
              ["2026 workflow benchmark", "1,284 views", 82],
              ["Campaign planning template", "764 downloads", 67],
              ["Operations maturity webinar", "413 registrations", 54],
            ].map(([title, reach, score]) => (
              <div key={title as string}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-medium">{title}</span>
                  <b>{score}%</b>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">{reach}</p>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="xl:col-span-4"
          title="Next marketing moments"
          description="Important campaign checkpoints"
        >
          <ol className="space-y-4 border-s ps-4">
            {[
              ["Today", "Social creative approval", "Autumn product launch"],
              ["Sep 05", "Partner briefing", "Co-marketing campaign"],
              ["Sep 09", "Nurture sequence review", "Workflow playbook"],
              ["Sep 12", "Attribution readout", "Growth team"],
            ].map(([date, event, detail]) => (
              <li key={event} className="relative">
                <span className="absolute -start-[21px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-card" />

                <small className="text-xs font-semibold text-primary">{date}</small>

                <b className="mt-1 block text-sm">{event}</b>

                <small className="text-xs text-muted-foreground">{detail}</small>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
