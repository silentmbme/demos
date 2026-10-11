import { useMemo } from "react";

import { CalendarDays, CheckCircle2, Plus } from "lucide-react";

import { ApexChart } from "@/components/charts/ApexChart";

import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";

import { Avatar, Badge, Card, PageHeader } from "./widgets";

import { Button } from "@/components/ui/button";

import { deadlines, projects, tasks, workload } from "@/data/project-dashboard-data";

/* =====================================================
   Status Tones
===================================================== */

const tones = {
  "On Track": "success",
  "At Risk": "warning",
  Delayed: "danger",
} as const;

/* =====================================================
   Progress Component
===================================================== */

type ProgressProps = {
  value: number;
  tone?: string;
};

function Progress({ value, tone = "bg-primary" }: ProgressProps) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full ${tone}`}
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}

/* =====================================================
   Projects Dashboard
===================================================== */

export function ProjectsDashboard() {
  const { base } = useChartTheme();

  /* =====================================================
     Delivery Trend Chart
  ===================================================== */

  const chart = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "bar",
        },

        colors: [token("--primary"), token("--chart-3"), token("--destructive")],

        xaxis: {
          categories: ["Aug 05", "Aug 12", "Aug 19", "Aug 26", "Sep 02", "Sep 09"],
        },

        plotOptions: {
          bar: {
            columnWidth: "45%",
            borderRadius: 5,
          },
        },

        stroke: {
          curve: "straight",
          width: [0, 3, 2],
        },

        legend: {
          position: "top",
          horizontalAlign: "left",
        },
      }),
    [base],
  );

  /* =====================================================
     Budget Chart
  ===================================================== */

  const budgetChart = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "bar",
          stacked: true,

          toolbar: {
            show: false,
          },
        },

        colors: [token("--chart-2"), token("--muted")],

        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "48%",
            borderRadius: 5,
          },
        },

        xaxis: {
          categories: ["Website", "Mobile app", "CRM", "Automation"],

          max: 150,

          labels: {
            formatter: (value: string) => `$${value}K`,
          },
        },

        yaxis: {
          labels: {
            style: {
              fontSize: "12px",
            },
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

        tooltip: {
          y: {
            formatter: (value: number) => `$${value}K`,
          },
        },
      }),
    [base],
  );

  /* =====================================================
     Team Performance Radar Chart
  ===================================================== */

  const teamPerformanceChart = useMemo(
    () =>
      mergeOptions(base, {
        chart: {
          type: "radar",

          toolbar: {
            show: false,
          },
        },

        colors: [token("--primary")],

        xaxis: {
          categories: ["Design", "Development", "QA", "Product", "Operations"],
        },

        yaxis: {
          show: false,
          min: 0,
          max: 100,
          tickAmount: 4,
        },

        stroke: {
          width: 2.5,
        },

        fill: {
          opacity: 0.2,
        },

        markers: {
          size: 4,
          strokeWidth: 0,
        },

        plotOptions: {
          radar: {
            polygons: {
              strokeColors: token("--border"),

              connectorColors: token("--border"),

              fill: {
                colors: ["transparent"],
              },
            },
          },
        },

        dataLabels: {
          enabled: true,

          background: {
            enabled: false,
          },

          style: {
            fontSize: "10px",
            fontWeight: 600,
          },
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
        title="Projects"
        subtitle="One place to steer delivery, capacity and project risk."
        breadcrumb={["Vexui", "Dashboards", "Projects"]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarDays />
              August
            </Button>

            <Button size="sm">
              <Plus />
              Create project
            </Button>
          </>
        }
      />

      {/* =================================================
          Delivery Command Center
      ================================================= */}

      <Card className="overflow-hidden border-primary/25" bodyClassName="p-0">
        <div className="grid xl:grid-cols-[1.65fr_1fr]">
          {/* Portfolio Overview */}

          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-primary">
              Delivery command center
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              68% of portfolio delivery is on plan.
            </h2>

            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              14 active projects are consuming $284K of the $410K portfolio budget. Three need an
              owner decision this week.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Portfolio", 24],
                ["Active", 14],
                ["At risk", 3],
                ["Completed", 7],
              ].map(([name, value]) => (
                <div key={name as string} className="rounded-xl border bg-card p-3">
                  <p className="text-xs text-muted-foreground">{name}</p>

                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Pulse */}

          <div className="border-t bg-muted/35 p-6 xl:border-s xl:border-t-0">
            <p className="text-sm font-semibold">Portfolio pulse</p>

            <div className="mt-5 space-y-4">
              {[
                ["Schedule confidence", 68, "bg-primary"],
                ["Budget consumed", 69, "bg-success"],
                ["Team capacity", 82, "bg-info"],
              ].map(([name, value, color]) => (
                <div key={name as string}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span>{name}</span>

                    <b>{value}%</b>
                  </div>

                  <Progress value={value as number} tone={color as string} />
                </div>
              ))}
            </div>

            <p className="mt-6 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
              3 delivery risks require review before Friday.
            </p>
          </div>
        </div>
      </Card>

      {/* =================================================
          Active Delivery Board
      ================================================= */}

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-8"
          title="Active delivery board"
          description="Projects arranged by delivery confidence"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map(([name, client, progress, due, status, owner]) => (
              <div key={name} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{name}</p>

                    <p className="text-xs text-muted-foreground">
                      {client} due {due}
                    </p>
                  </div>

                  <Badge tone={tones[status]}>{status}</Badge>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <Avatar initials={owner} />

                  <div className="flex-1">
                    <div className="mb-2 flex justify-between text-xs">
                      <span>Delivery progress</span>

                      <b>{progress}%</b>
                    </div>

                    <Progress
                      value={Number(progress)}
                      tone={
                        status === "Delayed"
                          ? "bg-destructive"
                          : status === "At Risk"
                            ? "bg-warning"
                            : "bg-success"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Execution Pulse */}

        <Card
          className="xl:col-span-4"
          title="Execution pulse"
          description="Work status across all active projects"
        >
          <div className="space-y-3">
            {[
              ["Ready to start", 84, "bg-muted"],
              ["In progress", 126, "bg-primary"],
              ["In review", 42, "bg-warning"],
              ["Delivered", 428, "bg-success"],
              ["Blocked", 18, "bg-destructive"],
            ].map(([name, value, color]) => (
              <div key={name as string} className="flex items-center gap-3">
                <i className={`size-2.5 rounded-full ${color}`} />

                <span className="flex-1 text-sm">{name}</span>

                <b className="text-sm">{value}</b>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-primary/10 p-3 text-xs">
            <b className="text-primary">72% completion</b>

            <span className="block pt-1 text-muted-foreground">
              +8 points from the previous sprint.
            </span>
          </div>
        </Card>
      </div>

      {/* =================================================
          Workload / Deadlines / Budget
      ================================================= */}

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        {/* Team Workload */}

        <Card
          className="xl:col-span-4"
          title="Team workload"
          description="People closest to capacity"
        >
          <div className="space-y-4">
            {workload.map(([name, initials, count, capacity]) => (
              <div key={name} className="flex gap-3">
                <Avatar initials={initials} />

                <div className="flex-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{name}</span>

                    <b>{count} tasks</b>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1">
                      <Progress
                        value={capacity}
                        tone={capacity > 90 ? "bg-warning" : "bg-primary"}
                      />
                    </div>

                    <span
                      className={
                        capacity > 90
                          ? "text-xs font-semibold text-warning"
                          : "text-xs font-semibold"
                      }
                    >
                      {capacity}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Next Deadlines */}

        <Card
          className="xl:col-span-4"
          title="Next deadlines"
          description="The work that cannot slip"
        >
          <ol className="space-y-3">
            {deadlines.map(([month, day, project, item, priority]) => (
              <li key={project} className="flex gap-3 rounded-lg border p-3">
                <time className="w-9 text-center">
                  <b className="block text-lg leading-none">{day}</b>

                  <small className="text-[10px] text-muted-foreground">{month}</small>
                </time>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{project}</p>

                  <p className="truncate text-xs text-muted-foreground">{item}</p>
                </div>

                <Badge
                  tone={
                    priority === "Critical" ? "danger" : priority === "High" ? "warning" : "muted"
                  }
                >
                  {priority}
                </Badge>
              </li>
            ))}
          </ol>
        </Card>

        {/* Budget Watch */}

        <Card
          className="xl:col-span-4"
          title="Budget watch"
          description="Active allocation, spend and remaining headroom"
          bodyClassName="pb-4"
        >
          <ApexChart
            type="bar"
            height={218}
            options={budgetChart}
            series={[
              {
                name: "Spent",
                data: [68, 92, 54, 70],
              },
              {
                name: "Remaining",
                data: [12, 48, 56, 10],
              },
            ]}
          />

          <div className="mt-2 grid grid-cols-3 divide-x rtl:divide-x-reverse rounded-lg border bg-muted/25 py-2 text-center">
            <div>
              <p className="text-[10px] text-muted-foreground">Allocated</p>

              <b className="text-sm">$410K</b>
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground">Committed</p>

              <b className="text-sm text-primary">$284K</b>
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground">Headroom</p>

              <b className="text-sm text-success">$126K</b>
            </div>
          </div>
        </Card>
      </div>

      {/* =================================================
          Delivery Trend + Risk Register
      ================================================= */}

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-7"
          title="Delivery trend"
          description="Are planned tasks being delivered on schedule?"
        >
          <ApexChart
            type="bar"
            height={300}
            options={chart}
            series={[
              {
                name: "Planned",
                type: "column",
                data: [92, 104, 118, 126, 134, 142],
              },
              {
                name: "Completed",
                type: "line",
                data: [74, 88, 102, 116, 124, 136],
              },
              {
                name: "Overdue",
                type: "line",
                data: [14, 12, 15, 10, 9, 7],
              },
            ]}
          />
        </Card>

        {/* Risk Register */}

        <Card
          className="xl:col-span-5"
          title="Risk register"
          description="Highest-impact blockers this week"
        >
          <div className="space-y-3">
            {[
              ["Legacy API compatibility", "CRM Migration", "Critical", "Dependency unresolved"],
              ["Payment gateway approval", "Mobile App v2", "High", "External sign-off due"],
              ["Design approval delay", "Website Redesign", "Medium", "Client feedback pending"],
            ].map(([name, project, severity, note]) => (
              <div key={name} className="rounded-xl border p-3">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-semibold">{name}</p>

                  <Badge
                    tone={
                      severity === "Critical" ? "danger" : severity === "High" ? "warning" : "muted"
                    }
                  >
                    {severity}
                  </Badge>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {project} {note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <span className="rounded-lg bg-muted p-2">
              <b className="block text-lg">7</b>
              Open risks
            </span>

            <span className="rounded-lg bg-muted p-2">
              <b className="block text-lg text-destructive">2</b>
              Critical
            </span>

            <span className="rounded-lg bg-muted p-2">
              <b className="block text-lg text-warning">18</b>
              Blocked
            </span>
          </div>
        </Card>
      </div>

      {/* =================================================
          Tasks / Milestones / Performance
      ================================================= */}

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        {/* Priority Tasks */}

        <Card
          className="xl:col-span-4"
          title="Priority tasks"
          description="Personal actions due next"
        >
          <div className="space-y-3">
            {tasks.map(([task, project, _priority, owner, due, done]) => (
              <label key={task} className="flex items-start gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  defaultChecked={done}
                  className="mt-0.5 size-4 accent-primary"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{task}</p>

                  <p className="text-xs text-muted-foreground">
                    {project} {due}
                  </p>
                </div>

                <Avatar initials={owner} className="size-7 text-[10px]" />
              </label>
            ))}
          </div>
        </Card>

        {/* Milestone Path */}

        <Card
          className="xl:col-span-4"
          title="Milestone path"
          description="Recent and next project markers"
        >
          <ol className="space-y-4 border-s ps-5">
            {[
              ["Design system approved", "Website Redesign", "Completed", "Aug 22"],
              ["Beta testing", "Mobile App v2", "Current", "Aug 29"],
              ["Data migration", "CRM Migration", "Upcoming", "Sep 02"],
              ["Campaign launch", "Marketing Automation", "Upcoming", "Sep 05"],
            ].map(([milestone, project, status, date]) => (
              <li key={milestone} className="relative">
                <i className="absolute -start-[22px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-card" />

                <p className="text-sm font-semibold">{milestone}</p>

                <p className="text-xs text-muted-foreground">
                  {project} {status} {date}
                </p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Team Performance */}

        <Card
          className="xl:col-span-4"
          title="Team performance"
          description="On-time completion by discipline"
          bodyClassName="pb-4"
        >
          <ApexChart
            type="radar"
            height={255}
            options={teamPerformanceChart}
            series={[
              {
                name: "On-time delivery",

                data: [88, 76, 82, 91, 72],
              },
            ]}
          />

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 text-xs">
            <span className="flex justify-between">
              <span className="text-muted-foreground">Best signal</span>

              <b className="text-success">Product 91%</b>
            </span>

            <span className="flex justify-between">
              <span className="text-muted-foreground">Focus area</span>

              <b className="text-warning">Operations 72%</b>
            </span>
          </div>
        </Card>
      </div>

      {/* =================================================
          Delivery Stand-up + Decisions
      ================================================= */}

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        <Card
          className="xl:col-span-8"
          title="Delivery stand-up"
          description="The project conversations that need a decision before the next planning cycle"
          action={
            <Badge tone="warning" variant="dot">
              3 decisions waiting
            </Badge>
          }
        >
          <div className="divide-y rounded-xl border">
            {[
              [
                "Website Redesign",
                "Homepage approval is blocking developer handoff",
                "Sophia Carter",
                "Today",
                "warning",
              ],
              [
                "CRM Migration",
                "Legacy API compatibility needs a technical owner",
                "Daniel Lee",
                "Tomorrow",
                "danger",
              ],
              [
                "Mobile App v2",
                "Beta feedback is ready for product triage",
                "Olivia Smith",
                "Aug 29",
                "info",
              ],
              [
                "Marketing Automation",
                "Campaign audience is ready for launch approval",
                "Emma Wilson",
                "Sep 05",
                "success",
              ],
            ].map(([project, update, owner, date, tone]) => (
              <div key={project} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span
                  className={`size-2.5 rounded-full ${
                    tone === "danger"
                      ? "bg-destructive"
                      : tone === "warning"
                        ? "bg-warning"
                        : tone === "info"
                          ? "bg-info"
                          : "bg-success"
                  }`}
                />

                <span className="min-w-[160px] flex-1">
                  <b className="block text-sm">{project}</b>

                  <small className="block text-xs text-muted-foreground">{update}</small>
                </span>

                <span className="text-xs text-muted-foreground">Owner: {owner}</span>

                <Badge tone={tone as "warning" | "danger" | "info" | "success"}>{date}</Badge>

                <button
                  type="button"
                  onClick={() => alert(`${project} stand-up item opened`)}
                  className="text-xs font-semibold text-primary"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Decision Queue */}

        <Card
          className="xl:col-span-4"
          title="Decision queue"
          description="Small choices with a big delivery impact"
        >
          <div className="space-y-3">
            {[
              ["Approve homepage route", "Website Redesign", "15 min", "success"],
              ["Assign API owner", "CRM Migration", "Today", "danger"],
              ["Confirm beta cohort", "Mobile App v2", "Tomorrow", "warning"],
            ].map(([decision, project, timing, tone]) => (
              <button
                type="button"
                key={decision}
                onClick={() => alert(`${decision} decision opened`)}
                className="flex w-full items-center gap-3 rounded-xl border p-3 text-start transition hover:border-primary/30"
              >
                <span
                  className={`grid size-8 place-items-center rounded-lg ${
                    tone === "danger"
                      ? "bg-destructive/12 text-destructive"
                      : tone === "warning"
                        ? "bg-warning/16 text-warning"
                        : "bg-success/12 text-success"
                  }`}
                >
                  <CheckCircle2 className="size-4" />
                </span>

                <span className="flex-1">
                  <b className="block text-sm">{decision}</b>

                  <small className="text-xs text-muted-foreground">{project}</small>
                </span>

                <small className="text-xs font-semibold text-primary">{timing}</small>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* =================================================
          Capacity / Health / Project Rhythm
      ================================================= */}

      <div className="mt-5 grid gap-4 xl:grid-cols-12">
        {/* Capacity Board */}

        <Card
          className="xl:col-span-5"
          title="Capacity board"
          description="How much focused delivery time is available this week"
        >
          <div className="space-y-4">
            {[
              ["Design", "4.5 days", "2 requests waiting", 76, "SC"],
              ["Engineering", "2.0 days", "1 dependency blocked", 88, "DL"],
              ["QA", "3.5 days", "Beta starts Friday", 64, "OW"],
              ["Product", "1.5 days", "3 decisions queued", 92, "EW"],
            ].map(([discipline, availability, note, load, initials]) => (
              <div key={discipline} className="flex items-center gap-3">
                <Avatar initials={initials as string} className="size-9 text-[10px]" />

                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2">
                    <b className="text-sm">{discipline}</b>

                    <small className="text-xs font-semibold">{availability}</small>
                  </span>

                  <small className="block text-xs text-muted-foreground">{note}</small>

                  <div className="mt-2 h-1.5 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        (load as number) > 85 ? "bg-warning" : "bg-success"
                      }`}
                      style={{
                        width: `${load}%`,
                      }}
                    />
                  </div>
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 rounded-xl bg-info/10 p-3 text-xs text-muted-foreground">
            <b className="text-info">Planning note:</b> Engineering has 2 focused days available
            after the API owner is confirmed.
          </p>
        </Card>

        {/* Delivery Health */}

        <Card
          className="xl:col-span-4"
          title="Delivery health"
          description="Signals across scope, schedule and quality"
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["Scope", "Stable", "success"],
              ["Schedule", "Watch", "warning"],
              ["Quality", "Strong", "success"],
            ].map(([label, state, tone]) => (
              <div key={label} className="rounded-xl border p-3">
                <span
                  className={`mx-auto grid size-8 place-items-center rounded-full ${
                    tone === "warning" ? "bg-warning/16 text-warning" : "bg-success/12 text-success"
                  }`}
                >
                  <CheckCircle2 className="size-4" />
                </span>

                <b className="mt-3 block text-sm">{state}</b>

                <small className="text-xs text-muted-foreground">{label}</small>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Delivery confidence</span>

              <b>82 / 100</b>
            </p>

            <p className="flex justify-between">
              <span className="text-muted-foreground">Milestones on time</span>

              <b className="text-success">12 of 14</b>
            </p>

            <p className="flex justify-between">
              <span className="text-muted-foreground">Open dependencies</span>

              <b className="text-warning">5</b>
            </p>
          </div>
        </Card>

        {/* Project Rhythm */}

        <Card className="xl:col-span-3" title="Project rhythm" description="Next delivery moments">
          <ol className="space-y-4 border-s ps-4">
            {[
              ["Today", "Design review", "Website Redesign"],
              ["Aug 29", "Beta checkpoint", "Mobile App v2"],
              ["Sep 02", "Migration rehearsal", "CRM Migration"],
              ["Sep 05", "Campaign launch", "Marketing Automation"],
            ].map(([date, event, project]) => (
              <li key={event} className="relative">
                <span className="absolute -start-[21px] top-1 size-2.5 rounded-full bg-primary ring-4 ring-card" />

                <small className="text-xs font-semibold text-primary">{date}</small>

                <b className="mt-1 block text-sm">{event}</b>

                <small className="text-xs text-muted-foreground">{project}</small>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
