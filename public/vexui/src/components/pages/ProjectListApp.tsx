import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { getUserImage } from "@/lib/user-images";
import { cn } from "@/lib/utils";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Project = {
  id: string;
  name: string;
  client: string;
  owner: string;
  progress: number;
  spent: number;
  budget: number;
  due: string;
  risk: string;
  status: string;
  priority: string;
  tags: string[];
  team: string[];
};

const data: Project[] = [
  {
    id: "PRJ-1048",
    name: "Website Redesign",
    client: "Nexora",
    owner: "Sophia Carter",
    progress: 82,
    spent: 68000,
    budget: 80000,
    due: "Sep 10",
    risk: "Healthy",
    status: "Active",
    priority: "High",
    tags: ["Design", "Frontend"],
    team: ["SC", "DL", "EM", "NW"],
  },
  {
    id: "PRJ-1052",
    name: "Mobile App v2",
    client: "CloudAxis",
    owner: "Daniel Lee",
    progress: 64,
    spent: 92000,
    budget: 140000,
    due: "Sep 22",
    risk: "Watch",
    status: "Active",
    priority: "Critical",
    tags: ["Mobile", "Client Work"],
    team: ["DL", "SC", "EW"],
  },
  {
    id: "PRJ-1061",
    name: "CRM Migration",
    client: "Vertex Labs",
    owner: "Olivia Smith",
    progress: 46,
    spent: 54000,
    budget: 110000,
    due: "Oct 02",
    risk: "At Risk",
    status: "Active",
    priority: "High",
    tags: ["Migration", "Strategic"],
    team: ["OS", "DL", "EM"],
  },
  {
    id: "PRJ-1068",
    name: "Marketing Automation",
    client: "BrightWorks",
    owner: "Emma Wilson",
    progress: 71,
    spent: 70000,
    budget: 80000,
    due: "Sep 18",
    risk: "Healthy",
    status: "Active",
    priority: "Medium",
    tags: ["Automation"],
    team: ["EW", "SC", "OS"],
  },
];

const tones: any = {
  Healthy: "success",
  Watch: "warning",
  "At Risk": "danger",
  Critical: "danger",
  Active: "info",
  Planning: "primary",
  Completed: "success",
  Delayed: "danger",
  "On Hold": "warning",
  Archived: "muted",
};

