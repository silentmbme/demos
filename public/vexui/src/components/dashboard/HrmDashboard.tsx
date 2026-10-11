import { useState, type FormEvent } from "react";
import {
  UsersRound,
  Clock3,
  CalendarDays,
  Wallet,
  Plus,
  Download,
  BriefcaseBusiness,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { getUserImage } from "@/lib/user-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge, Card, PageHeader } from "./widgets";

const departments = ["Engineering", "Design", "Marketing", "Operations"];
const initialEmployees = [
  {
    id: "EMP-101",
    name: "Sophia Carter",
    role: "Product designer",
    department: "Design",
    status: "Present",
    salary: 6200,
    image: "user-1",
  },
  {
    id: "EMP-102",
    name: "Daniel Lee",
    role: "Frontend engineer",
    department: "Engineering",
    status: "Present",
    salary: 7800,
    image: "user-2",
  },
  {
    id: "EMP-103",
    name: "Olivia Smith",
    role: "Marketing lead",
    department: "Marketing",
    status: "Remote",
    salary: 6800,
    image: "user-3",
  },
  {
    id: "EMP-104",
    name: "James Wilson",
    role: "Operations manager",
    department: "Operations",
    status: "On leave",
    salary: 7100,
    image: "user-4",
  },
  {
    id: "EMP-105",
    name: "Maya Patel",
    role: "Backend engineer",
    department: "Engineering",
    status: "Present",
    salary: 8200,
    image: "user-5",
  },
  {
    id: "EMP-106",
    name: "Noah Williams",
    role: "Brand designer",
    department: "Design",
    status: "Remote",
    salary: 5900,
    image: "user-6",
  },
];
const initialLeave = [
  {
    id: 1,
    name: "Daniel Lee",
    department: "Engineering",
    type: "Annual leave",
    dates: "Oct 12–13, 2026",
    days: 2,
    status: "Pending",
  },
  {
    id: 2,
    name: "Sophia Carter",
    department: "Design",
    type: "Personal leave",
    dates: "Oct 16, 2026",
    days: 1,
    status: "Pending",
  },
  {
    id: 3,
    name: "Olivia Smith",
    department: "Marketing",
    type: "Annual leave",
    dates: "Oct 19–21, 2026",
    days: 3,
    status: "Pending",
  },
];
const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export function HrmDashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [requests, setRequests] = useState(initialLeave);
  const [department, setDepartment] = useState("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");
  const [salary, setSalary] = useState("5000");
  const [error, setError] = useState("");
  const { base } = useChartTheme();
  const selected = employees.filter((e) => department === "all" || e.department === department);
  const visible = selected.filter((e) =>
    `${e.name} ${e.role}`.toLowerCase().includes(query.toLowerCase()),
  );
  const leave = requests.filter((r) => department === "all" || r.department === department);
  const present = selected.filter((e) => e.status !== "On leave").length;
  const payroll = selected.reduce((sum, e) => sum + e.salary, 0);
  const chartDepartments = departments.filter((d) => department === "all" || d === department);
  const attendanceOptions = mergeOptions(base, {
    chart: { stacked: true },
    colors: [token("--primary"), token("--chart-2"), token("--chart-4")],
    stroke: { width: 2, colors: [token("--card")] },
    plotOptions: { bar: { columnWidth: "42%", borderRadius: 5 } },
    xaxis: { categories: chartDepartments, labels: { rotate: 0, style: { fontSize: "10px" } } },
    yaxis: {
      min: 0,
      tickAmount: Math.max(selected.length, 1),
      labels: { formatter: (value: number) => Math.round(value).toString() },
    },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (value: number) => value + " employees" },
    },
  });
  const departmentOptions = mergeOptions(base, {
    colors: [token("--primary"), token("--chart-2")],
    stroke: { width: [0, 3], curve: "smooth" },
    markers: { size: [0, 5], strokeWidth: 2 },
    plotOptions: { bar: { columnWidth: "32%", borderRadius: 5 } },
    fill: { opacity: [0.85, 1] },
    xaxis: { categories: chartDepartments, labels: { rotate: 0, style: { fontSize: "10px" } } },
    yaxis: [
      {
        seriesName: "Base salaries",
        min: 0,
        labels: { formatter: (value: number) => "$" + (value / 1000).toFixed(0) + "k" },
      },
      {
        seriesName: "Employees",
        opposite: true,
        min: 0,
        max: Math.max(selected.length, 1),
        tickAmount: Math.max(selected.length, 1),
        labels: { formatter: (value: number) => Math.round(value).toString() },
      },
    ],
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: (value: number) => money(value) },
        { formatter: (value: number) => value + " employees" },
      ],
    },
  });
  const [onboarding, setOnboarding] = useState([
    { title: "Send welcome pack", department: "Engineering", done: true },
    { title: "Prepare workstation", department: "Engineering", done: false },
    { title: "Schedule design orientation", department: "Design", done: false },
    { title: "Assign onboarding buddy", department: "Marketing", done: true },
    { title: "Complete policy introduction", department: "Operations", done: false },
  ]);
  const onboardingTasks = onboarding.filter(
    (task) => department === "all" || task.department === department,
  );
  function addEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(salary);
    if (
      name.trim().length < 2 ||
      role.trim().length < 2 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 100000
    ) {
      setError("Enter a name, role, and monthly salary between $1 and $100,000.");
      return;
    }
    setEmployees((current) => [
      ...current,
      {
        id: `EMP-${101 + current.length}`,
        name: name.trim(),
        role: role.trim(),
        department: newDepartment,
        salary: amount,
        status: "Present",
        image: "user-1",
      },
    ]);
    setDepartment("all");
    setQuery("");
    setOpen(false);
    toast.success("Sample employee added");
  }
  function review(id: number, status: string) {
    setRequests((current) =>
      current.map((r) => (r.id === id && r.status === "Pending" ? { ...r, status } : r)),
    );
    toast.success(`Sample leave request ${status.toLowerCase()}`);
  }
  function exportEmployees() {
    const rows = [
      ["Employee ID", "Name", "Role", "Department", "Attendance", "Monthly salary (USD)"],
      ...visible.map((e) => [e.id, e.name, e.role, e.department, e.status, e.salary]),
    ];
    const csv = rows
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "hrm-employees.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title="HRM Dashboard"
        subtitle="A clear view of your people, attendance, and team operations."
        breadcrumb={["Dashboards", "HRM"]}
        actions={
          <>
            <Button variant="outline" onClick={exportEmployees}>
              <Download className="size-4" />
              Export report
            </Button>
            <Button
              onClick={() => {
                setName("");
                setRole("");
                setSalary("5000");
                setError("");
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Add employee
            </Button>
          </>
        }
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div>
          <p className="font-semibold">People first. Progress together.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sample data · October 9, 2026 · Changes stay in this page session
          </p>
        </div>
        <select
          aria-label="HRM department"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total employees",
            value: selected.length.toString(),
            note: "Active sample employee records",
            icon: UsersRound,
            color: "text-primary bg-primary/10",
          },
          {
            label: "Attendance today",
            value: `${selected.length ? Math.round((present / selected.length) * 100) : 0}%`,
            note: `${present} on site or working remotely`,
            icon: Clock3,
            color: "text-info bg-info/10",
          },
          {
            label: "Pending leave",
            value: leave.filter((r) => r.status === "Pending").length.toString(),
            note: "Requests awaiting your review",
            icon: CalendarDays,
            color: "text-warning bg-warning/10",
          },
          {
            label: "Monthly payroll",
            value: money(payroll),
            note: "Sample base salaries · USD",
            icon: Wallet,
            color: "text-success bg-success/10",
          },
        ].map((m) => (
          <section key={m.label} className="vexui-card relative overflow-hidden">
            <div className={`h-1.5 ${m.color}`} />
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className={`grid size-10 place-items-center rounded-xl ${m.color}`}>
                  <m.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                  <p className="mt-1 text-[28px] font-semibold tracking-tight tabular-nums">
                    {m.value}
                  </p>
                </div>
              </div>
              <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                {m.note}
              </p>
            </div>
          </section>
        ))}
      </div>
      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <Card
          title="Workforce attendance"
          description="On site, remote, and leave across departments"
        >
          <ApexChart
            type="bar"
            height={290}
            options={attendanceOptions}
            series={[
              { name: "On site", status: "Present" },
              { name: "Remote", status: "Remote" },
              { name: "On leave", status: "On leave" },
            ].map((item) => ({
              name: item.name,
              data: chartDepartments.map(
                (d) =>
                  selected.filter((e) => e.department === d && e.status === item.status).length,
              ),
            }))}
          />
        </Card>
        <Card
          title="Payroll & headcount"
          description="Monthly base salaries and employee counts ? USD"
        >
          <ApexChart
            type="bar"
            height={290}
            options={departmentOptions}
            series={[
              {
                name: "Base salaries",
                type: "column",
                data: chartDepartments.map((d) =>
                  selected.filter((e) => e.department === d).reduce((sum, e) => sum + e.salary, 0),
                ),
              },
              {
                name: "Employees",
                type: "line",
                data: chartDepartments.map(
                  (d) => selected.filter((e) => e.department === d).length,
                ),
              },
            ]}
          />
        </Card>
      </div>
      <Card
        title="Employee directory"
        description={`${visible.length} employees in view`}
        className="mb-6"
        action={
          <Input
            aria-label="Search employees"
            placeholder="Search name or role…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-60"
          />
        }
        bodyClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              {["Employee", "Department", "Attendance", "Monthly salary"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={getUserImage(e.name)}
                      alt=""
                      className="size-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{e.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.role} · {e.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{e.department}</TableCell>
                <TableCell>
                  <Badge
                    tone={
                      e.status === "On leave"
                        ? "warning"
                        : e.status === "Remote"
                          ? "primary"
                          : "success"
                    }
                  >
                    {e.status}
                  </Badge>
                </TableCell>
                <TableCell>{money(e.salary)}</TableCell>
              </TableRow>
            ))}
            {!visible.length && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  No employees match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Leave requests"
          description="Review upcoming time off · Approval updates the sample request only"
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <div className="space-y-4">
            {leave.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4"
              >
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.type} · {r.dates} · {r.days} days
                  </p>
                </div>
                {r.status === "Pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`Approve leave for ${r.name}`}
                      onClick={() => review(r.id, "Approved")}
                    >
                      <Check className="size-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`Decline leave for ${r.name}`}
                      onClick={() => review(r.id, "Declined")}
                    >
                      <X className="size-4" />
                      Decline
                    </Button>
                  </div>
                ) : (
                  <Badge tone={r.status === "Approved" ? "success" : "warning"}>{r.status}</Badge>
                )}
              </div>
            ))}
            {!leave.length && (
              <p className="text-sm text-muted-foreground">
                No leave requests for this department.
              </p>
            )}
          </div>
        </Card>
        <Card
          title="Payroll overview"
          description="October 2026 · Sample estimates"
          bodyClassName="p-5"
        >
          <div className="rounded-xl bg-primary/5 p-4">
            <Wallet className="mb-3 size-7 text-primary" />
            <p className="text-xs text-muted-foreground">Base salary total</p>
            <p className="mt-1 text-3xl font-semibold">{money(payroll)}</p>
          </div>
          <div className="mt-4 space-y-3">
            {departments.map((d) => (
              <div key={d} className="flex justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{d}</span>
                <span className="font-semibold">
                  {money(
                    selected
                      .filter((e) => e.department === d)
                      .reduce((sum, e) => sum + e.salary, 0),
                  )}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
            Base salaries only. Taxes, deductions, and payouts are excluded.
          </p>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Recruitment pipeline" description="Sample open positions" bodyClassName="p-5">
          <div className="space-y-4">
            {[
              { title: "Senior frontend engineer", department: "Engineering", candidates: 18 },
              { title: "Product designer", department: "Design", candidates: 12 },
              { title: "Growth marketer", department: "Marketing", candidates: 9 },
            ]
              .filter((j) => department === "all" || j.department === department)
              .map((j) => (
                <div
                  key={j.title}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BriefcaseBusiness className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{j.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {j.department} · {j.candidates} candidates
                    </p>
                  </div>
                  <Badge tone="primary" size="sm">
                    Open
                  </Badge>
                </div>
              ))}
            {department === "Operations" && (
              <p className="text-sm text-muted-foreground">No open positions.</p>
            )}
          </div>
        </Card>
        <Card title="People activity" description="Latest sample HR updates" bodyClassName="p-5">
          <div className="space-y-5">
            {[
              {
                title: "October payroll prepared",
                detail: "Base salary records are ready for review",
                time: "09:15",
              },
              {
                title: "Onboarding checklist updated",
                detail: "Equipment and orientation tasks assigned",
                time: "10:00",
              },
              {
                title: "Team survey scheduled",
                detail: "Employee feedback opens October 12",
                time: "10:45",
              },
            ].map((a) => (
              <div key={a.title} className="flex gap-3">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card
          title="Onboarding checklist"
          description={`${onboardingTasks.filter((task) => task.done).length} of ${onboardingTasks.length} tasks complete`}
          bodyClassName="p-5"
        >
          <div className="space-y-3">
            {onboardingTasks.map((task) => (
              <label
                key={task.title}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={task.done}
                  onChange={() =>
                    setOnboarding((current) =>
                      current.map((item) =>
                        item.title === task.title ? { ...item, done: !item.done } : item,
                      ),
                    )
                  }
                />
                <span
                  className={task.done ? "text-sm text-muted-foreground line-through" : "text-sm"}
                >
                  {task.title}
                </span>
              </label>
            ))}
          </div>
        </Card>
        <Card title="Work arrangements" description="Today's team availability" bodyClassName="p-5">
          <div className="space-y-5">
            {[
              { label: "Office", status: "Present" },
              { label: "Remote", status: "Remote" },
              { label: "On leave", status: "On leave" },
            ].map((item) => {
              const count = selected.filter((e) => e.status === item.status).length;
              return (
                <div key={item.status}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-semibold">{count} people</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: (selected.length ? (count / selected.length) * 100 : 0) + "%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card
          title="Team milestones"
          description="Upcoming sample events ? October 2026"
          bodyClassName="p-5"
        >
          <div className="space-y-4">
            {[
              { name: "Sophia Carter", label: "Work anniversary", day: "12", department: "Design" },
              { name: "Maya Patel", label: "Birthday", day: "15", department: "Engineering" },
              {
                name: "James Wilson",
                label: "Work anniversary",
                day: "21",
                department: "Operations",
              },
            ]
              .filter((item) => department === "all" || item.department === department)
              .map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                    {item.day}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.label} ? October {item.day}
                    </p>
                  </div>
                </div>
              ))}
            {department === "Marketing" && (
              <p className="text-sm text-muted-foreground">No upcoming milestones.</p>
            )}
          </div>
        </Card>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add employee</DialogTitle>
            <DialogDescription>
              Create a sample employee record for this page session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addEmployee} className="space-y-4">
            <div>
              <Label htmlFor="hrm-name">Full name</Label>
              <Input
                id="hrm-name"
                required
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hrm-role">Job title</Label>
              <Input
                id="hrm-role"
                required
                maxLength={80}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hrm-department">Department</Label>
              <select
                id="hrm-department"
                className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
              >
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="hrm-salary">Monthly salary (USD)</Label>
              <Input
                id="hrm-salary"
                type="number"
                min={1}
                max={100000}
                step="0.01"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full">
              Save employee
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
