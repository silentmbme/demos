import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { getUserImage } from "@/lib/user-images";
import { cn } from "@/lib/utils";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type P = {
  name: string;
  id: string;
  client: string;
  owner: string;
  progress: number;
  spent: number;
  budget: number;
  due: string;
  risk: string;
  status: string;
  priority: string;
  team: string[];
  tags: string[];
  tasks: string;
};

const data: P[] = [
  {
    name: "Website Redesign",
    id: "PRJ-1048",
    client: "Nexora",
    owner: "Sophia Carter",
    progress: 82,
    spent: 68000,
    budget: 80000,
    due: "Sep 10",
    risk: "Healthy",
    status: "Active",
    priority: "High",
    team: ["SC", "DL", "EM", "NW"],
    tags: ["Design", "Frontend"],
    tasks: "48 / 62",
  },
  {
    name: "Mobile App v2",
    id: "PRJ-1052",
    client: "CloudAxis",
    owner: "Daniel Lee",
    progress: 64,
    spent: 92000,
    budget: 140000,
    due: "Sep 22",
    risk: "Watch",
    status: "Active",
    priority: "Critical",
    team: ["DL", "SC", "EW"],
    tags: ["Mobile"],
    tasks: "32 / 50",
  },
  {
    name: "CRM Migration",
    id: "PRJ-1061",
    client: "Vertex Labs",
    owner: "Olivia Smith",
    progress: 46,
    spent: 54000,
    budget: 110000,
    due: "Oct 02",
    risk: "At Risk",
    status: "Active",
    priority: "High",
    team: ["OS", "DL", "EM"],
    tags: ["Migration"],
    tasks: "23 / 50",
  },
  {
    name: "Marketing Automation",
    id: "PRJ-1068",
    client: "BrightWorks",
    owner: "Emma Wilson",
    progress: 71,
    spent: 70000,
    budget: 80000,
    due: "Sep 18",
    risk: "Healthy",
    status: "Active",
    priority: "Medium",
    team: ["EW", "SC", "OS"],
    tags: ["Automation"],
    tasks: "34 / 48",
  },
  {
    name: "Analytics Platform",
    id: "PRJ-1072",
    client: "Vexui Systems",
    owner: "Olivia Smith",
    progress: 38,
    spent: 82000,
    budget: 180000,
    due: "Oct 20",
    risk: "Watch",
    status: "Planning",
    priority: "Medium",
    team: ["OS", "DL"],
    tags: ["Data"],
    tasks: "19 / 50",
  },
  {
    name: "Customer Portal",
    id: "PRJ-1078",
    client: "Acme Inc.",
    owner: "Sophia Carter",
    progress: 94,
    spent: 116000,
    budget: 120000,
    due: "Aug 30",
    risk: "Healthy",
    status: "Active",
    priority: "High",
    team: ["SC", "EW", "NW"],
    tags: ["Client Work"],
    tasks: "47 / 50",
  },
];

const tone: any = {
  Healthy: "success",
  Watch: "warning",
  "At Risk": "danger",
  Active: "info",
  Planning: "primary",
  Completed: "success",
};