export function ProjectListApp() {
  const [p, setP] = useState(data);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [priority, setPriority] = useState("All priorities");
  const [client, setClient] = useState("All clients");
  const [owner, setOwner] = useState("All owners");
  const [risk, setRisk] = useState("All risks");
  const [active, setActive] = useState<Project | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      p.filter(
        (x) =>
          (!q ||
            [x.name, x.id, x.client, x.owner, ...x.tags]
              .join(" ")
              .toLowerCase()
              .includes(q.toLowerCase())) &&
          (status === "All statuses" || x.status === status) &&
          (priority === "All priorities" || x.priority === priority) &&
          (client === "All clients" || x.client === client) &&
          (owner === "All owners" || x.owner === owner) &&
          (risk === "All risks" || x.risk === risk),
      ),
    [p, q, status, priority, client, owner, risk],
  );

  const exp = () => {
    const a = document.createElement("a");

    a.href = URL.createObjectURL(
      new Blob(
        [
          [
            "Project,Client,Owner,Progress,Budget",
            ...rows.map((x) => [x.name, x.client, x.owner, x.progress, x.budget].join(",")),
          ].join("\n"),
        ],
        { type: "text/csv" },
      ),
    );

    a.download = "projects.csv";
    a.click();

    toast.success("Projects export downloaded");
  };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Manage project progress, teams, budgets, deadlines and delivery health."
        breadcrumb={["Vexui", "Projects"]}
        actions={
          <>
            <Button variant="outline" onClick={exp}>
              <Icons.Download />
              Export
            </Button>

            <Button onClick={() => toast.success("Add Project form is ready")}>
              <Icons.Plus />
              Add Project
            </Button>
          </>
        }
      />

      <Card className="mb-4" bodyClassName="p-0">
        <div className="flex flex-wrap divide-y sm:divide-x rtl:divide-x-reverse sm:divide-y-0">
          {[
            ["Total Projects", "148"],
            ["Active", "84"],
            ["On Track", "62"],
            ["At Risk", "12"],
            ["Delayed", "10"],
            ["Completed", "42"],
            ["Total Budget", "$2.84M"],
          ].map((x) => (
            <div key={x[0]} className="min-w-[120px] flex-1 px-4 py-3">
              <small className="text-muted-foreground">{x[0]}</small>
              <b className="block text-lg">{x[1]}</b>
            </div>
          ))}
        </div>
      </Card>

      <Card bodyClassName="p-0">
        <div className="flex flex-wrap gap-2 border-b p-4">
          <label className="relative min-w-56 flex-1">
            <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search project, client or team"
              className="h-9 w-full rounded border bg-background ps-9 pe-3 text-sm"
            />
          </label>

          {[
            [
              status,
              setStatus,
              [
                "All statuses",
                "Planning",
                "Active",
                "On Hold",
                "At Risk",
                "Delayed",
                "Completed",
                "Archived",
              ],
            ],
            [priority, setPriority, ["All priorities", "Critical", "High", "Medium", "Low"]],
            [
              client,
              setClient,
              ["All clients", "Nexora", "CloudAxis", "Vertex Labs", "BrightWorks", "Acme Inc."],
            ],
            [
              owner,
              setOwner,
              ["All owners", "Sophia Carter", "Daniel Lee", "Olivia Smith", "Emma Wilson"],
            ],
            [risk, setRisk, ["All risks", "Healthy", "Watch", "At Risk", "Critical"]],
          ].map(([v, s, o], i) => (
            <select
              key={i}
              value={v as string}
              onChange={(e) => (s as any)(e.target.value)}
              className="h-9 rounded border bg-background px-2 text-sm"
            >
              {(o as string[]).map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          ))}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setQ("");
              setStatus("All statuses");
              setPriority("All priorities");
              setClient("All clients");
              setOwner("All owners");
              setRisk("All risks");
            }}
          >
            Reset
          </Button>
        </div>

        {selected.length > 0 && (
          <div className="flex gap-2 border-b bg-primary/5 px-4 py-2">
            <b>{selected.length} selected</b>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Bulk owner change applied")}
            >
              Change owner
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Bulk status change applied")}
            >
              Change status
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setP((a) => a.filter((x) => !selected.includes(x.id)));
                setSelected([]);
                toast.success("Selected projects deleted");
              }}
            >
              Delete
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-start text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={rows.length > 0 && rows.every((x) => selected.includes(x.id))}
                    onChange={(e) => setSelected(e.target.checked ? rows.map((x) => x.id) : [])}
                  />
                </th>

                {[
                  "Project",
                  "Client",
                  "Team",
                  "Owner",
                  "Progress",
                  "Budget",
                  "Due Date",
                  "Risk",
                  "Status",
                  "",
                ].map((x) => (
                  <th key={x} className="px-3 py-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((x) => (
                <tr key={x.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(x.id)}
                      onChange={() =>
                        setSelected((a) =>
                          a.includes(x.id) ? a.filter((y) => y !== x.id) : [...a, x.id],
                        )
                      }
                    />
                  </td>

                  <td className="px-3 py-4">
                    <button className="text-start" onClick={() => setActive(x)}>
                      <b className="block hover:text-primary">{x.name}</b>
                      <small className="text-muted-foreground">{x.id}</small>
                    </button>
                  </td>

                  <td className="px-3 py-4">{x.client}</td>

                  <td className="px-3 py-4">
                    <span className="flex -space-x-1 rtl:space-x-reverse">
                      {x.team.map((y) => (
                        <span
                          key={y}
                          className="grid size-6 place-items-center rounded-full border bg-primary/10 text-[8px] text-primary"
                        >
                          {y}
                        </span>
                      ))}
                    </span>
                  </td>

                  <td className="px-3 py-4">{x.owner}</td>

                  <td className="px-3 py-4">
                    <b>{x.progress}%</b>

                    <div className="mt-1 h-1.5 w-20 rounded bg-muted">
                      <div
                        className="h-full rounded bg-primary"
                        style={{ width: `${x.progress}%` }}
                      />
                    </div>
                  </td>

                  <td className="px-3 py-4">
                    ${(x.spent / 1e3).toFixed(0)}K / ${(x.budget / 1e3).toFixed(0)}K
                  </td>

                  <td className="px-3 py-4">{x.due}</td>

                  <td className="px-3 py-4">
                    <Badge tone={tones[x.risk]}>{x.risk}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <Badge tone={tones[x.status]}>{x.status}</Badge>
                  </td>

                  <td className="px-3 py-4">
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActive(x);
                      }}
                      aria-label={`View ${x.name} project details`}
                    >
                      View details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl">
          {active && (
            <>
              <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/[0.16] via-card to-info/[0.12] px-6 pb-6 pt-8">
                <div className="absolute -end-9 -top-10 size-40 rounded-full bg-primary/10 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={tones[active.status]}>{active.status}</Badge>
                      <Badge tone={tones[active.risk]}>{active.risk}</Badge>
                      <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-semibold text-foreground">
                        {active.priority} priority
                      </span>
                    </div>
                    <h2 className="mt-4 truncate text-2xl font-semibold">{active.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {active.id} - {active.client}
                    </p>
                  </div>
                </div>
                <div className="relative mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">Project progress</span>
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
                  <div className="rounded-xl border bg-muted/[0.35] p-3">
                    <p className="text-xs text-muted-foreground">Budget used</p>
                    <b className="mt-1 block text-base">
                      {Math.round((active.spent / active.budget) * 100)}%
                    </b>
                    <p className="mt-1 text-xs text-muted-foreground">
                      ${(active.spent / 1e3).toFixed(0)}K spent
                    </p>
                  </div>
                  <div className="rounded-xl border bg-muted/[0.35] p-3">
                    <p className="text-xs text-muted-foreground">Due date</p>
                    <b className="mt-1 block text-base">{active.due}</b>
                    <p className="mt-1 text-xs text-muted-foreground">On schedule</p>
                  </div>
                  <div className="rounded-xl border bg-muted/[0.35] p-3">
                    <p className="text-xs text-muted-foreground">Open tasks</p>
                    <b className="mt-1 block text-base">
                      {Math.max(3, 12 - Math.floor(active.progress / 10))}
                    </b>
                    <p className="mt-1 text-xs text-muted-foreground">2 high priority</p>
                  </div>
                </div>

                <section>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Project team</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Owner and active contributors
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-primary hover:underline"
                      onClick={() => toast.success("Team management opened")}
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
                        aria-label="Add contributor"
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
                      <h3 className="font-semibold">Milestone timeline</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Next delivery points for this project
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-sm font-semibold text-primary hover:underline"
                      onClick={() => toast.success("Milestone editor opened")}
                    >
                      View plan
                    </button>
                  </div>
                  <div className="mt-4 space-y-0">
                    {[
                      ["Client approval", "Aug 28", "complete"],
                      ["Development freeze", "Sep 05", "current"],
                      ["Launch readiness review", active.due, "upcoming"],
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
                                ? "In progress - owners notified"
                                : "Planned delivery checkpoint"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-xl border bg-muted/[0.25] p-4">
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
      </Sheet>
    </>
  );
}
