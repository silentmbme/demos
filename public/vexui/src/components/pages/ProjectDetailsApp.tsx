import { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { getUserImage } from "@/lib/user-images";
import { cn } from "@/lib/utils";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";

const team = [
  { name: "Sophia Carter", role: "Project Manager", tasks: "12 open tasks", initials: "SC" },
  { name: "Daniel Lee", role: "Frontend Developer", tasks: "18 open tasks", initials: "DL" },
  { name: "Emma Wilson", role: "Product Designer", tasks: "9 open tasks", initials: "EW" },
  { name: "Noah Williams", role: "QA Engineer", tasks: "11 open tasks", initials: "NW" },
];

const tabs = ["Overview", "Tasks", "Milestones", "Files", "Activity"] as const;
type Tab = (typeof tabs)[number];

const milestones = [
  {
    title: "Homepage approval",
    due: "Aug 28",
    status: "Complete",
    note: "Client review signed off",
  },
  {
    title: "Development freeze",
    due: "Sep 05",
    status: "In progress",
    note: "Final UI and QA handoff",
  },
  {
    title: "Production launch",
    due: "Sep 10",
    status: "Upcoming",
    note: "Release readiness checkpoint",
  },
];

export function ProjectDetailsApp() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [following, setFollowing] = useState(true);

  return (
    <>
      <PageHeader
        title="Website Redesign"
        subtitle="PRJ-1048 - Nexora customer experience program"
        breadcrumb={["Projects", "Project Details"]}
        actions={
          <>
            <Button variant="outline" onClick={() => setFollowing((value) => !value)}>
              <Icons.Bell className={cn("size-4", following && "fill-current")} />
              {following ? "Following" : "Follow"}
            </Button>
            <Button variant="outline" onClick={() => toast.success("New task panel opened")}>
              <Icons.Plus className="size-4" />
              Add task
            </Button>
            <Button onClick={() => toast.success("Project editor opened")}>
              <Icons.Pencil className="size-4" />
              Edit project
            </Button>
          </>
        }
      />

      <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-info to-success" />
        <div className="absolute -end-20 -top-24 size-72 rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="relative grid gap-6 p-6 lg:grid-cols-[1fr_330px] lg:p-7">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="info">Active</Badge>
              <Badge tone="warning">High priority</Badge>
              <Badge tone="success">Healthy delivery</Badge>
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">
              A polished digital experience, ready to ship.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              A full redesign of Nexora's customer platform spanning the design system, responsive
              storefront, account experience, and checkout flow.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-y-5 sm:grid-cols-4">
              {[
                ["Client", "Nexora"],
                ["Project owner", "Sophia Carter"],
                ["Started", "Jun 12, 2026"],
                ["Target launch", "Sep 10, 2026"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <b className="mt-1 block text-sm">{value}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border bg-background/80 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Overall progress</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ahead of the planned delivery curve
                </p>
              </div>
              <span className="grid size-12 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                82%
              </span>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-primary to-info" />
            </div>
            <div className="mt-5 grid grid-cols-3 divide-x rtl:divide-x-reverse text-center">
              <div>
                <b className="block text-base">48</b>
                <span className="text-[11px] text-muted-foreground">Tasks done</span>
              </div>
              <div>
                <b className="block text-base">4/6</b>
                <span className="text-[11px] text-muted-foreground">Milestones</span>
              </div>
              <div>
                <b className="block text-base">3</b>
                <span className="text-[11px] text-muted-foreground">Open risks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav
        className="mt-5 flex gap-1 overflow-x-auto rounded-xl border bg-card p-1.5"
        aria-label="Project detail sections"
      >
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "min-w-max rounded-lg px-4 py-2.5 text-sm font-medium transition",
              tab === item
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item}
            {item === "Tasks" && (
              <span
                className={cn(
                  "ms-2 rounded-full px-1.5 py-0.5 text-[10px]",
                  tab === item ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                14
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-5">
          {tab === "Overview" && (
            <>
              <Card title="Delivery plan" subtitle="Key milestones across the current release">
                <div className="space-y-0">
                  {milestones.map((item, index) => (
                    <div key={item.title} className="relative flex gap-4 pb-5 last:pb-0">
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "grid w-6 h-8 place-items-center rounded-full",
                            item.status === "Complete"
                              ? "bg-success text-success-foreground"
                              : item.status === "In progress"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {item.status === "Complete" ? (
                            <Icons.Check className="size-4" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        {index < milestones.length - 1 && (
                          <span className="mt-1 h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="flex-1 rounded-xl border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <b className="text-sm">{item.title}</b>
                          <Badge
                            tone={
                              item.status === "Complete"
                                ? "success"
                                : item.status === "In progress"
                                  ? "info"
                                  : "muted"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                        <p className="mt-3 text-xs font-medium text-muted-foreground">
                          Due {item.due}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="grid gap-5 md:grid-cols-2">
                <Card title="Project scope">
                  <div className="space-y-4 text-sm">
                    {[
                      ["Experience", "Responsive storefront and account flows"],
                      ["Platforms", "Desktop, tablet, and mobile"],
                      ["Release", "September 2026"],
                      ["Tags", "Design, Frontend, Client work"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="mt-1 font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Release readiness">
                  <div className="space-y-4">
                    {[
                      ["Design sign-off", 100, "bg-success"],
                      ["Engineering", 82, "bg-primary"],
                      ["Quality assurance", 68, "bg-warning"],
                    ].map(([label, value, color]) => (
                      <div key={String(label)}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>{label}</span>
                          <b>{value}%</b>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", String(color))}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}

          {tab === "Tasks" && (
            <Card
              title="Delivery tasks"
              subtitle="Work prioritized for the current release"
              action={
                <Button size="sm" onClick={() => toast.success("Task creation started")}>
                  <Icons.Plus className="size-4" />
                  New task
                </Button>
              }
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary">
                  All tasks
                </Button>
                <Button size="sm" variant="ghost">
                  In progress
                </Button>
                <Button size="sm" variant="ghost">
                  Review
                </Button>
                <Button size="sm" variant="ghost">
                  Completed
                </Button>
              </div>
              <div className="divide-y">
                {[
                  ["Finalize checkout flow", "Daniel Lee", "High", "Aug 27", "In progress"],
                  ["Review design assets", "Emma Wilson", "High", "Aug 28", "Review"],
                  ["Responsive QA", "Noah Williams", "Medium", "Aug 29", "In progress"],
                  ["Client feedback pass", "Sophia Carter", "Medium", "Sep 01", "Planned"],
                ].map(([title, assignee, priority, date, status]) => (
                  <div key={title} className="flex flex-wrap items-center gap-3 py-4">
                    <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icons.CheckSquare className="size-4" />
                    </span>
                    <div className="min-w-[180px] flex-1">
                      <b className="block text-sm">{title}</b>
                      <span className="text-xs text-muted-foreground">
                        {assignee} - due {date}
                      </span>
                    </div>
                    <Badge tone={priority === "High" ? "danger" : "warning"}>{priority}</Badge>
                    <Badge tone={status === "In progress" ? "info" : "muted"}>{status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "Milestones" && (
            <Card title="Milestone timeline" subtitle="Plan and monitor all delivery checkpoints">
              <div className="space-y-4">
                {[
                  ...milestones,
                  {
                    title: "Post-launch review",
                    due: "Sep 17",
                    status: "Planned",
                    note: "Measure launch health and collect feedback",
                  },
                ].map((item, index) => (
                  <div key={item.title} className="flex gap-4 rounded-xl border p-4">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 font-semibold text-primary">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <b>{item.title}</b>
                        <span className="text-sm text-muted-foreground">{item.due}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "Files" && (
            <Card
              title="Project files"
              subtitle="Latest shared documents and delivery assets"
              action={
                <Button size="sm" onClick={() => toast.success("Upload dialog opened")}>
                  <Icons.Upload className="size-4" />
                  Upload
                </Button>
              }
            >
              <div className="divide-y">
                {[
                  [
                    "Homepage-Final.fig",
                    "Figma design file",
                    "18.4 MB",
                    "Emma Wilson",
                    Icons.Palette,
                  ],
                  [
                    "Sprint-Plan.pdf",
                    "Planning document",
                    "2.2 MB",
                    "Sophia Carter",
                    Icons.FileText,
                  ],
                  [
                    "QA-Checklist.xlsx",
                    "Quality checklist",
                    "1.1 MB",
                    "Noah Williams",
                    Icons.Sheet,
                  ],
                ].map(([name, type, size, author, Icon]) => (
                  <div key={String(name)} className="flex items-center gap-3 py-4">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <b className="block truncate text-sm">{name}</b>
                      <span className="text-xs text-muted-foreground">
                        {type} - {size} - uploaded by {author}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.success("Download started")}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "Activity" && (
            <Card title="Recent activity" subtitle="Changes from the project team">
              <div className="space-y-5">
                {[
                  ["Sophia Carter", "updated the project timeline", "20 minutes ago"],
                  ["Daniel Lee", "completed checkout UI implementation", "1 hour ago"],
                  ["Emma Wilson", "uploaded final design assets", "3 hours ago"],
                  ["Noah Williams", "added responsive QA findings", "Yesterday"],
                ].map(([name, action, time]) => (
                  <div key={action} className="flex gap-3">
                    <img
                      src={getUserImage(name)}
                      alt={name}
                      className="size-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm">
                        <b>{name}</b> {action}
                      </p>
                      <span className="text-xs text-muted-foreground">{time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>

        <aside className="space-y-5">
          <Card
            title="Project team"
            action={
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline"
                onClick={() => toast.success("Team workspace opened")}
              >
                Manage
              </button>
            }
          >
            <div className="space-y-3">
              {team.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <img
                    src={getUserImage(member.name)}
                    alt={member.name}
                    className="size-10 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm">{member.name}</b>
                    <span className="block truncate text-xs text-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {member.tasks.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
            <Button
              className="mt-5 w-full"
              variant="outline"
              onClick={() => toast.success("Invite dialog opened")}
            >
              <Icons.UserPlus className="size-4" />
              Invite teammate
            </Button>
          </Card>
          <Card title="Budget health">
            <div className="rounded-xl bg-success/10 p-3">
              <div className="flex items-center gap-2 text-success">
                <Icons.TrendingUp className="size-4" />
                <b className="text-sm">Within budget</b>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Spending remains aligned with the delivery plan.
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[85%] rounded-full bg-success" />
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Total budget", "$80,000"],
                ["Spent", "$68,000"],
                ["Remaining", "$12,000"],
                ["Utilization", "85%"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <b>{value}</b>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Risks and issues">
            <div className="space-y-3">
              {[
                ["Payment gateway dependency", "High", "danger"],
                ["Design approval delay", "Medium", "warning"],
                ["Legacy API compatibility", "Critical", "danger"],
              ].map(([issue, level, levelTone]) => (
                <div key={issue} className="rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <b className="text-sm">{issue}</b>
                    <Badge tone={levelTone}>{level}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Owner notified and mitigation is being tracked.
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
