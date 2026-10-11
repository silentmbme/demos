import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "sonner";
import { getUserImage } from "@/lib/user-images";
import { cn } from "@/lib/utils";
import { Badge, Card, PageHeader } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Member = {
  name: string;
  role: string;
  department: string;
  utilization: number;
  availability: string;
  tasks: number;
  projects: string[];
  skills: string[];
  email: string;
};

const members: Member[] = [
  {
    name: "Sophia Carter",
    role: "Project Manager",
    department: "Product",
    utilization: 82,
    availability: "Partially available",
    tasks: 12,
    projects: ["Website Redesign", "CRM Migration"],
    skills: ["Planning", "Client management", "Agile"],
    email: "sophia@nexui.app",
  },
  {
    name: "Daniel Lee",
    role: "Frontend Developer",
    department: "Engineering",
    utilization: 94,
    availability: "Fully allocated",
    tasks: 18,
    projects: ["Website Redesign", "Mobile App v2"],
    skills: ["React", "API", "Performance"],
    email: "daniel@nexui.app",
  },
  {
    name: "Emma Wilson",
    role: "Product Designer",
    department: "Design",
    utilization: 68,
    availability: "Available",
    tasks: 9,
    projects: ["Website Redesign", "Marketing Automation"],
    skills: ["UI/UX", "Figma", "Design systems"],
    email: "emma@nexui.app",
  },
  {
    name: "Noah Williams",
    role: "QA Engineer",
    department: "Quality",
    utilization: 106,
    availability: "Overloaded",
    tasks: 14,
    projects: ["Website Redesign", "CRM Migration"],
    skills: ["QA", "Automation", "Testing"],
    email: "noah@nexui.app",
  },
  {
    name: "Olivia Smith",
    role: "Business Analyst",
    department: "Product",
    utilization: 72,
    availability: "Available",
    tasks: 8,
    projects: ["CRM Migration", "Marketing Automation"],
    skills: ["Analytics", "Agile", "Research"],
    email: "olivia@nexui.app",
  },
];

const availabilityTone: Record<string, string> = {
  Available: "success",
  "Partially available": "warning",
  "Fully allocated": "info",
  Overloaded: "danger",
};