export function ProjectGridApp() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [risk, setRisk] = useState("All");
  const [active, setActive] = useState<P | null>(null);

  const rows = useMemo(
    () =>
      data.filter(
        (p) =>
          (!q ||
            [p.name, p.id, p.client, p.owner, ...p.tags]
              .join(" ")
              .toLowerCase()
              .includes(q.toLowerCase())) &&
          (status === "All" || p.status === status) &&
          (risk === "All" || p.risk === risk),
      ),
    [q, status, risk],
  );

  return (
    <>
      <PageHeader
        title="Project Grid"
        subtitle="Monitor project health, progress, teams and delivery timelines in a visual workspace."
        breadcrumb={["Projects", "Project Grid"]}
        actions={
          <>
            <Button variant="outline" onClick={() => location.assign("/projects/list")}>
              List
            </Button>

            <Button onClick={() => toast.success("Add Project flow ready")}>
              <Icons.Plus />
              Add Project
            </Button>
          </>
        }
      />
      <Card className="mb-4" bodyClassName="p-0">
        <div className="grid grid-cols-2 divide-x rtl:divide-x-reverse divide-y sm:grid-cols-3 xl:grid-cols-6 xl:divide-y-0">
          {[
            ["Projects", "148"],
            ["Active", "84"],
            ["On track", "62"],
            ["At risk", "12"],
            ["Delayed", "10"],
            ["Portfolio budget", "$2.84M"],
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-0.5 text-lg font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </Card>
      <div className="mb-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline">
          All projects
        </Button>

        <Button size="sm" variant="outline" onClick={() => setStatus("Active")}>
          Active
        </Button>

        <Button size="sm" variant="outline" onClick={() => setRisk("Healthy")}>
          On track
        </Button>

        <Button size="sm" variant="outline" onClick={() => setRisk("At Risk")}>
          At risk
        </Button>

        <Button size="sm" variant="outline" onClick={() => setStatus("Planning")}>
          Planning
        </Button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="relative min-w-56 flex-1">
          <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects"
            className="h-10 w-full rounded border bg-background ps-9 pe-3"
          />
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded border bg-background px-3"
        >
          <option>All</option>
          <option>Active</option>
          <option>Planning</option>
        </select>

        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          className="h-10 rounded border bg-background px-3"
        >
          <option>All</option>
          <option>Healthy</option>
          <option>Watch</option>
          <option>At Risk</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((p) => (
          <Card key={p.id} bodyClassName="p-4">
            <button onClick={() => setActive(p)} className="w-full text-start">
              <div className="flex justify-between">
                <span>
                  <b className="block text-base hover:text-primary">{p.name}</b>
                  <small className="text-muted-foreground">{p.id}</small>
                </span>

                <Icons.MoreHorizontal className="size-4 text-muted-foreground" />
              </div>

              <div className="mt-4 flex justify-between">
                <span>{p.client}</span>
                <Badge tone={tone[p.status]}>{p.status}</Badge>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                Delivery work across design, engineering and client collaboration.
              </p>

              <div className="mt-4 flex justify-between text-sm">
                <b>Progress</b>
                <b>{p.progress}%</b>
              </div>

              <div className="mt-1 h-2 rounded bg-muted">
                <div className="h-full rounded bg-primary" style={{ width: `${p.progress}%` }} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <p>
                  <small className="block text-muted-foreground">Tasks</small>
                  <b>{p.tasks}</b>
                </p>

                <p>
                  <small className="block text-muted-foreground">Milestones</small>
                  <b>4 / 6</b>
                </p>

                <p>
                  <small className="block text-muted-foreground">Budget</small>
                  <b>
                    ${(p.spent / 1e3).toFixed(0)}K / ${(p.budget / 1e3).toFixed(0)}K
                  </b>
                </p>

                <p>
                  <small className="block text-muted-foreground">Due</small>
                  <b>{p.due}</b>
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="flex -space-x-1 rtl:space-x-reverse">
                  {p.team.map((x) => (
                    <span
                      key={x}
                      className="grid w-6 h-10 place-items-center rounded-full border bg-primary/10 text-[9px] text-primary"
                    >
                      {x}
                    </span>
                  ))}
                </span>

                <span className="flex gap-1">
                  <Badge tone={tone[p.risk]}>{p.risk}</Badge>
                  <Badge>{p.priority}</Badge>
                </span>
              </div>
            </button>
          </Card>
        ))}
      </div>
      <Sheet open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl">
          {active && (
            <>
              <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/[0.16] via-card to-info/[0.12] px-6 pb-6 pt-8">
                <div className="absolute -end-10 -top-12 size-44 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={tone[active.status]}>{active.status}</Badge>
                      <Badge tone={tone[active.risk]}>{active.risk}</Badge>
                      <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-semibold">
                        {active.priority} priority
                      </span>
                    </div>
                    <h2 className="mt-4 truncate text-2xl font-semibold">{active.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {active.id} · {active.client}
                    </p>
                  </div>
                </div>
                <div className="relative mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Delivery progress</span>
                    <b className="text-primary">{active.progress}%</b>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-background/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-info"
                      style={{ width: `${active.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border bg-muted/[.35] p-3">
                    <p className="text-xs text-muted-foreground">Tasks done</p>
                    <b className="mt-1 block text-base">{active.tasks}</b>
                    <p className="mt-1 text-xs text-muted-foreground">Delivery scope</p>
                  </div>
                  <div className="rounded-xl border bg-muted/[.35] p-3">
                    <p className="text-xs text-muted-foreground">Due date</p>
                    <b className="mt-1 block text-base">{active.due}</b>
                    <p className="mt-1 text-xs text-muted-foreground">Schedule tracked</p>
                  </div>
                  <div className="rounded-xl border bg-muted/[.35] p-3">
                    <p className="text-xs text-muted-foreground">Budget used</p>
                    <b className="mt-1 block text-base">
                      {Math.round((active.spent / active.budget) * 100)}%
                    </b>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ${(active.spent / 1e3).toFixed(0)}K spent
                    </p>
                  </div>
                </div>

                <section>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Team workspace</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        People collaborating on this delivery
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-primary hover:underline"
                      onClick={() => toast.success("Team workspace opened")}
                    >
                      Manage
                    </button>
                  </div>
                  <div className="mt-4 rounded-xl border p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getUserImage(active.owner)}
                        alt={active.owner}
                        className="size-10 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <b className="block truncate text-sm">{active.owner}</b>
                        <span className="text-xs text-muted-foreground">Project owner</span>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                        Owner
                      </span>
                    </div>
                    <div className="mt-3 flex items-center border-t pt-3">
                      <div className="flex -space-x-2 rtl:space-x-reverse">
                        {active.team.map((member) => (
                          <img
                            key={member}
                            src={getUserImage(member)}
                            alt={member}
                            className="size-8 rounded-full border-2 border-card object-cover"
                          />
                        ))}
                      </div>
                      <span className="ms-3 text-xs text-muted-foreground">
                        {active.team.length} contributors
                      </span>
                      <button
                        type="button"
                        className="ms-auto grid size-8 place-items-center rounded-lg border text-muted-foreground hover:text-primary"
                        aria-label="Invite contributor"
                        onClick={() => toast.success("Invite sent")}
                      >
                        <Icons.UserPlus className="size-4" />
                      </button>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Delivery milestones</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Upcoming checkpoints and dependencies
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-primary hover:underline"
                      onClick={() => toast.success("Project timeline opened")}
                    >
                      Timeline
                    </button>
                  </div>
                  <div className="mt-4">
                    {[
                      ["Scope confirmed", "Aug 24", "complete"],
                      ["Execution sprint", "In progress", "current"],
                      ["Client delivery", active.due, "upcoming"],
                    ].map(([title, date, state], index) => (
                      <div key={title} className="relative flex gap-3 pb-5 last:pb-0">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              "grid w-6 h-10 place-items-center rounded-full",
                              state === "complete"
                                ? "bg-success text-success-foreground"
                                : state === "current"
                                  ? "bg-primary text-primary-foreground"
                                  : "border text-muted-foreground",
                            )}
                          >
                            {state === "complete" ? <Icons.Check className="size-4" /> : index + 1}
                          </span>
                          {index < 2 && <span className="mt-1 h-full w-px bg-border" />}
                        </div>
                        <div className="flex-1 rounded-xl border p-3">
                          <div className="flex items-center justify-between gap-3">
                            <b className="text-sm">{title}</b>
                            <span className="text-xs text-muted-foreground">{date}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {state === "complete"
                              ? "Completed on time"
                              : state === "current"
                                ? "Active workstream"
                                : "Next planned checkpoint"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border bg-muted/[.25] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Budget health</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        ${(active.spent / 1e3).toFixed(0)}K of ${(active.budget / 1e3).toFixed(0)}K
                        allocated
                      </p>
                    </div>
                    <Icons.WalletCards className="size-5 text-primary" />
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        active.spent / active.budget > 0.85 ? "bg-warning" : "bg-success",
                      )}
                      style={{ width: `${Math.min(100, (active.spent / active.budget) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>Spent {Math.round((active.spent / active.budget) * 100)}%</span>
                    <span>${((active.budget - active.spent) / 1e3).toFixed(0)}K remaining</span>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-3 border-t pt-5">
                  <Button variant="outline" onClick={() => toast.success("Project editor opened")}>
                    <Icons.Pencil className="size-4" />
                    Edit project
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("New task created")}>
                    <Icons.Plus className="size-4" />
                    Add task
                  </Button>
                  <Button variant="outline" onClick={() => toast.success("Project update shared")}>
                    <Icons.MessageSquarePlus className="size-4" />
                    Post update
                  </Button>
                  <Button onClick={() => toast.success("Project status updated")}>
                    <Icons.RefreshCw className="size-4" />
                    Update status
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>{" "}
    </>
  );
}
