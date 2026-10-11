import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  CheckCheck,
  X,
  Search,
  Plus,
  Download,
  ArrowLeft,
  ArrowRight,
  Users,
  MessageSquare,
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

type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  photo: string;
};
type Status = "Pending" | "Approved" | "Rejected";
type Leave = {
  id: string;
  employeeId: string;
  type: string;
  start: string;
  end: string;
  reason: string;
  status: Status;
};
type Decision = { note: string; status: Status; time: string };
const types = ["Annual leave", "Personal leave", "Sick leave"];
const days = (l: Pick<Leave, "start" | "end">) =>
  Math.round((Date.parse(l.end) - Date.parse(l.start)) / 86400000) + 1;
const shift = (date: string, n: number) => {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const dateLabel = (date: string) =>
  new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
export function LeaveRequestsPage({
  employees,
  initial,
}: {
  employees: Employee[];
  initial: Leave[];
}) {
  const [requests, setRequests] = useState(initial);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("pending");
  const [week, setWeek] = useState("2026-10-12");
  const [dayFilter, setDayFilter] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [decisions, setDecisions] = useState<Record<string, Decision[]>>({});
  const [create, setCreate] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    employeeId: employees[0].id,
    type: "Annual leave",
    start: "2026-10-19",
    end: "2026-10-20",
    reason: "",
  });
  const person = (id: string) => employees.find((e) => e.id === id)!;
  const active = requests.find((r) => r.id === reviewId);
  const departments = [...new Set(employees.map((e) => e.department))];
  const scope = requests.filter(
    (r) => department === "All" || person(r.employeeId).department === department,
  );
  const visible = scope
    .filter(
      (r) =>
        `${r.id} ${person(r.employeeId).name} ${r.reason}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (status === "All" || r.status === status) &&
        (type === "All" || r.type === type) &&
        (!dayFilter || (r.start <= dayFilter && r.end >= dayFilter)),
    )
    .sort((a, b) =>
      sort === "pending"
        ? Number(b.status === "Pending") - Number(a.status === "Pending") ||
          a.start.localeCompare(b.start)
        : sort === "duration"
          ? days(b) - days(a)
          : a.start.localeCompare(b.start),
    );
  const overlaps = (a: Leave, b: Leave) => a.start <= b.end && a.end >= b.start;
  const conflicts = active
    ? requests.filter(
        (r) =>
          r.id !== active.id &&
          r.status === "Approved" &&
          person(r.employeeId).department === person(active.employeeId).department &&
          overlaps(active, r),
      )
    : [];
  const open = (id: string) => {
    setReviewId(id);
    setNote("");
    setError("");
  };
  const decide = (value: Status) => {
    if (!active) return;
    if (value === "Rejected" && !note.trim()) {
      setError("Add a decision note before rejecting the request.");
      return;
    }
    setRequests((prev) => prev.map((r) => (r.id === active.id ? { ...r, status: value } : r)));
    setDecisions((prev) => ({
      ...prev,
      [active.id]: [
        {
          status: value,
          note: note.trim(),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...(prev[active.id] ?? []),
      ],
    }));
    setNotice(
      `${active.id} ${value === "Pending" ? "reopened" : value.toLowerCase()} locally. No employee notification sent.`,
    );
    setNote("");
    setError("");
  };
  const exportRequests = () => {
    const rows = [
      [
        "Reference",
        "Employee",
        "Department",
        "Type",
        "Start",
        "End",
        "Calendar days",
        "Status",
        "Reason",
        "Latest decision note",
      ],
      ...visible.map((r) => [
        r.id,
        person(r.employeeId).name,
        person(r.employeeId).department,
        r.type,
        r.start,
        r.end,
        String(days(r)),
        r.status,
        r.reason,
        decisions[r.id]?.[0]?.note ?? "",
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob(
        [
          rows
            .map((row) => row.map((v) => '"' + v.replaceAll('"', '""') + '"').join(","))
            .join("\r\n"),
        ],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "leave-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} filtered leave requests.`);
  };
  return (
    <>
      <PageHeader
        title="Leave Requests"
        subtitle="Review time off, check team coverage, and record clear approval decisions."
        breadcrumb={["Management", "HRM", "Leave Requests"]}
        actions={
          <>
            <Button variant="outline" onClick={exportRequests}>
              <Download className="size-4" />
              Export requests
            </Button>
            <Button
              onClick={() => {
                setCreate(true);
                setError("");
              }}
            >
              <Plus className="size-4" />
              New request
            </Button>
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Awaiting review",
            value: scope.filter((r) => r.status === "Pending").length,
            caption: "Requests requiring a decision",
            Icon: Clock3,
            tone: "bg-warning/10 text-warning",
          },
          {
            label: "Approved requests",
            value: scope.filter((r) => r.status === "Approved").length,
            caption: "Approved in the sample workspace",
            Icon: CheckCheck,
            tone: "bg-success/10 text-success",
          },
          {
            label: "Approved calendar days",
            value: scope.filter((r) => r.status === "Approved").reduce((n, r) => n + days(r), 0),
            caption: "Inclusive days; not a leave balance",
            Icon: CalendarDays,
            tone: "bg-info/10 text-info",
          },
          {
            label: "Rejected requests",
            value: scope.filter((r) => r.status === "Rejected").length,
            caption: "Reopen to reconsider a decision",
            Icon: X,
            tone: "bg-primary/10 text-primary",
          },
        ].map((s) => (
          <Card key={s.label} bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <span className={`grid size-11 place-items-center rounded-xl ${s.tone}`}>
                <s.Icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.caption}</p>
          </Card>
        ))}
      </div>
      <div className="mb-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card
          title="Team time-off calendar"
          description={`Approved and pending requests / ${department === "All" ? "all departments" : department}`}
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous leave week"
                onClick={() => {
                  setWeek(shift(week, -7));
                  setDayFilter(null);
                }}
              >
                <ArrowLeft className="size-4 rtl:rotate-180" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {dateLabel(week)} - {dateLabel(shift(week, 6))}, {week.slice(0, 4)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next leave week"
                onClick={() => {
                  setWeek(shift(week, 7));
                  setDayFilter(null);
                }}
              >
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          }
          bodyClassName="p-5"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 2xl:grid-cols-7">
            {Array.from({ length: 7 }, (_, i) => shift(week, i)).map((date) => {
              const scheduled = scope.filter(
                (r) => r.status !== "Rejected" && r.start <= date && r.end >= date,
              );
              return (
                <button
                  key={date}
                  aria-label={`Leave day ${date}`}
                  aria-pressed={dayFilter === date}
                  onClick={() => setDayFilter(dayFilter === date ? null : date)}
                  className={`min-h-32 rounded-xl border p-3 text-start ${dayFilter === date ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}
                >
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {
                      weekday: "short",
                      timeZone: "UTC",
                    })}
                  </p>
                  <p className="mt-1 text-xl font-semibold">{date.slice(-2)}</p>
                  <div className="mt-3 flex -space-x-1 rtl:space-x-reverse">
                    {scheduled.slice(0, 3).map((r) => (
                      <img
                        key={r.id}
                        src={person(r.employeeId).photo}
                        alt={person(r.employeeId).name}
                        className="size-6 rounded-full object-cover ring-2 ring-card"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {scheduled.length
                      ? `${scheduled.length} request${scheduled.length === 1 ? "" : "s"}`
                      : "No time off"}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground">
            Click a day to filter the queue. Pending requests are not confirmed absences. Calendar
            counts follow the department filter.
          </p>
        </Card>
        <Card title="Review priorities" bodyClassName="p-5">
          <div className="space-y-3">
            {scope
              .filter((r) => r.status === "Pending")
              .sort((a, b) => a.start.localeCompare(b.start))
              .slice(0, 3)
              .map((r) => (
                <button
                  key={r.id}
                  onClick={() => open(r.id)}
                  className="flex w-full gap-3 rounded-xl border border-border p-3 text-start hover:bg-muted/40"
                >
                  <img
                    src={person(r.employeeId).photo}
                    alt={person(r.employeeId).name}
                    className="size-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold">{person(r.employeeId).name}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {r.type} / {dateLabel(r.start)}
                    </p>
                  </div>
                </button>
              ))}
            {!scope.some((r) => r.status === "Pending") && (
              <p className="py-5 text-sm text-muted-foreground">
                No pending requests in this department.
              </p>
            )}
          </div>
          <p className="mt-4 text-[10px] leading-4 text-muted-foreground">
            Sample records for 2026. Decisions and notes last for this page session.
          </p>
        </Card>
      </div>
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <Card
        title="Approval queue"
        description={`${visible.length} requests in the current view`}
        action={
          dayFilter ? (
            <Button variant="ghost" size="sm" onClick={() => setDayFilter(null)}>
              Clear {dateLabel(dayFilter)} filter
              <X className="size-3" />
            </Button>
          ) : (
            <Badge tone="info">Sample workspace</Badge>
          )
        }
        bodyClassName="p-0"
      >
        <div className="flex flex-wrap gap-3 border-b border-border p-5">
          <div className="relative min-w-0 flex-1 sm:min-w-48">
            <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Search HR records"
              placeholder="Search employee, reference, or reason..."
              className="ps-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
              options: ["All", "Pending", "Approved", "Rejected"],
            },
            { label: "Leave type filter", value: type, set: setType, options: ["All", ...types] },
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
                        : "All leave types"
                    : v}
                </option>
              ))}
            </select>
          ))}
          <select
            aria-label="Sort leave requests"
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="pending">Pending first</option>
            <option value="date">Start date</option>
            <option value="duration">Longest duration</option>
          </select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "Employee",
                "Leave type",
                "Dates",
                "Duration",
                "Status",
                "Decision note",
                "Actions",
              ].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={person(r.employeeId).photo}
                      alt={person(r.employeeId).name}
                      className="size-10 shrink-0 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{person(r.employeeId).name}</p>
                      <p className="text-xs text-muted-foreground">
                        {person(r.employeeId).department} / {r.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>
                  <p>{dateLabel(r.start)}</p>
                  <p className="text-xs text-muted-foreground">
                    to {dateLabel(r.end)}, {r.end.slice(0, 4)}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="font-semibold">{days(r)}</span>
                  <span className="ms-1 text-xs text-muted-foreground">calendar days</span>
                </TableCell>
                <TableCell>
                  <Badge
                    tone={
                      r.status === "Approved"
                        ? "success"
                        : r.status === "Pending"
                          ? "warning"
                          : "muted"
                    }
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="max-w-40 truncate text-xs text-muted-foreground">
                    {decisions[r.id]?.[0]?.note || "No recorded note"}
                  </p>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`Leave ${r.id}`}
                    onClick={() => open(r.id)}
                  >
                    Review request
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!visible.length && (
              <TableRow>
                <TableCell colSpan={7} className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No requests match these filters.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setQuery("");
                      setDepartment("All");
                      setStatus("All");
                      setType("All");
                      setDayFilter(null);
                    }}
                  >
                    <RotateCcw className="size-4" />
                    Reset filters
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p className="border-t border-border px-5 py-3 text-[10px] text-muted-foreground">
          Durations include weekends and are not policy-adjusted working days or leave entitlement
          calculations.
        </p>
      </Card>
      <Dialog
        open={!!active}
        onOpenChange={(value) => {
          if (!value) setReviewId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Leave request review</DialogTitle>
            <DialogDescription>{active?.id} / Sample approval workflow</DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <div className="flex items-center gap-3">
                <img
                  src={person(active.employeeId).photo}
                  alt={person(active.employeeId).name}
                  className="size-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">{person(active.employeeId).name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {person(active.employeeId).role} / {person(active.employeeId).department}
                  </p>
                </div>
                <Badge
                  tone={
                    active.status === "Approved"
                      ? "success"
                      : active.status === "Pending"
                        ? "warning"
                        : "muted"
                  }
                >
                  {active.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 rounded-xl bg-muted/40 p-4">
                {[
                  ["Type", active.type],
                  ["Dates", `${dateLabel(active.start)} - ${dateLabel(active.end)}`],
                  ["Duration", `${days(active)} calendar days`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="mt-1 text-xs font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-sm font-semibold">Employee reason</h3>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                  {active.reason}
                </p>
              </div>
              <div
                className={`rounded-xl border p-4 ${conflicts.length ? "border-warning/30 bg-warning/5" : "border-success/20 bg-success/5"}`}
              >
                <h3 className="flex items-center gap-2 text-xs font-semibold">
                  <Users className="size-4" />
                  Team coverage check
                </h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {conflicts.length
                    ? `${conflicts.length} approved request(s) in this department overlap these dates: ${conflicts.map((r) => person(r.employeeId).name).join(", ")}.`
                    : "No other approved leave requests in this department overlap these dates."}{" "}
                  This sample check does not assess staffing requirements.
                </p>
              </div>
              {active.status === "Pending" ? (
                <>
                  <label className="block text-sm font-medium">
                    Decision note
                    <textarea
                      aria-label="Leave decision note"
                      rows={3}
                      maxLength={500}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Explain your decision; required when rejecting..."
                      className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-3 text-sm"
                    />
                  </label>
                  {error && (
                    <p role="alert" className="text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => decide("Approved")}>
                      <CheckCheck className="size-4" />
                      Approve request
                    </Button>
                    <Button variant="outline" onClick={() => decide("Rejected")}>
                      Reject request
                    </Button>
                  </div>
                </>
              ) : (
                <Button variant="outline" onClick={() => decide("Pending")}>
                  Reopen request
                </Button>
              )}
              {decisions[active.id]?.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold">
                    <MessageSquare className="size-4" />
                    Decision history
                  </h3>
                  <div className="max-h-36 space-y-3 overflow-y-auto">
                    {decisions[active.id].map((d, i) => (
                      <div key={i} className="rounded-lg bg-muted/40 p-3">
                        <p className="text-xs font-semibold">
                          {d.status} / {d.time}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-xs text-muted-foreground">
                          {d.note || "No decision note added."}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">
                Decisions update this local sample queue only. No notifications or leave balances
                are changed.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New leave request</DialogTitle>
            <DialogDescription>Create a local sample request for review.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (form.end < form.start) {
                setError("End date must be on or after the start date.");
                return;
              }
              if (!form.reason.trim()) {
                setError("Enter a reason for this request.");
                return;
              }
              if (
                requests.some(
                  (r) =>
                    r.employeeId === form.employeeId &&
                    r.status !== "Rejected" &&
                    form.start <= r.end &&
                    form.end >= r.start,
                )
              ) {
                setError(
                  "These dates overlap an existing pending or approved request for this employee.",
                );
                return;
              }
              const id = `LEV-${Math.max(...requests.map((r) => Number(r.id.split("-")[1]))) + 1}`;
              setRequests((prev) => [
                ...prev,
                { ...form, reason: form.reason.trim(), id, status: "Pending" },
              ]);
              setCreate(false);
              setNotice(`${id} added to the sample review queue.`);
              setForm({ ...form, reason: "" });
            }}
          >
            <label className="block text-sm font-medium">
              Employee
              <select
                aria-label="Record employee"
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border bg-card p-2"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Leave type
              <select
                aria-label="Leave type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border bg-card p-2"
              >
                {types.map((t) => (
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
                    value={form[key as "start" | "end"]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </label>
              ))}
            </div>
            <div className="rounded-xl bg-info/5 p-3 text-xs text-muted-foreground">
              {form.start && form.end && form.end >= form.start
                ? `${days(form)} inclusive calendar days`
                : "Select a valid date range"}
              . Weekends are included; no entitlement calculation is performed.
            </div>
            <label className="block text-sm font-medium">
              Reason
              <textarea
                aria-label="Leave reason"
                rows={3}
                required
                maxLength={500}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-3 text-sm"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button className="w-full" type="submit">
              Submit request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
