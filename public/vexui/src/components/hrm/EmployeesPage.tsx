import { useState } from "react";
import {
  Users,
  UserCheck,
  CalendarDays,
  Briefcase,
  Search,
  Plus,
  Download,
  LayoutGrid,
  List,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  Pencil,
  Building2,
  Laptop,
  RotateCcw,
} from "lucide-react";
import { Card, PageHeader, Badge } from "@/components/dashboard/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { userImages } from "@/lib/user-images";

type BaseEmployee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: "Active" | "On leave";
  photo: string;
  joined: string;
};
type Employee = BaseEmployee & {
  location: string;
  mode: "Office" | "Hybrid" | "Remote";
  phone: string;
  managerId: string;
};
const departments = ["Design", "Engineering", "People", "Sales"];
const tones = {
  Design: "bg-primary/10 text-primary",
  Engineering: "bg-info/10 text-info",
  People: "bg-success/10 text-success",
  Sales: "bg-warning/10 text-warning",
};
const bars = {
  Design: "bg-primary",
  Engineering: "bg-info",
  People: "bg-success",
  Sales: "bg-warning",
};
const modes = ["Office", "Hybrid", "Remote"] as const;
export function EmployeesPage({ initial }: { initial: BaseEmployee[] }) {
  const [employees, setEmployees] = useState<Employee[]>(() =>
    initial.map((e, i) => ({
      ...e,
      location: i % 3 === 0 ? "New York" : i % 3 === 1 ? "London" : "Austin",
      mode: modes[i % 3],
      phone: `+1 202-555-01${String(i).padStart(2, "0")}`,
      managerId: i < 4 ? initial[i + 4].id : "",
    })),
  );
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [mode, setMode] = useState("All");
  const [sort, setSort] = useState("name");
  const [view, setView] = useState("grid");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Employee | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const active = employees.find((e) => e.id === profileId);
  const manager = (e: Employee) =>
    employees.find((p) => p.id === e.managerId)?.name ?? "Unassigned";
  const visible = employees
    .filter(
      (e) =>
        `${e.name} ${e.role} ${e.email} ${e.id} ${e.location}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (department === "All" || e.department === department) &&
        (status === "All" || e.status === status) &&
        (mode === "All" || e.mode === mode),
    )
    .sort((a, b) =>
      sort === "newest"
        ? b.joined.localeCompare(a.joined) || a.name.localeCompare(b.name)
        : sort === "department"
          ? a.department.localeCompare(b.department) || a.name.localeCompare(b.name)
          : a.name.localeCompare(b.name),
    );
  const add = () => {
    setIsNew(true);
    setError("");
    setDraft({
      id: "",
      name: "",
      role: "",
      department: "Design",
      email: "",
      status: "Active",
      photo: userImages.user1,
      joined: "2026-10-09",
      location: "",
      mode: "Office",
      phone: "",
      managerId: "",
    });
  };
  const edit = (e: Employee) => {
    setIsNew(false);
    setDraft({ ...e });
    setError("");
  };
  const reset = () => {
    setQuery("");
    setDepartment("All");
    setStatus("All");
    setMode("All");
  };
  const exportDirectory = () => {
    const rows = [
      [
        "ID",
        "Name",
        "Role",
        "Department",
        "Email",
        "Phone",
        "Location",
        "Work arrangement",
        "Manager",
        "Joined",
        "Status",
      ],
      ...visible.map((e) => [
        e.id,
        e.name,
        e.role,
        e.department,
        e.email,
        e.phone,
        e.location,
        e.mode,
        manager(e),
        e.joined,
        e.status,
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        [rows.map((r) => r.map((v) => '"' + v.replaceAll('"', '""') + '"').join(",")).join("\r\n")],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee-directory.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} employees in the current view.`);
  };
  const avatar = (e: Employee) => (
    <div className="flex items-center gap-3">
      <img src={e.photo} alt={e.name} className="size-10 shrink-0 rounded-full object-cover" />
      <div>
        <p className="font-semibold">{e.name}</p>
        <p className="text-xs text-muted-foreground">
          {e.id} / {e.role}
        </p>
      </div>
    </div>
  );
  return (
    <>
      <PageHeader
        title="Employees"
        subtitle="A complete view of your people, teams, and work arrangements."
        breadcrumb={["Management", "HRM", "Employees"]}
        actions={
          <>
            <Button variant="outline" onClick={exportDirectory}>
              <Download className="size-4" />
              Export directory
            </Button>
            <Button onClick={add}>
              <Plus className="size-4" />
              Add employee
            </Button>
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total employees",
            value: employees.length,
            caption: "Sample directory headcount",
            Icon: Users,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Active employees",
            value: employees.filter((e) => e.status === "Active").length,
            caption: "Active in the sample workspace",
            Icon: UserCheck,
            tone: "bg-success/10 text-success",
          },
          {
            label: "On leave",
            value: employees.filter((e) => e.status === "On leave").length,
            caption: "Current sample availability",
            Icon: CalendarDays,
            tone: "bg-warning/10 text-warning",
          },
          {
            label: "Departments",
            value: new Set(employees.map((e) => e.department)).size,
            caption: "Teams represented in the directory",
            Icon: Briefcase,
            tone: "bg-info/10 text-info",
          },
        ].map((s) => (
          <Card key={s.label} bodyClassName="p-5">
            <div className="flex items-center gap-3">
              <span className={`grid size-11 place-items-center rounded-2xl ${s.tone}`}>
                <s.Icon className="size-5" />
              </span>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
            <p className="mt-4 text-3xl font-semibold">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.caption}</p>
          </Card>
        ))}
      </div>
      <div className="mb-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card
          title="People by department"
          description="Select a team to focus the directory"
          bodyClassName="p-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {departments.map((d) => {
              const count = employees.filter((e) => e.department === d).length;
              return (
                <button
                  key={d}
                  aria-label={`Team ${d}`}
                  aria-pressed={department === d}
                  onClick={() => setDepartment(department === d ? "All" : d)}
                  className={`rounded-xl border p-4 text-start ${department === d ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{d}</span>
                    <span className="text-xs text-muted-foreground">{count} people</span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${bars[d as keyof typeof bars]}`}
                      style={{
                        width: `${employees.length ? (count / employees.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {employees.length ? Math.round((count / employees.length) * 100) : 0}% of sample
                    headcount
                  </p>
                </button>
              );
            })}
          </div>
        </Card>
        <Card
          title="Work arrangements"
          description="Choose an arrangement to filter"
          bodyClassName="p-5"
        >
          <div className="space-y-4">
            {modes.map((m) => {
              const Icon = m === "Office" ? Building2 : Laptop;
              return (
                <button
                  key={m}
                  aria-pressed={mode === m}
                  onClick={() => setMode(mode === m ? "All" : m)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 ${mode === m ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}
                >
                  <span className="flex items-center gap-3 text-sm">
                    <Icon className="size-4 text-muted-foreground" />
                    {m}
                  </span>
                  <span className="text-lg font-semibold">
                    {employees.filter((e) => e.mode === m).length}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Employee directory</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {visible.length} of {employees.length} people / sample data, session-only edits
          </p>
        </div>
        <div className="flex rounded-lg border border-border bg-card p-1">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            aria-label="Employee grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            aria-label="Employee list view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <List className="size-4" />
          </Button>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 sm:min-w-52">
          <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Search HR records"
            placeholder="Search name, role, email, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ps-9"
          />
        </div>
        {[
          {
            label: "HR department",
            value: department,
            set: setDepartment,
            options: ["All", ...departments],
          },
          {
            label: "HR status",
            value: status,
            set: setStatus,
            options: ["All", "Active", "On leave"],
          },
          {
            label: "Employee work arrangement",
            value: mode,
            set: setMode,
            options: ["All", ...modes],
          },
        ].map((f) => (
          <select
            key={f.label}
            aria-label={f.label}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
          >
            {f.options.map((v) => (
              <option key={v} value={v}>
                {v === "All"
                  ? f.label === "HR department"
                    ? "All departments"
                    : f.label === "HR status"
                      ? "All statuses"
                      : "All arrangements"
                  : v}
              </option>
            ))}
          </select>
        ))}
        <select
          aria-label="Sort employees"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
        >
          <option value="name">Name A-Z</option>
          <option value="newest">Newest join date</option>
          <option value="department">Department</option>
        </select>
      </div>
      {visible.length > 0 ? (
        view === "grid" ? (
          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {visible.map((e) => (
              <Card key={e.id} bodyClassName="p-0">
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <Badge tone={e.status === "Active" ? "success" : "warning"}>{e.status}</Badge>
                  <button
                    aria-label={`Edit ${e.id}`}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                    onClick={() => edit(e)}
                  >
                    <Pencil className="size-4" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={e.photo}
                      alt={e.name}
                      className="size-14 shrink-0 rounded-2xl object-cover ring-2 ring-background"
                    />
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold">{e.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{e.role}</p>
                    </div>
                  </div>
                  <div
                    className={`mt-5 inline-flex rounded-lg px-2 py-1 text-[11px] font-semibold ${tones[e.department as keyof typeof tones]}`}
                  >
                    {e.department}
                  </div>
                  <div className="mt-4 space-y-3 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0" />
                      {e.location} / {e.mode}
                    </p>
                    <p className="flex items-center gap-2 break-all">
                      <Mail className="size-4 shrink-0" />
                      {e.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-4 shrink-0" />
                      Joined {e.joined}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-[10px] text-muted-foreground">{e.id}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Employee ${e.id}`}
                      onClick={() => setProfileId(e.id)}
                    >
                      View profile
                      <ArrowUpRight className="size-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card bodyClassName="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "Employee",
                    "Department",
                    "Work arrangement",
                    "Joined",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{avatar(e)}</TableCell>
                    <TableCell>{e.department}</TableCell>
                    <TableCell>
                      <p>{e.mode}</p>
                      <p className="text-xs text-muted-foreground">{e.location}</p>
                    </TableCell>
                    <TableCell>{e.joined}</TableCell>
                    <TableCell>
                      <Badge tone={e.status === "Active" ? "success" : "warning"}>{e.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          aria-label={`Employee ${e.id}`}
                          onClick={() => setProfileId(e.id)}
                        >
                          View profile
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label={`Edit ${e.id}`}
                          onClick={() => edit(e)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )
      ) : (
        <Card bodyClassName="p-10 text-center">
          <Users className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">No matching employees</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another search or clear your filters.
          </p>
          <Button variant="outline" className="mt-4" onClick={reset}>
            <RotateCcw className="size-4" />
            Reset filters
          </Button>
        </Card>
      )}
      <Dialog
        open={!!active}
        onOpenChange={(open) => {
          if (!open) setProfileId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Employee profile</DialogTitle>
            <DialogDescription>{active?.id} / Sample directory record</DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <div className="flex items-center gap-4 rounded-2xl bg-primary/5 p-5">
                <img
                  src={active.photo}
                  alt={active.name}
                  className="size-20 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{active.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{active.role}</p>
                  <div className="mt-3">
                    <Badge tone={active.status === "Active" ? "success" : "warning"}>
                      {active.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-5 p-1">
                {[
                  ["Department", active.department],
                  ["Manager", manager(active)],
                  ["Location", active.location],
                  ["Work arrangement", active.mode],
                  ["Email", active.email],
                  ["Phone", active.phone || "Not provided"],
                  ["Joined", active.joined],
                  ["Employment status", active.status],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3 border-t border-border pt-4">
                <Button
                  onClick={() => {
                    setProfileId(null);
                    edit(active);
                  }}
                >
                  <Pencil className="size-4" />
                  Edit employee
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const next = active.status === "Active" ? "On leave" : "Active";
                    setEmployees((prev) =>
                      prev.map((e) => (e.id === active.id ? { ...e, status: next } : e)),
                    );
                    setNotice(`${active.id} marked ${next.toLowerCase()} in the sample directory.`);
                  }}
                >
                  {active.status === "Active" ? "Mark on leave" : "Mark active"}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Profile changes are local to this page session. No employee notifications are sent.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!draft}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add employee" : "Edit employee"}</DialogTitle>
            <DialogDescription>
              {isNew
                ? "Create a sample employee profile."
                : `${draft?.id} / Update this local directory record.`}{" "}
              Changes last for this page session.
            </DialogDescription>
          </DialogHeader>
          {draft && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.name.trim() || !draft.role.trim() || !draft.location.trim()) {
                  setError("Enter the employee name, role, and location.");
                  return;
                }
                if (
                  employees.some(
                    (p) =>
                      p.id !== draft.id &&
                      p.email.toLowerCase() === draft.email.trim().toLowerCase(),
                  )
                ) {
                  setError("An employee with this email already exists.");
                  return;
                }
                if (draft.managerId && draft.managerId === draft.id) {
                  setError("An employee cannot be their own manager.");
                  return;
                }
                const id = isNew
                  ? `EMP-${Math.max(...employees.map((e) => Number(e.id.split("-")[1]))) + 1}`
                  : draft.id;
                const record = {
                  ...draft,
                  id,
                  name: draft.name.trim(),
                  role: draft.role.trim(),
                  email: draft.email.trim(),
                  location: draft.location.trim(),
                  phone: draft.phone.trim(),
                };
                setEmployees((prev) =>
                  isNew ? [...prev, record] : prev.map((e) => (e.id === id ? record : e)),
                );
                setNotice(`${id} ${isNew ? "added" : "updated"} in the sample directory.`);
                setDraft(null);
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Employee name", key: "name", type: "text", required: true },
                  { label: "Job role", key: "role", type: "text", required: true },
                  { label: "Email", key: "email", type: "email", required: true },
                  { label: "Phone", key: "phone", type: "tel", required: false },
                  { label: "Location", key: "location", type: "text", required: true },
                  { label: "Join date", key: "joined", type: "date", required: true },
                ].map((field) => (
                  <label key={field.key} className="block text-sm font-medium">
                    {field.label}
                    <Input
                      aria-label={field.label}
                      type={field.type}
                      required={field.required}
                      maxLength={120}
                      className="mt-2"
                      value={
                        draft[
                          field.key as "name" | "role" | "email" | "phone" | "location" | "joined"
                        ]
                      }
                      onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                    />
                  </label>
                ))}
                {[
                  { label: "Employee department", key: "department", options: departments },
                  { label: "Work arrangement", key: "mode", options: [...modes] },
                  { label: "Employment status", key: "status", options: ["Active", "On leave"] },
                ].map((field) => (
                  <label key={field.key} className="block text-sm font-medium">
                    {field.label}
                    <select
                      aria-label={field.label}
                      className="mt-2 w-full rounded-lg border border-border bg-card p-2.5 text-sm"
                      value={draft[field.key as "department" | "mode" | "status"]}
                      onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}
                    >
                      {field.options.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                ))}
                <label className="block text-sm font-medium">
                  Manager
                  <select
                    aria-label="Employee manager"
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2.5 text-sm"
                    value={draft.managerId}
                    onChange={(e) => setDraft({ ...draft, managerId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {employees
                      .filter((e) => e.id !== draft.id)
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium">
                Profile photo
                <select
                  aria-label="Employee photo"
                  className="mt-2 w-full rounded-lg border border-border bg-card p-2.5 text-sm"
                  value={draft.photo}
                  onChange={(e) => setDraft({ ...draft, photo: e.target.value })}
                >
                  {Object.values(userImages).map((src, i) => (
                    <option key={src} value={src}>
                      Sample user photo {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              {error && (
                <p
                  role="alert"
                  className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save employee</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