export function ProjectTeamApp() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [availability, setAvailability] = useState("All");
  const [active, setActive] = useState<Member | null>(null);

  const rows = useMemo(
    () =>
      members.filter(
        (member) =>
          `${member.name} ${member.role} ${member.department} ${member.skills.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (availability === "All" || member.availability === availability),
      ),
    [query, availability],
  );

  return (
    <>
      <PageHeader
        title="Project team"
        subtitle="Balance delivery capacity, roles, workload and project coverage across your team."
        breadcrumb={["Projects", "Team"]}
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("Invitation composer opened")}>
              <Icons.MailPlus className="size-4" />
              Invite member
            </Button>
            <Button onClick={() => toast.success("Member creation form opened")}>
              <Icons.UserPlus className="size-4" />
              Add member
            </Button>
          </>
        }
      />

      <section className="mb-5 overflow-hidden rounded-2xl border bg-card">
        <div className="grid grid-cols-2 divide-x rtl:divide-x-reverse divide-y md:grid-cols-3 xl:grid-cols-6 xl:divide-y-0">
          {[
            ["Team members", "42", Icons.Users, "text-primary bg-primary/10"],
            ["Available now", "18", Icons.CircleCheck, "text-success bg-success/10"],
            ["Fully allocated", "17", Icons.BriefcaseBusiness, "text-info bg-info/10"],
            ["Need attention", "4", Icons.TriangleAlert, "text-destructive bg-destructive/10"],
            ["On leave", "3", Icons.CalendarOff, "text-warning bg-warning/10"],
            ["Average utilization", "74%", Icons.ChartNoAxesCombined, "text-primary bg-primary/10"],
          ].map(([label, value, Icon, className]) => (
            <div key={String(label)} className="p-4">
              <span className={cn("grid size-9 place-items-center rounded-xl", String(className))}>
                <Icon className="size-4" />
              </span>
              <p className="mt-4 text-xs text-muted-foreground">{label}</p>
              <b className="mt-1 block text-xl tracking-tight">{value}</b>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[230px] flex-1">
          <Icons.Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search members, roles or skills"
            className="h-10 w-full rounded-xl border bg-white ps-9 pe-3 text-sm outline-none ring-primary transition focus:ring-2"
          />
        </label>
        <select
          value={availability}
          onChange={(event) => setAvailability(event.target.value)}
          className="h-10 rounded-xl border bg-white px-3 text-sm"
        >
          <option>All</option>
          <option>Available</option>
          <option>Partially available</option>
          <option>Fully allocated</option>
          <option>Overloaded</option>
        </select>
        <div className="flex rounded-xl border bg-card p-1">
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => setView("grid")}
            className={cn(
              "grid size-8 place-items-center rounded-lg",
              view === "grid" && "bg-primary text-primary-foreground",
            )}
          >
            <Icons.LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => setView("list")}
            className={cn(
              "grid size-8 place-items-center rounded-lg",
              view === "list" && "bg-primary text-primary-foreground",
            )}
          >
            <Icons.List className="size-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((member) => (
            <Card key={member.name} bodyClassName="p-5">
              <button type="button" className="w-full text-start" onClick={() => setActive(member)}>
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={getUserImage(member.name)}
                      alt={member.name}
                      className="size-12 rounded-xl object-cover"
                    />
                    <span
                      className={cn(
                        "absolute -bottom-1 -end-1 size-3 rounded-full border-2 border-card",
                        member.availability === "Overloaded"
                          ? "bg-destructive"
                          : member.availability === "Available"
                            ? "bg-success"
                            : "bg-warning",
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-base">{member.name}</b>
                    <span className="mt-1 block truncate text-sm text-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                  <Icons.MoreHorizontal className="size-5 text-muted-foreground" />
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <Badge tone={availabilityTone[member.availability]}>{member.availability}</Badge>
                  <span className="text-xs text-muted-foreground">{member.department}</span>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weekly utilization</span>
                    <b>{member.utilization}%</b>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        member.utilization > 100
                          ? "bg-destructive"
                          : member.utilization > 85
                            ? "bg-warning"
                            : "bg-primary",
                      )}
                      style={{ width: `${Math.min(member.utilization, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <span className="text-sm">
                    <b>{member.tasks}</b>{" "}
                    <span className="text-muted-foreground">active tasks</span>
                  </span>
                  <span className="flex -space-x-2 rtl:space-x-reverse">
                    {member.projects.map((project, index) => (
                      <span
                        key={project}
                        className="grid size-7 place-items-center rounded-full border-2 border-card bg-primary/10 text-[9px] font-bold text-primary"
                      >
                        {index + 1}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <Card bodyClassName="overflow-x-auto p-0">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="border-b bg-muted/30 text-start text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Workload</th>
                <th className="px-4 py-3 font-medium">Availability</th>
                <th className="px-4 py-3 font-medium">Projects</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((member) => (
                <tr key={member.name} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getUserImage(member.name)}
                        alt=""
                        className="size-9 rounded-lg object-cover"
                      />
                      <div>
                        <b className="block">{member.name}</b>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{member.department}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            member.utilization > 100 ? "bg-destructive" : "bg-primary",
                          )}
                          style={{ width: `${Math.min(member.utilization, 100)}%` }}
                        />
                      </div>
                      <b>{member.utilization}%</b>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={availabilityTone[member.availability]}>
                      {member.availability}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">{member.projects.length}</td>
                  <td className="px-5 py-4 text-end">
                    <Button size="sm" variant="outline" onClick={() => setActive(member)}>
                      View profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Sheet open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl">
          {active && (
            <>
              <div className="relative overflow-hidden border-b bg-gradient-to-br from-primary/[.16] via-card to-info/[.12] p-6 pt-8">
                <div className="absolute -end-12 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={getUserImage(active.name)}
                        alt={active.name}
                        className="size-16 rounded-2xl object-cover shadow-sm"
                      />
                      <span
                        className={cn(
                          "absolute -bottom-1 -end-1 size-4 rounded-full border-2 border-card",
                          active.availability === "Overloaded"
                            ? "bg-destructive"
                            : active.availability === "Available"
                              ? "bg-success"
                              : "bg-warning",
                        )}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{active.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {active.role} - {active.department}
                      </p>
                      <div className="mt-3">
                        <Badge tone={availabilityTone[active.availability]}>
                          {active.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 p-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border bg-muted/[.3] p-3">
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <b className="mt-1 block text-lg">{active.utilization}%</b>
                  </div>
                  <div className="rounded-xl border bg-muted/[.3] p-3">
                    <p className="text-xs text-muted-foreground">Active tasks</p>
                    <b className="mt-1 block text-lg">{active.tasks}</b>
                  </div>
                  <div className="rounded-xl border bg-muted/[.3] p-3">
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <b className="mt-1 block text-lg">{active.projects.length}</b>
                  </div>
                </div>
                <section className="rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Capacity this week</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Workload based on committed delivery work.
                      </p>
                    </div>
                    <Icons.ChartNoAxesCombined className="size-5 text-primary" />
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        active.utilization > 100
                          ? "bg-destructive"
                          : active.utilization > 85
                            ? "bg-warning"
                            : "bg-success",
                      )}
                      style={{ width: `${Math.min(active.utilization, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {active.utilization > 100
                        ? "Over capacity - rebalance tasks"
                        : "Capacity is being monitored"}
                    </span>
                    <span>{Math.max(0, 100 - active.utilization)}% available</span>
                  </div>
                </section>
                <section>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Assigned projects</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Current delivery ownership
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.success("Project assignments opened")}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {active.projects.map((project, index) => (
                      <div key={project} className="flex items-center gap-3 rounded-xl border p-3">
                        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <b className="block text-sm">{project}</b>
                          <span className="text-xs text-muted-foreground">
                            Active project allocation
                          </span>
                        </div>
                        <Icons.ChevronRight className="size-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="font-semibold">Skills</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Areas of expertise used on current projects
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {active.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </section>
                <div className="grid grid-cols-2 gap-3 border-t pt-5">
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Message composer opened")}
                  >
                    <Icons.MessageSquare className="size-4" />
                    Message
                  </Button>
                  <Button onClick={() => toast.success("Member editor opened")}>
                    <Icons.Pencil className="size-4" />
                    Manage member
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
