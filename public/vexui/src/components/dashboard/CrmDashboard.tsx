import { useMemo, useState } from "react";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Sparkles,
  UserRoundCheck,
  Video,
} from "lucide-react";

import { toast } from "sonner";

import { ApexChart } from "@/components/charts/ApexChart";

import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";

import { Badge, Card, PageHeader } from "./widgets";

import { Button } from "@/components/ui/button";

/* =====================================================
   Priority Deals
===================================================== */

const priorityDeals = [
  {
    name: "Northstar expansion",
    company: "Northstar Labs",
    value: "$84K",
    likelihood: "High confidence",
    due: "Close Sep 12",
    next: "Send executive recap",
    color: "bg-primary",
  },
  {
    name: "Automation rollout",
    company: "Vertex Labs",
    value: "$42K",
    likelihood: "Needs attention",
    due: "Close Sep 18",
    next: "Complete security review",
    color: "bg-warning",
  },
  {
    name: "Platform upgrade",
    company: "Vexui Systems",
    value: "$128K",
    likelihood: "Decision pending",
    due: "Close Sep 05",
    next: "Confirm legal approver",
    color: "bg-info",
  },
];

/* =====================================================
   Meetings
===================================================== */

const meetings = [
  ["09:30", "Discovery call", "Kinetic Systems", "Phone"],
  ["11:00", "Proposal review", "Northstar Labs", "Video"],
  ["14:30", "Security follow-up", "Vertex Labs", "Video"],
  ["16:00", "Renewal check-in", "Harbor Health", "Email"],
];

/* =====================================================
   CRM Dashboard
===================================================== */

