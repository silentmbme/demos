import { EmployeesPage } from "./EmployeesPage";
import { LeaveRequestsPage } from "./LeaveRequestsPage";
import { useState } from "react";
import {
  Users,
  Wallet,
  CalendarDays,
  Star,
  Plus,
  Search,
  Download,
  Briefcase,
  Mail,
  ArrowUpRight,
  CheckCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
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

type Kind = "employees" | "payroll" | "leave-requests" | "reviews";
type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: "Active" | "On leave";
  photo: string;
  joined: string;
};
type Payroll = {
  id: string;
  employeeId: string;
  base: number;
  allowance: number;
  deduction: number;
  status: "Pending" | "Processed";
  period: string;
};
type Leave = {
  id: string;
  employeeId: string;
  type: string;
  start: string;
  end: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
};
type Review = {
  id: string;
  employeeId: string;
  reviewer: string;
  rating: number;
  notes: string;
  status: "Draft" | "Completed";
  due: string;
};
const initialEmployees: Employee[] = [
  {
    id: "EMP-101",
    name: "Olivia Smith",
    role: "Product designer",
    department: "Design",
    email: "olivia@example.com",
    status: "Active",
    photo: userImages.user1,
    joined: "2024-02-12",
  },
  {
    id: "EMP-102",
    name: "Daniel Reyes",
    role: "Frontend developer",
    department: "Engineering",
    email: "daniel@example.com",
    status: "Active",
    photo: userImages.user2,
    joined: "2023-08-21",
  },
  {
    id: "EMP-103",
    name: "Emma Wilson",
    role: "HR specialist",
    department: "People",
    email: "emma@example.com",
    status: "On leave",
    photo: userImages.user3,
    joined: "2024-05-06",
  },
  {
    id: "EMP-104",
    name: "Liam Walker",
    role: "Account manager",
    department: "Sales",
    email: "liam@example.com",
    status: "Active",
    photo: userImages.user4,
    joined: "2022-11-14",
  },
  {
    id: "EMP-105",
    name: "Amara Okafor",
    role: "Design lead",
    department: "Design",
    email: "amara@example.com",
    status: "Active",
    photo: userImages.user1,
    joined: "2022-03-07",
  },
  {
    id: "EMP-106",
    name: "Marcus Parker",
    role: "Platform engineer",
    department: "Engineering",
    email: "marcus@example.com",
    status: "Active",
    photo: userImages.user2,
    joined: "2023-01-16",
  },
  {
    id: "EMP-107",
    name: "Sophie Turner",
    role: "People partner",
    department: "People",
    email: "sophie@example.com",
    status: "Active",
    photo: userImages.user3,
    joined: "2024-07-01",
  },
  {
    id: "EMP-108",
    name: "Lukas Meyer",
    role: "Sales analyst",
    department: "Sales",
    email: "lukas@example.com",
    status: "On leave",
    photo: userImages.user4,
    joined: "2023-09-11",
  },
];
const initialPayroll: Payroll[] = initialEmployees.map((e, i) => ({
  id: `PAY-${101 + i}`,
  employeeId: e.id,
  base: 3800 + i * 350,
  allowance: 300 + i * 20,
  deduction: 420 + i * 25,
  status: i < 3 ? "Processed" : "Pending",
  period: "October 2026",
}));
const initialLeaves: Leave[] = [
  {
    id: "LEV-101",
    employeeId: "EMP-101",
    type: "Annual leave",
    start: "2026-10-12",
    end: "2026-10-14",
    reason: "Family trip",
    status: "Pending",
  },
  {
    id: "LEV-102",
    employeeId: "EMP-103",
    type: "Personal leave",
    start: "2026-10-08",
    end: "2026-10-10",
    reason: "Personal appointment",
    status: "Approved",
  },
  {
    id: "LEV-103",
    employeeId: "EMP-106",
    type: "Annual leave",
    start: "2026-10-19",
    end: "2026-10-23",
    reason: "Planned vacation",
    status: "Pending",
  },
  {
    id: "LEV-104",
    employeeId: "EMP-108",
    type: "Sick leave",
    start: "2026-10-09",
    end: "2026-10-09",
    reason: "Recovery day",
    status: "Approved",
  },
  {
    id: "LEV-105",
    employeeId: "EMP-104",
    type: "Personal leave",
    start: "2026-10-16",
    end: "2026-10-16",
    reason: "Personal commitment",
    status: "Rejected",
  },
  {
    id: "LEV-106",
    employeeId: "EMP-107",
    type: "Annual leave",
    start: "2026-10-26",
    end: "2026-10-28",
    reason: "Time off",
    status: "Pending",
  },
];
const initialReviews: Review[] = [
  {
    id: "REV-101",
    employeeId: "EMP-101",
    reviewer: "Amara Okafor",
    rating: 4,
    notes:
      "Strong collaboration and clear design handoffs. Focus next quarter on documenting research decisions.",
    status: "Completed",
    due: "2026-10-12",
  },
  {
    id: "REV-102",
    employeeId: "EMP-102",
    reviewer: "Marcus Parker",
    rating: 3,
    notes: "Review delivery consistency, code quality, and knowledge sharing.",
    status: "Draft",
    due: "2026-10-15",
  },
  {
    id: "REV-103",
    employeeId: "EMP-104",
    reviewer: "Lukas Meyer",
    rating: 4,
    notes: "Review customer relationships and pipeline quality.",
    status: "Draft",
    due: "2026-10-20",
  },
  {
    id: "REV-104",
    employeeId: "EMP-107",
    reviewer: "Emma Wilson",
    rating: 5,
    notes: "Excellent onboarding support and thoughtful employee communication.",
    status: "Completed",
    due: "2026-10-22",
  },
];
const titles = {
  employees: "Employees",
  payroll: "Payroll",
  "leave-requests": "Leave Requests",
  reviews: "Performance Reviews",
};
const departments = ["Design", "Engineering", "People", "Sales"];
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
const net = (p: Payroll) => p.base + p.allowance - p.deduction;
const days = (l: Leave) => Math.round((Date.parse(l.end) - Date.parse(l.start)) / 86400000) + 1;
function csv(name: string, rows: string[][]) {
  const url = URL.createObjectURL(
    new Blob(
      [rows.map((r) => r.map((v) => '"' + v.replaceAll('"', '""') + '"').join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    ),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
export function HrmPage({ kind }: { kind: Kind }) {
  return (
    <AppShell>
      {kind === "leave-requests" ? (
        <LeaveRequestsPage employees={initialEmployees} initial={initialLeaves} />
      ) : kind === "employees" ? (
        <EmployeesPage initial={initialEmployees} />
      ) : (
        <Workspace key={kind} kind={kind} />
      )}
    </AppShell>
  );
}
function Workspace({ kind }: { kind: Kind }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [payroll, setPayroll] = useState(initialPayroll);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [reviews, setReviews] = useState(initialReviews);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [notice, setNotice] = useState("");
  const [create, setCreate] = useState(false);
  const [error, setError] = useState("");
  const [employeeDetail, setEmployeeDetail] = useState<Employee | null>(null);
  const [payDetail, setPayDetail] = useState<Payroll | null>(null);
  const [leaveDetail, setLeaveDetail] = useState<Leave | null>(null);
  const [reviewDraft, setReviewDraft] = useState<Review | null>(null);
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    role: "",
    department: "Design",
    email: "",
  });
  const [leaveForm, setLeaveForm] = useState({
    employeeId: "EMP-101",
    type: "Annual leave",
    start: "2026-10-19",
    end: "2026-10-20",
    reason: "",
  });
  const [reviewForm, setReviewForm] = useState({
    employeeId: "EMP-101",
    reviewer: "",
    due: "2026-10-23",
  });
  const person = (id: string) => employees.find((e) => e.id === id)!;
  const matches = (employee: Employee, recordStatus: string, id: string) =>
    `${employee.name} ${employee.role} ${employee.id} ${id}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()) &&
    (department === "All" || department === employee.department) &&
    (status === "All" || status === recordStatus);
  const visibleEmployees = employees.filter((e) => matches(e, e.status, e.id));
  const visiblePayroll = payroll.filter((p) => matches(person(p.employeeId), p.status, p.id));
  const visibleLeaves = leaves.filter((l) => matches(person(l.employeeId), l.status, l.id));
  const visibleReviews = reviews.filter((r) => matches(person(r.employeeId), r.status, r.id));
  const completed = reviews.filter((r) => r.status === "Completed");
  const stats =
    kind === "employees"
      ? [
          ["Employees", String(employees.length)],
          ["Active", String(employees.filter((e) => e.status === "Active").length)],
          ["On leave", String(employees.filter((e) => e.status === "On leave").length)],
          ["Departments", String(departments.length)],
        ]
      : kind === "payroll"
        ? [
            ["Net sample payroll", money(payroll.reduce((n, p) => n + net(p), 0))],
            [
              "Processed",
              money(
                payroll.filter((p) => p.status === "Processed").reduce((n, p) => n + net(p), 0),
              ),
            ],
            ["Pending records", String(payroll.filter((p) => p.status === "Pending").length)],
            ["Pay period", "Oct 2026"],
          ]
        : kind === "leave-requests"
          ? [
              ["Requests", String(leaves.length)],
              ["Pending", String(leaves.filter((l) => l.status === "Pending").length)],
              ["Approved", String(leaves.filter((l) => l.status === "Approved").length)],
              ["Rejected", String(leaves.filter((l) => l.status === "Rejected").length)],
            ]
          : [
              ["Review cycles", String(reviews.length)],
              ["Completed", String(completed.length)],
              ["Drafts", String(reviews.filter((r) => r.status === "Draft").length)],
              [
                "Average completed rating",
                completed.length
                  ? (completed.reduce((n, r) => n + r.rating, 0) / completed.length).toFixed(1) +
                    " / 5"
                  : "No ratings",
              ],
            ];
  const exportRecords = () => {
    if (kind === "employees")
      csv("employees.csv", [
        ["ID", "Name", "Role", "Department", "Email", "Status"],
        ...visibleEmployees.map((e) => [e.id, e.name, e.role, e.department, e.email, e.status]),
      ]);
    if (kind === "payroll")
      csv("sample-payroll.csv", [
        ["ID", "Employee", "Period", "Base", "Allowances", "Sample deductions", "Net", "Status"],
        ...visiblePayroll.map((p) => [
          p.id,
          person(p.employeeId).name,
          p.period,
          String(p.base),
          String(p.allowance),
          String(p.deduction),
          String(net(p)),
          p.status,
        ]),
      ]);
    if (kind === "leave-requests")
      csv("leave-requests.csv", [
        ["ID", "Employee", "Type", "Start", "End", "Calendar days", "Status"],
        ...visibleLeaves.map((l) => [
          l.id,
          person(l.employeeId).name,
          l.type,
          l.start,
          l.end,
          String(days(l)),
          l.status,
        ]),
      ]);
    if (kind === "reviews")
      csv("performance-reviews.csv", [
        ["ID", "Employee", "Reviewer", "Due", "Rating", "Status", "Notes"],
        ...visibleReviews.map((r) => [
          r.id,
          person(r.employeeId).name,
          r.reviewer,
          r.due,
          String(r.rating),
          r.status,
          r.notes,
        ]),
      ]);
    setNotice("Filtered sample records exported.");
  };
  const decide = (value: "Approved" | "Rejected") => {
    if (!leaveDetail) return;
    setLeaves((prev) => prev.map((l) => (l.id === leaveDetail.id ? { ...l, status: value } : l)));
    setLeaveDetail({ ...leaveDetail, status: value });
    setNotice(`${leaveDetail.id} ${value.toLowerCase()} locally. No employee notification sent.`);
  };
  const avatar = (e: Employee) => (
    <div className="flex items-center gap-3">
      <img src={e.photo} alt={e.name} className="size-10 shrink-0 rounded-full object-cover" />
      <div>
        <p className="font-semibold">{e.name}</p>
        <p className="text-xs text-muted-foreground">{e.role}</p>
      </div>
    </div>
  );
  return (
    <>
      <PageHeader
        title={titles[kind]}
        subtitle={
          {
            employees: "Explore employee profiles, teams, and contact details.",
            payroll: "Review sample payroll records and earnings breakdowns.",
            "leave-requests": "Review time-off requests and manage approval decisions.",
            reviews: "Plan feedback cycles and record performance reviews.",
          }[kind]
        }
        breadcrumb={["Management", "HRM", titles[kind]]}
        actions={
          <>
            <Button variant="outline" onClick={exportRecords}>
              <Download className="size-4" />
              Export
            </Button>
            {kind !== "payroll" && (
              <Button
                onClick={() => {
                  setCreate(true);
                  setError("");
                }}
              >
                <Plus className="size-4" />
                {kind === "employees"
                  ? "Add employee"
                  : kind === "leave-requests"
                    ? "New request"
                    : "Create review"}
              </Button>
            )}
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value], i) => {
          const Icon = [Users, Wallet, CalendarDays, Star][i];
          return (
            <Card key={label} bodyClassName="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <span
                  className={`grid size-10 place-items-center rounded-xl ${["bg-primary/10 text-primary", "bg-success/10 text-success", "bg-warning/10 text-warning", "bg-info/10 text-info"][i]}`}
                >
                  <Icon className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
            </Card>
          );
        })}
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-info/15 bg-info/5 p-4">
        <p className="text-xs text-muted-foreground">
          Sample HR workspace / records and edits apply to this page session.
          {kind === "payroll"
            ? " Amounts and deductions are illustrative; no payments are made."
            : ""}
        </p>
        <Badge tone="info">Demo data</Badge>
      </div>
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Search HR records"
            className="ps-9"
            placeholder="Search employee or reference..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="HR department"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="All">All departments</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          aria-label="HR status"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {(kind === "employees"
            ? ["All", "Active", "On leave"]
            : kind === "payroll"
              ? ["All", "Pending", "Processed"]
              : kind === "leave-requests"
                ? ["All", "Pending", "Approved", "Rejected"]
                : ["All", "Draft", "Completed"]
          ).map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All statuses" : s}
            </option>
          ))}
        </select>
      </div>
      {kind === "employees" && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {visibleEmployees.map((e) => (
            <Card key={e.id} bodyClassName="p-5">
              <div className="flex items-center justify-between gap-2">
                <img src={e.photo} alt={e.name} className="size-14 rounded-2xl object-cover" />
                <Badge tone={e.status === "Active" ? "success" : "warning"}>{e.status}</Badge>
              </div>
              <h2 className="mt-4 text-base font-semibold">{e.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{e.role}</p>
              <div className="mt-5 space-y-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Briefcase className="size-4" />
                  {e.department}
                </p>
                <p className="flex items-center gap-2 break-all">
                  <Mail className="size-4 shrink-0" />
                  {e.email}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-5 w-full"
                aria-label={`Employee ${e.id}`}
                onClick={() => setEmployeeDetail(e)}
              >
                View profile
                <ArrowUpRight className="size-4" />
              </Button>
            </Card>
          ))}
          {!visibleEmployees.length && (
            <Card>
              <p className="p-5 text-sm text-muted-foreground">No matching employees.</p>
            </Card>
          )}
        </div>
      )}
      {kind === "payroll" && (
        <Card
          title="October payroll register"
          description={`${visiblePayroll.length} illustrative pay records`}
          bodyClassName="p-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Employee",
                  "Base salary",
                  "Allowances",
                  "Deductions",
                  "Net pay",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiblePayroll.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{avatar(person(p.employeeId))}</TableCell>
                  <TableCell>{money(p.base)}</TableCell>
                  <TableCell>{money(p.allowance)}</TableCell>
                  <TableCell>{money(p.deduction)}</TableCell>
                  <TableCell className="font-semibold">{money(net(p))}</TableCell>
                  <TableCell>
                    <Badge tone={p.status === "Processed" ? "success" : "warning"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`Payroll ${p.id}`}
                      onClick={() => setPayDetail(p)}
                    >
                      View breakdown
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!visiblePayroll.length && (
                <TableRow>
                  <TableCell colSpan={7} className="p-8 text-center text-muted-foreground">
                    No matching payroll records.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      {kind === "leave-requests" && (
        <Card
          title="Leave request queue"
          description="Days are inclusive calendar days, not policy-adjusted working days."
          bodyClassName="p-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                {["Employee", "Leave type", "Dates", "Days", "Status", "Actions"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleLeaves.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{avatar(person(l.employeeId))}</TableCell>
                  <TableCell>{l.type}</TableCell>
                  <TableCell>
                    <p>{l.start}</p>
                    <p className="text-xs text-muted-foreground">to {l.end}</p>
                  </TableCell>
                  <TableCell>{days(l)}</TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        l.status === "Approved"
                          ? "success"
                          : l.status === "Pending"
                            ? "warning"
                            : "muted"
                      }
                    >
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Leave ${l.id}`}
                      onClick={() => setLeaveDetail(l)}
                    >
                      Review request
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!visibleLeaves.length && (
                <TableRow>
                  <TableCell colSpan={6} className="p-8 text-center text-muted-foreground">
                    No matching leave requests.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      {kind === "reviews" && (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleReviews.map((r) => (
            <Card key={r.id} bodyClassName="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {avatar(person(r.employeeId))}
                <Badge tone={r.status === "Completed" ? "success" : "warning"}>{r.status}</Badge>
              </div>
              <div
                className="my-5 flex items-center gap-1 text-warning"
                aria-label={`Rating ${r.rating} of 5`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`size-5 ${n <= r.rating ? "fill-current" : "text-muted-foreground/30"}`}
                  />
                ))}
                <span className="ms-2 text-sm text-foreground">
                  {r.rating}/5{r.status === "Draft" ? " (draft)" : ""}
                </span>
              </div>
              <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                {r.notes || "No feedback added yet."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-4">
                <div>
                  <p className="text-[10px] text-muted-foreground">Reviewer</p>
                  <p className="mt-1 text-xs font-semibold">{r.reviewer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Due date</p>
                  <p className="mt-1 text-xs font-semibold">{r.due}</p>
                </div>
              </div>
              <Button
                className="mt-5 w-full"
                variant="outline"
                aria-label={`Review ${r.id}`}
                onClick={() => {
                  setError("");
                  setReviewDraft({ ...r });
                }}
              >
                {r.status === "Completed" ? "View review" : "Edit review"}
                <ArrowUpRight className="size-4" />
              </Button>
            </Card>
          ))}
          {!visibleReviews.length && (
            <Card>
              <p className="p-5 text-sm text-muted-foreground">No matching reviews.</p>
            </Card>
          )}
        </div>
      )}
      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {kind === "employees"
                ? "Add employee"
                : kind === "leave-requests"
                  ? "New leave request"
                  : "Create performance review"}
            </DialogTitle>
            <DialogDescription>Create a sample record for this page session.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              if (kind === "employees") {
                if (!employeeForm.name.trim() || !employeeForm.role.trim()) {
                  setError("Enter the employee name and role.");
                  return;
                }
                if (
                  employees.some(
                    (p) => p.email.toLowerCase() === employeeForm.email.trim().toLowerCase(),
                  )
                ) {
                  setError("An employee with this email already exists.");
                  return;
                }
                const id = `EMP-${Math.max(...employees.map((p) => Number(p.id.split("-")[1]))) + 1}`;
                setEmployees((prev) => [
                  ...prev,
                  {
                    ...employeeForm,
                    name: employeeForm.name.trim(),
                    role: employeeForm.role.trim(),
                    email: employeeForm.email.trim(),
                    id,
                    status: "Active",
                    photo: userImages.user1,
                    joined: "2026-10-09",
                  },
                ]);
                setNotice(`${id} added to the sample directory.`);
                setEmployeeForm({ name: "", role: "", email: "", department: "Design" });
              } else if (kind === "leave-requests") {
                if (leaveForm.end < leaveForm.start) {
                  setError("End date must be on or after the start date.");
                  return;
                }
                if (!leaveForm.reason.trim()) {
                  setError("Enter a reason for the request.");
                  return;
                }
                if (
                  leaves.some(
                    (l) =>
                      l.employeeId === leaveForm.employeeId &&
                      l.status !== "Rejected" &&
                      leaveForm.start <= l.end &&
                      leaveForm.end >= l.start,
                  )
                ) {
                  setError("This request overlaps an existing pending or approved request.");
                  return;
                }
                const id = `LEV-${Math.max(...leaves.map((l) => Number(l.id.split("-")[1]))) + 1}`;
                setLeaves((prev) => [
                  ...prev,
                  { ...leaveForm, reason: leaveForm.reason.trim(), id, status: "Pending" },
                ]);
                setNotice(`${id} added to the request queue.`);
              } else {
                if (!reviewForm.reviewer.trim()) {
                  setError("Enter a reviewer name.");
                  return;
                }
                const id = `REV-${Math.max(...reviews.map((r) => Number(r.id.split("-")[1]))) + 1}`;
                setReviews((prev) => [
                  ...prev,
                  {
                    ...reviewForm,
                    reviewer: reviewForm.reviewer.trim(),
                    id,
                    rating: 3,
                    notes: "",
                    status: "Draft",
                  },
                ]);
                setNotice(`${id} created as a draft.`);
              }
              setCreate(false);
            }}
          >
            {kind === "employees" ? (
              <>
                {[
                  ["Employee name", "name"],
                  ["Job role", "role"],
                  ["Email", "email"],
                ].map(([label, key]) => (
                  <label key={key} className="block text-sm font-medium">
                    {label}
                    <Input
                      aria-label={label}
                      required
                      maxLength={120}
                      type={key === "email" ? "email" : "text"}
                      className="mt-2"
                      value={employeeForm[key as "name" | "role" | "email"]}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, [key]: e.target.value })}
                    />
                  </label>
                ))}
                <label className="block text-sm font-medium">
                  Department
                  <select
                    aria-label="Employee department"
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                    value={employeeForm.department}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, department: e.target.value })
                    }
                  >
                    {departments.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium">
                  Employee
                  <select
                    aria-label="Record employee"
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                    value={kind === "leave-requests" ? leaveForm.employeeId : reviewForm.employeeId}
                    onChange={(e) =>
                      kind === "leave-requests"
                        ? setLeaveForm({ ...leaveForm, employeeId: e.target.value })
                        : setReviewForm({ ...reviewForm, employeeId: e.target.value })
                    }
                  >
                    {employees.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                {kind === "leave-requests" ? (
                  <>
                    <label className="block text-sm font-medium">
                      Leave type
                      <select
                        aria-label="Leave type"
                        className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                        value={leaveForm.type}
                        onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                      >
                        {["Annual leave", "Personal leave", "Sick leave"].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["Start date", "start"],
                        ["End date", "end"],
                      ].map(([label, key]) => (
                        <label key={key} className="block text-sm font-medium">
                          {label}
                          <Input
                            aria-label={label}
                            type="date"
                            required
                            className="mt-2"
                            value={leaveForm[key as "start" | "end"]}
                            onChange={(e) => setLeaveForm({ ...leaveForm, [key]: e.target.value })}
                          />
                        </label>
                      ))}
                    </div>
                    <label className="block text-sm font-medium">
                      Reason
                      <textarea
                        aria-label="Leave reason"
                        required
                        maxLength={500}
                        rows={3}
                        className="mt-2 w-full rounded-lg border border-border bg-card p-3 text-sm"
                        value={leaveForm.reason}
                        onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium">
                      Reviewer
                      <Input
                        aria-label="Reviewer name"
                        required
                        maxLength={80}
                        className="mt-2"
                        value={reviewForm.reviewer}
                        onChange={(e) => setReviewForm({ ...reviewForm, reviewer: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm font-medium">
                      Due date
                      <Input
                        aria-label="Review due date"
                        type="date"
                        required
                        className="mt-2"
                        value={reviewForm.due}
                        onChange={(e) => setReviewForm({ ...reviewForm, due: e.target.value })}
                      />
                    </label>
                  </>
                )}
              </>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full">
              {kind === "employees"
                ? "Save employee"
                : kind === "leave-requests"
                  ? "Submit request"
                  : "Create draft"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!employeeDetail}
        onOpenChange={(open) => {
          if (!open) setEmployeeDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee profile</DialogTitle>
            <DialogDescription>{employeeDetail?.id} / Sample record</DialogDescription>
          </DialogHeader>
          {employeeDetail && (
            <>
              {avatar(employeeDetail)}
              <dl className="space-y-4 rounded-xl bg-muted/40 p-4">
                {[
                  ["Department", employeeDetail.department],
                  ["Email", employeeDetail.email],
                  ["Joined", employeeDetail.joined],
                  ["Status", employeeDetail.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button
                variant="outline"
                onClick={() => {
                  const status = employeeDetail.status === "Active" ? "On leave" : "Active";
                  setEmployees((prev) =>
                    prev.map((e) => (e.id === employeeDetail.id ? { ...e, status } : e)),
                  );
                  setEmployeeDetail({ ...employeeDetail, status });
                  setNotice(`${employeeDetail.id} status updated.`);
                }}
              >
                {employeeDetail.status === "Active" ? "Mark on leave" : "Mark active"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!payDetail}
        onOpenChange={(open) => {
          if (!open) setPayDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payroll breakdown</DialogTitle>
            <DialogDescription>
              {payDetail?.id} / {payDetail?.period} / Illustrative amounts
            </DialogDescription>
          </DialogHeader>
          {payDetail && (
            <>
              {avatar(person(payDetail.employeeId))}
              <dl className="space-y-3 rounded-xl bg-muted/40 p-4">
                {[
                  ["Base salary", money(payDetail.base)],
                  ["Allowances", money(payDetail.allowance)],
                  ["Sample deductions", money(payDetail.deduction)],
                  ["Net pay", money(net(payDetail))],
                  ["Status", payDetail.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs leading-5 text-muted-foreground">
                Net pay = base + allowances - sample deductions. No tax calculation, banking
                connection, or payment is performed.
              </p>
              <Button
                disabled={payDetail.status === "Processed"}
                onClick={() => {
                  setPayroll((prev) =>
                    prev.map((p) => (p.id === payDetail.id ? { ...p, status: "Processed" } : p)),
                  );
                  setPayDetail({ ...payDetail, status: "Processed" });
                  setNotice(
                    `${payDetail.id} marked processed in the sample register. No payment made.`,
                  );
                }}
              >
                Mark sample processed
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!leaveDetail}
        onOpenChange={(open) => {
          if (!open) setLeaveDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave request</DialogTitle>
            <DialogDescription>{leaveDetail?.id} / Sample approval workflow</DialogDescription>
          </DialogHeader>
          {leaveDetail && (
            <>
              {avatar(person(leaveDetail.employeeId))}
              <div className="rounded-xl bg-muted/40 p-4">
                <Badge tone="info">{leaveDetail.type}</Badge>
                <p className="mt-3 text-sm font-semibold">
                  {leaveDetail.start} to {leaveDetail.end}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {days(leaveDetail)} inclusive calendar days / {leaveDetail.status}
                </p>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6">
                  {leaveDetail.reason}
                </p>
              </div>
              {leaveDetail.status === "Pending" ? (
                <div className="flex gap-3">
                  <Button onClick={() => decide("Approved")}>
                    <CheckCheck className="size-4" />
                    Approve request
                  </Button>
                  <Button variant="outline" onClick={() => decide("Rejected")}>
                    Reject request
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setLeaves((prev) =>
                      prev.map((l) => (l.id === leaveDetail.id ? { ...l, status: "Pending" } : l)),
                    );
                    setLeaveDetail({ ...leaveDetail, status: "Pending" });
                    setNotice(`${leaveDetail.id} reopened for review.`);
                  }}
                >
                  Reopen request
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!reviewDraft}
        onOpenChange={(open) => {
          if (!open) setReviewDraft(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Performance review</DialogTitle>
            <DialogDescription>{reviewDraft?.id} / Sample feedback record</DialogDescription>
          </DialogHeader>
          {reviewDraft && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reviewDraft.notes.trim()) {
                  setError("Add feedback before completing the review.");
                  return;
                }
                setReviews((prev) =>
                  prev.map((r) =>
                    r.id === reviewDraft.id
                      ? { ...reviewDraft, notes: reviewDraft.notes.trim(), status: "Completed" }
                      : r,
                  ),
                );
                setNotice(`${reviewDraft.id} completed locally.`);
                setReviewDraft(null);
              }}
            >
              {avatar(person(reviewDraft.employeeId))}
              <p className="text-xs text-muted-foreground">
                Reviewer: {reviewDraft.reviewer} / Due: {reviewDraft.due}
              </p>
              <label className="block text-sm font-medium">
                Overall rating
                <select
                  aria-label="Review rating"
                  disabled={reviewDraft.status === "Completed"}
                  className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  value={reviewDraft.rating}
                  onChange={(e) =>
                    setReviewDraft({ ...reviewDraft, rating: Number(e.target.value) })
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Feedback
                <textarea
                  aria-label="Review feedback"
                  disabled={reviewDraft.status === "Completed"}
                  maxLength={1500}
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm"
                  value={reviewDraft.notes}
                  onChange={(e) => setReviewDraft({ ...reviewDraft, notes: e.target.value })}
                />
              </label>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {reviewDraft.status === "Draft" ? (
                <div className="flex flex-wrap gap-3">
                  <Button type="submit">Complete review</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setReviews((prev) =>
                        prev.map((r) => (r.id === reviewDraft.id ? reviewDraft : r)),
                      );
                      setNotice(`${reviewDraft.id} draft saved.`);
                      setReviewDraft(null);
                    }}
                  >
                    Save draft
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setReviews((prev) =>
                      prev.map((r) => (r.id === reviewDraft.id ? { ...r, status: "Draft" } : r)),
                    );
                    setReviewDraft({ ...reviewDraft, status: "Draft" });
                    setNotice(`${reviewDraft.id} reopened as a draft.`);
                  }}
                >
                  Reopen review
                </Button>
              )}
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