export function CrmDashboard() {
  const { base } = useChartTheme();

  const [done, setDone] = useState<string[]>([]);

  const [focus, setFocus] = useState("Pipeline");

  /* =====================================================
     Opportunity Map Chart
  ===================================================== */

  const mapOptions = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "bubble",
          toolbar: {
            show: false,
          },
        },

        colors: [token("--primary"), token("--chart-2"), token("--chart-3")],

        xaxis: {
          min: 0,
          max: 100,
          tickAmount: 5,

          title: {
            text: "Close confidence",
          },

          labels: {
            formatter: (value: string) => `${value}%`,
          },
        },

        yaxis: {
          min: 0,
          max: 150,
          tickAmount: 3,

          title: {
            text: "Deal value ($K)",
          },

          labels: {
            formatter: (value: number) => `$${value}K`,
          },
        },

        grid: {
          borderColor: token("--border"),
          strokeDashArray: 4,
        },

        dataLabels: {
          enabled: false,
        },

        legend: {
          position: "top",
          horizontalAlign: "right",
          fontSize: "12px",
        },

        tooltip: {
          x: {
            formatter: (value: number) => `${value}% confidence`,
          },

          y: {
            formatter: (value: number) => `$${value}K value`,
          },
        },
      }),

    [base],
  );

  /* =====================================================
     Complete Deal Action
  ===================================================== */

  const markDone = (label: string) => {
    setDone((items) => [...items, label]);

    toast.success("Next step completed");
  };

  return (
    <>
      {/* =================================================
          Page Header
      ================================================= */}

      <PageHeader
        title="Crm"
        subtitle="A focused sales workspace for the conversations and decisions that move revenue today."
        breadcrumb={["Vexui", "Dashboards", "CRM"]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Daily brief shared")}>
              <Mail />
              Share brief
            </Button>

            <Button size="sm" onClick={() => toast.success("Deal created")}>
              <Plus />
              New deal
            </Button>
          </>
        }
      />

      {/* =================================================
          Revenue Brief
      ================================================= */}

      <section className="overflow-hidden">
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr] 2xl:grid-cols-[1.2fr_.8fr]">
          {/* Revenue Highlight */}

          <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-7 text-primary-foreground sm:px-8">
            <span className="absolute -end-10 -top-16 size-56 rounded-full border-[26px] border-white/10" />

            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1 text-xs font-semibold">
                <Sparkles className="size-3.5" />
                Todays revenue brief
              </span>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">
                $254K can move forward this week.
              </h2>

              <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                Three high-value opportunities are waiting on a clear next action. Start with the
                executive recap for Northstar.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="
                    border-white/25
                    bg-white
                    text-primary
                    hover:bg-white/90
                    hover:text-primary
                  "
                  onClick={() => toast.info("Northstar deal opened")}
                >
                  Open priority deal
                  <ArrowRight />
                </Button>

                <button
                  type="button"
                  onClick={() => setFocus("At risk")}
                  className="
                    rounded-md
                    bg-white/10
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-primary-foreground/85
                  "
                >
                  View risks
                </button>
              </div>
            </div>
          </div>

          {/* Revenue Summary Cards */}

          <div className="grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-3">
            {/* Decision */}

            <button
              type="button"
              onClick={() => toast.info("Northstar decision path opened")}
              className="
                bg-card
                p-5
                text-start
                transition
                hover:bg-primary/5
              "
            >
              <span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary">
                <Sparkles className="size-4" />
              </span>

              <p className="mt-3 text-xs text-muted-foreground">Decision to unlock</p>

              <b className="mt-1 block text-sm">Northstar Labs</b>

              <small className="mt-1 block text-primary">Executive recap due today</small>
            </button>

            {/* Stakeholders */}

            <button
              type="button"
              onClick={() => toast.info("Stakeholder map opened")}
              className="
                bg-card
                p-5
                text-start
                transition
                hover:bg-success/5
              "
            >
              <span className="grid size-8 place-items-center rounded-lg bg-success/12 text-success">
                <UserRoundCheck className="size-4" />
              </span>

              <p className="mt-3 text-xs text-muted-foreground">Relationship coverage</p>

              <b className="mt-1 block text-xl">4 / 5</b>

              <small className="mt-1 block text-success">Stakeholders mapped</small>
            </button>

            {/* Risk */}

            <button
              type="button"
              onClick={() => setFocus("At risk")}
              className="
                bg-card
                p-5
                text-start
                transition
                hover:bg-warning/5
              "
            >
              <span className="grid size-8 place-items-center rounded-lg bg-warning/16 text-warning">
                <CircleAlert className="size-4" />
              </span>

              <p className="mt-3 text-xs text-muted-foreground">Revenue needing action</p>

              <b className="mt-1 block text-xl">$72K</b>

              <small className="mt-1 block text-warning">Two deals need next steps</small>
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          Priority Deal Desk
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-8"
          title="Priority deal desk"
          description="The next best action for your highest-impact conversations"
          action={
            <div className="flex rounded-lg bg-muted p-1">
              {["Pipeline", "At risk", "Closing soon"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFocus(item)}
                  className={
                    focus === item
                      ? "rounded-md bg-card px-2.5 py-1 text-xs font-semibold shadow-sm"
                      : "px-2.5 py-1 text-xs text-muted-foreground"
                  }
                >
                  {item}
                </button>
              ))}
            </div>
          }
        >
          <div className="grid gap-3 md:grid-cols-3">
            {priorityDeals.map((deal) => (
              <article
                key={deal.name}
                className="
                  relative
                  overflow-hidden
                  rounded-xl
                  border
                  bg-background/50
                  p-4
                "
              >
                {/* Status Color */}

                <span
                  className={`
                    absolute
                    start-0
                    top-0
                    h-full
                    w-1
                    ${deal.color}
                  `}
                />

                <div className="ps-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">{deal.company}</p>

                      <h3 className="mt-1 font-semibold">{deal.name}</h3>
                    </div>

                    <b className="text-lg">{deal.value}</b>
                  </div>

                  {/* Deal Details */}

                  <div className="mt-5 space-y-2 text-xs">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Signal</span>

                      <span className="font-semibold">{deal.likelihood}</span>
                    </p>

                    <p className="flex justify-between">
                      <span className="text-muted-foreground">Timing</span>

                      <span>{deal.due}</span>
                    </p>
                  </div>

                  {/* Next Step */}

                  <div className="mt-4 border-t pt-3">
                    <p className="text-xs font-medium">Next: {deal.next}</p>

                    <button
                      type="button"
                      onClick={() => markDone(deal.name)}
                      disabled={done.includes(deal.name)}
                      className="
                        mt-3
                        inline-flex
                        items-center
                        gap-1
                        text-xs
                        font-semibold
                        text-primary
                        disabled:text-success
                      "
                    >
                      {done.includes(deal.name) ? (
                        <>
                          <Check className="size-3.5" />
                          Complete
                        </>
                      ) : (
                        <>
                          Do this now
                          <ChevronRight className="size-3.5 rtl:rotate-180" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Card>

        {/* =================================================
            Relationship Signals
        ================================================= */}

        <Card
          className="xl:col-span-4"
          title="Relationship signals"
          description="Accounts changing in health this week"
        >
          <div className="space-y-3">
            {[
              ["Northstar Labs", "Executive sponsor engaged", "Positive", "success"],
              ["Vertex Labs", "Security review delayed", "Needs attention", "warning"],
              ["Harbor Health", "Usage fell 18%", "At risk", "danger"],
              ["Vexui Systems", "Legal review started", "Progressing", "info"],
            ].map(([account, signal, state, tone]) => (
              <div key={account} className="flex items-center gap-3 rounded-xl border p-3">
                <span
                  className={`
                      size-2.5
                      rounded-full
                      ${
                        tone === "success"
                          ? "bg-success"
                          : tone === "warning"
                            ? "bg-warning"
                            : tone === "danger"
                              ? "bg-destructive"
                              : "bg-info"
                      }
                    `}
                />

                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{account}</b>

                  <small className="block truncate text-xs text-muted-foreground">{signal}</small>
                </span>

                <Badge tone={tone as "success" | "warning" | "danger" | "info"}>{state}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* =================================================
          Opportunity Map + Calendar
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-7"
          title="Opportunity map"
          description="Bubble size indicates deal size; position shows confidence and value"
        >
          <ApexChart
            type="bubble"
            height={325}
            options={mapOptions}
            series={[
              {
                name: "Enterprise",
                data: [
                  {
                    x: 76,
                    y: 84,
                    z: 42,
                  },
                  {
                    x: 88,
                    y: 128,
                    z: 58,
                  },
                  {
                    x: 61,
                    y: 72,
                    z: 32,
                  },
                ],
              },
              {
                name: "Mid-market",
                data: [
                  {
                    x: 68,
                    y: 42,
                    z: 24,
                  },
                  {
                    x: 54,
                    y: 64,
                    z: 29,
                  },
                  {
                    x: 82,
                    y: 38,
                    z: 19,
                  },
                ],
              },
              {
                name: "SMB",
                data: [
                  {
                    x: 42,
                    y: 18,
                    z: 14,
                  },
                  {
                    x: 36,
                    y: 24,
                    z: 17,
                  },
                  {
                    x: 72,
                    y: 28,
                    z: 18,
                  },
                ],
              },
            ]}
          />
        </Card>

        {/* Calendar */}

        <Card
          className="xl:col-span-5"
          title="Todays calendar"
          description="Keep the right conversations moving"
          action={<CalendarDays className="size-4 text-muted-foreground" />}
        >
          <ol className="space-y-3">
            {meetings.map(([time, title, account, kind]) => {
              const Icon = kind === "Video" ? Video : kind === "Phone" ? Phone : Mail;

              return (
                <li key={title} className="flex gap-3">
                  <time className="w-12 pt-1 text-xs font-semibold text-primary">{time}</time>

                  <span className="mt-1.5 size-2 rounded-full bg-primary ring-4 ring-primary/10" />

                  <div className="min-w-0 flex-1 rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <b className="text-sm">{title}</b>

                      <Icon className="size-4 text-muted-foreground" />
                    </div>

                    <small className="mt-1 block text-xs text-muted-foreground">{account}</small>
                  </div>
                </li>
              );
            })}
          </ol>

          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={() => toast.success("Calendar opened")}
          >
            <CalendarDays />
            Open full calendar
          </Button>
        </Card>
      </div>

      {/* =================================================
          Pipeline
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-5"
          title="Pipeline check"
          description="Coverage by stage, without the usual funnel"
        >
          <div className="divide-y rounded-xl border">
            {[
              ["Discovery", "42 deals", "$286K", "2.1"],
              ["Proposal", "34 deals", "$354K", "2.7"],
              ["Negotiation", "21 deals", "$282K", "2.3"],
              ["Contract", "9 deals", "$178K", "1.8"],
            ].map(([stage, deals, value, coverage]) => (
              <div
                key={stage}
                className="
                    grid
                    grid-cols-[1fr_auto_auto]
                    items-center
                    gap-4
                    px-4
                    py-3
                    text-sm
                  "
              >
                <span>
                  <b className="block">{stage}</b>

                  <small className="text-xs text-muted-foreground">{deals}</small>
                </span>

                <b>{value}</b>

                <Badge tone={coverage === "1.8" ? "warning" : "success"}>{coverage}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* =================================================
            Conversation Intelligence
        ================================================= */}

        <Card
          className="xl:col-span-7"
          title="Conversation intelligence"
          description="The sales conversations with the clearest next move"
          action={
            <Badge tone="success" variant="dot">
              3 signals today
            </Badge>
          }
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_210px]">
            <div className="space-y-3">
              {[
                [
                  "Northstar Labs",
                  "Proposal reopened twice after the executive recap.",
                  "Strong intent",
                  "Send mutual action plan",
                  "success",
                  "09:12",
                ],
                [
                  "Vertex Labs",
                  "Security owner asked for an architecture review.",
                  "Technical blocker",
                  "Book solution engineer",
                  "warning",
                  "10:40",
                ],
                [
                  "Vexui Systems",
                  "Legal approval received from the procurement lead.",
                  "Ready to close",
                  "Confirm signature date",
                  "info",
                  "12:15",
                ],
              ].map(([account, signal, status, action, tone, time]) => (
                <div key={account} className="flex gap-3 rounded-xl border p-3">
                  <span
                    className={`
                        mt-1
                        grid
                        size-8
                        shrink-0
                        place-items-center
                        rounded-lg
                        ${
                          tone === "success"
                            ? "bg-success/12 text-success"
                            : tone === "warning"
                              ? "bg-warning/16 text-warning"
                              : "bg-info/14 text-info"
                        }
                      `}
                  >
                    <MessageSquare className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <b className="text-sm">{account}</b>

                      <small className="text-xs text-muted-foreground">{time}</small>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{signal}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone={tone as "success" | "warning" | "info"}>{status}</Badge>

                      <button
                        type="button"
                        onClick={() => toast.success(`${action} task created`)}
                        className="text-xs font-semibold text-primary"
                      >
                        {action}

                        <ChevronRight className="inline size-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </span>
                </div>
              ))}
            </div>

            {/* Suggested Play */}

            <aside className="rounded-xl bg-primary/8 p-4">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
                <Sparkles className="size-4" />
              </span>

              <h3 className="mt-4 text-sm font-semibold">Suggested play</h3>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Northstar is showing high buying intent. Send a mutual action plan before tomorrows
                stakeholder review.
              </p>

              <Button
                size="sm"
                className="mt-4 w-full"
                onClick={() => toast.success("Mutual action plan drafted")}
              >
                Draft plan
              </Button>
            </aside>
          </div>
        </Card>
      </div>

      {/* =================================================
          Buying Committee / Routing / Renewals
      ================================================= */}

      <div className="mt-4 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-5"
          title="Buying committee coverage"
          description="Stakeholders mapped across your priority opportunities"
        >
          <div className="space-y-3">
            {[
              ["Northstar expansion", "4 of 5 stakeholders", "Economic buyer missing", "warning"],
              ["Platform upgrade", "5 of 5 stakeholders", "Full committee mapped", "success"],
              ["Automation rollout", "3 of 5 stakeholders", "Champion needs support", "info"],
              [
                "Workspace consolidation",
                "2 of 5 stakeholders",
                "Multi-thread this week",
                "danger",
              ],
            ].map(([deal, coverage, note, tone]) => {
              const mappedCount =
                deal === "Platform upgrade"
                  ? 5
                  : deal === "Northstar expansion"
                    ? 4
                    : deal === "Automation rollout"
                      ? 3
                      : 2;

              return (
                <div key={deal} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      <b className="block text-sm">{deal}</b>

                      <small className="text-xs text-muted-foreground">{coverage}</small>
                    </span>

                    <Badge tone={tone as "warning" | "success" | "info" | "danger"}>{note}</Badge>
                  </div>

                  <div className="mt-3 flex -space-x-1.5 rtl:space-x-reverse">
                    {Array.from(
                      {
                        length: 5,
                      },
                      (_, person) => (
                        <span
                          key={person}
                          className={`
                              grid
                              size-7
                              place-items-center
                              rounded-full
                              border-2
                              border-card
                              text-[9px]
                              font-semibold
                              ${
                                person < mappedCount
                                  ? "bg-primary/12 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }
                            `}
                        >
                          {["EB", "CH", "IT", "FN", "LG"][person]}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Lead Routing */}

        <Card
          className="xl:col-span-4"
          title="Lead routing quality"
          description="How quickly new demand reaches the right owner"
        >
          <div className="space-y-4">
            {[
              ["Under 5 minutes", "84%", "428 leads", "bg-success"],
              ["530 minutes", "11%", "56 leads", "bg-warning"],
              ["Over 30 minutes", "5%", "24 leads", "bg-destructive"],
            ].map(([label, rate, volume, color]) => (
              <div key={label}>
                <div className="flex items-end justify-between">
                  <span>
                    <b className="block text-sm">{label}</b>

                    <small className="text-xs text-muted-foreground">{volume}</small>
                  </span>

                  <b>{rate}</b>
                </div>

                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{
                      width: rate,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-success/8 p-3 text-sm text-muted-foreground">
            <b className="text-success">Routing win:</b> response time improved by 7 minutes after
            territory automation.
          </div>

          <Button
            size="sm"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => toast.info("Lead routing rules opened")}
          >
            <UserRoundCheck />
            Review routing rules
          </Button>
        </Card>

        {/* Renewals */}

        <Card
          className="xl:col-span-3"
          title="Renewal watch"
          description="Accounts up for renewal next"
        >
          <div className="space-y-3">
            {[
              ["Harbor Health", "$36K", "Sep 03", "warning"],
              ["BrightWorks", "$28K", "Sep 11", "info"],
              ["Cedar & Co.", "$18K", "Sep 19", "success"],
            ].map(([account, value, date, tone]) => (
              <button
                type="button"
                key={account}
                onClick={() => toast.info(`${account} renewal opened`)}
                className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    border
                    p-3
                    text-start
                    hover:border-primary/30
                  "
              >
                <span
                  className={`
                      size-2.5
                      rounded-full
                      ${
                        tone === "warning"
                          ? "bg-warning"
                          : tone === "info"
                            ? "bg-info"
                            : "bg-success"
                      }
                    `}
                />

                <span className="flex-1">
                  <b className="block text-sm">{account}</b>

                  <small className="text-xs text-muted-foreground">Renewal {date}</small>
                </span>

                <b className="text-sm">{value}</b>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* =================================================
          Sales Coaching
      ================================================= */}

      <div className="mt-4 rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold">Sales coaching moments</h2>

            <p className="mt-0.5 text-[12.5px] text-muted-foreground">
              Behavior signals that help the team convert the right conversations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Coaching workspace opened")}
            className="text-xs font-semibold text-primary"
          >
            Open coaching
            <ChevronRight className="inline size-3.5 rtl:rotate-180" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            [
              "Follow-up gap",
              "9 high-value deals have had no activity for 5+ days.",
              "Schedule next steps",
              "warning",
            ],
            [
              "Call quality",
              "Discovery calls with 3+ questions have a 22% higher proposal rate.",
              "Share playbook",
              "success",
            ],
            [
              "Single-threaded risk",
              "6 opportunities rely on just one contact.",
              "Map stakeholders",
              "danger",
            ],
          ].map(([title, note, action, tone]) => (
            <article key={title} className="rounded-xl border p-4">
              <span
                className={`
                    grid
                    size-9
                    place-items-center
                    rounded-lg
                    ${
                      tone === "success"
                        ? "bg-success/12 text-success"
                        : tone === "warning"
                          ? "bg-warning/16 text-warning"
                          : "bg-destructive/12 text-destructive"
                    }
                  `}
              >
                <CircleAlert className="size-4" />
              </span>

              <h3 className="mt-4 text-sm font-semibold">{title}</h3>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p>

              <button
                type="button"
                onClick={() => toast.success(`${action} started`)}
                className="mt-4 text-xs font-semibold text-primary"
              >
                {action}

                <ChevronRight className="inline size-3.5 rtl:rotate-180" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
