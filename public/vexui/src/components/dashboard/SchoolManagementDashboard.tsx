import { useState, type FormEvent } from "react";
import {
  GraduationCap,
  UsersRound,
  BookOpen,
  Wallet,
  Plus,
  Download,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  CheckCheck,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { getUserImage } from "@/lib/user-images";
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
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
import { Card, Badge, PageHeader } from "./widgets";
const grades = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const initialStudents = [
  {
    id: "ST-101",
    name: "Emma Wilson",
    grade: "Grade 8",
    attendance: "Present",
    fee: 1200,
    paid: 1200,
  },
  {
    id: "ST-102",
    name: "Liam Parker",
    grade: "Grade 8",
    attendance: "Absent",
    fee: 1200,
    paid: 600,
  },
  {
    id: "ST-103",
    name: "Ava Thompson",
    grade: "Grade 9",
    attendance: "Present",
    fee: 1400,
    paid: 1400,
  },
  {
    id: "ST-104",
    name: "Noah Williams",
    grade: "Grade 9",
    attendance: "Present",
    fee: 1400,
    paid: 700,
  },
  {
    id: "ST-105",
    name: "Mia Anderson",
    grade: "Grade 10",
    attendance: "Present",
    fee: 1600,
    paid: 1600,
  },
  {
    id: "ST-106",
    name: "Oliver Davis",
    grade: "Grade 10",
    attendance: "Absent",
    fee: 1600,
    paid: 0,
  },
  {
    id: "ST-107",
    name: "Isabella Clark",
    grade: "Grade 11",
    attendance: "Present",
    fee: 1600,
    paid: 1200,
  },
  {
    id: "ST-108",
    name: "Lucas Brown",
    grade: "Grade 11",
    attendance: "Absent",
    fee: 1600,
    paid: 800,
  },
  {
    id: "ST-109",
    name: "Amelia Hall",
    grade: "Grade 12",
    attendance: "Present",
    fee: 1600,
    paid: 1600,
  },
  {
    id: "ST-110",
    name: "Ethan Miller",
    grade: "Grade 12",
    attendance: "Present",
    fee: 1600,
    paid: 800,
  },
];
const teachers = [
  { name: "Sophia Carter", subject: "Mathematics", grade: "Grade 8" },
  { name: "Daniel Lee", subject: "Science", grade: "Grade 9" },
  { name: "Olivia Smith", subject: "English", grade: "Grade 10" },
];
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
export function SchoolManagementDashboard() {
  const [students, setStudents] = useState(initialStudents);
  const [grade, setGrade] = useState("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [newGrade, setNewGrade] = useState("Grade 8");
  const selected = students.filter((s) => grade === "all" || s.grade === grade);
  const visible = selected.filter((s) =>
    `${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  const collected = selected.reduce((sum, s) => sum + s.paid, 0);
  const outstanding = selected.reduce((sum, s) => sum + s.fee - s.paid, 0);
  const classes = grades.filter((g) => grade === "all" || g === grade);
  const { base } = useChartTheme();
  const [assignments, setAssignments] = useState([
    { title: "Algebra practice", grade: "Grade 8", subject: "Mathematics", done: false },
    { title: "Science lab report", grade: "Grade 9", subject: "Science", done: false },
    { title: "Reading reflection", grade: "Grade 10", subject: "English", done: true },
  ]);
  const attendanceOptions = mergeOptions(base, {
    colors: [token("--primary"), token("--chart-2")],
    stroke: { width: [0, 3], curve: "smooth" },
    fill: {
      type: ["solid", "gradient"],
      opacity: [0.9, 0.25],
      gradient: { opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] },
    },
    markers: { size: [0, 4] },
    plotOptions: { bar: { columnWidth: "35%", borderRadius: 5 } },
    xaxis: { categories: classes },
    yaxis: {
      min: 0,
      max: Math.max(
        ...classes.map((g) => selected.filter((student) => student.grade === g).length),
        1,
      ),
      tickAmount: Math.max(
        ...classes.map((g) => selected.filter((student) => student.grade === g).length),
        1,
      ),
      labels: { formatter: (value: number) => Math.round(value).toString() },
    },
    legend: { position: "top", horizontalAlign: "left" },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (value: number) => value + " students" },
    },
  });
  const feeOptions = mergeOptions(base, {
    colors: [
      token("--primary"),
      token("--chart-2"),
      token("--chart-3"),
      token("--chart-4"),
      token("--chart-5"),
    ],
    labels: classes,
    stroke: { lineCap: "round" },
    legend: { show: true, position: "bottom" },
    plotOptions: {
      radialBar: {
        hollow: { size: "35%" },
        track: { background: token("--muted"), margin: 8 },
        dataLabels: {
          name: { fontSize: "12px" },
          value: { fontSize: "25px", formatter: (value: number) => value.toFixed(0) + "%" },
          total: {
            show: true,
            label: "Fees collected",
            formatter: () =>
              (collected + outstanding
                ? Math.round((collected / (collected + outstanding)) * 100)
                : 0) + "%",
          },
        },
      },
    },
  });
  function admit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) return;
    setStudents((current) => [
      ...current,
      {
        id: `ST-${101 + current.length}`,
        name: name.trim(),
        grade: newGrade,
        attendance: "Present",
        fee: newGrade === "Grade 8" ? 1200 : newGrade === "Grade 9" ? 1400 : 1600,
        paid: 0,
      },
    ]);
    setGrade("all");
    setQuery("");
    setOpen(false);
    toast.success("Sample student admitted");
  }
  function exportReport() {
    const rows = [
      ["ID", "Student", "Grade", "Attendance", "Fees USD", "Paid USD"],
      ...visible.map((s) => [s.id, s.name, s.grade, s.attendance, s.fee, s.paid]),
    ];
    const csv = rows
      .map((row) => row.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "school-students.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <PageHeader
        title="School Management"
        subtitle="Bring students, classrooms, and school operations together."
        breadcrumb={["Dashboards", "School Management"]}
        actions={
          <>
            <Button variant="outline" onClick={exportReport}>
              <Download className="size-4" />
              Export report
            </Button>
            <Button
              onClick={() => {
                setName("");
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Admit student
            </Button>
          </>
        }
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-3">
          <GraduationCap className="size-9 text-primary" />
          <div>
            <p className="font-semibold">Learning today. Leading tomorrow.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sample school · October 9, 2026 · Session-only changes
            </p>
          </div>
        </div>
        <select
          aria-label="School grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
        >
          <option value="all">All grades</option>
          {grades.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Enrolled students",
            value: selected.length.toString(),
            icon: UsersRound,
            color: "--primary",
            note: "Active sample student records",
          },
          {
            label: "Attendance today",
            value: `${selected.length ? Math.round((selected.filter((s) => s.attendance === "Present").length / selected.length) * 100) : 0}%`,
            icon: GraduationCap,
            color: "--info",
            note: "Present students in selected grades",
          },
          {
            label: "Active classes",
            value: classes.length.toString(),
            icon: BookOpen,
            color: "--warning",
            note: "One sample class per grade",
          },
          {
            label: "Fees collected",
            value: money(collected),
            icon: Wallet,
            color: "--success",
            note: `${money(outstanding)} outstanding`,
          },
        ].map((m) => (
          <section key={m.label} className="vexui-card relative overflow-hidden p-5">
            <span
              className="absolute -end-6 -top-6 size-24 rounded-full"
              style={{ background: `color-mix(in oklch, var(${m.color}) 7%, transparent)` }}
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
                <span
                  className="grid size-11 place-items-center rounded-xl"
                  style={{
                    color: `var(${m.color})`,
                    background: `color-mix(in oklch, var(${m.color}) 12%, transparent)`,
                  }}
                >
                  <m.icon className="size-5" />
                </span>
              </div>
              <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums">{m.value}</p>
              <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                {m.note}
              </p>
            </div>
          </section>
        ))}
      </div>
      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <Card
          title="Attendance pulse"
          description="Present students as bars and absent students as an area"
        >
          <ApexChart
            type="bar"
            height={300}
            options={attendanceOptions}
            series={["Present", "Absent"].map((status) => ({
              name: status,
              type: status === "Present" ? "column" : "area",
              data: classes.map(
                (g) =>
                  selected.filter((student) => student.grade === g && student.attendance === status)
                    .length,
              ),
            }))}
          />
        </Card>
        <Card title="Fee collection" description="Collected fees and outstanding balances · USD">
          <ApexChart
            type="radialBar"
            height={300}
            options={feeOptions}
            series={classes.map((g) => {
              const group = selected.filter((student) => student.grade === g);
              const total = group.reduce((sum, student) => sum + student.fee, 0);
              return total
                ? (group.reduce((sum, student) => sum + student.paid, 0) / total) * 100
                : 0;
            })}
          />
        </Card>
      </div>
      <Card
        title="Student directory"
        description={`${visible.length} students in view`}
        className="mb-6"
        action={
          <Input
            aria-label="Search students"
            placeholder="Search student or ID…"
            className="sm:w-64"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        }
        bodyClassName="p-0"
      >
        <Table>
          <TableHeader>
            <TableRow>
              {["Student", "Grade", "Attendance", "Fee balance", "Actions"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.id}</p>
                </TableCell>
                <TableCell>{s.grade}</TableCell>
                <TableCell>
                  <Badge tone={s.attendance === "Present" ? "success" : "warning"}>
                    {s.attendance}
                  </Badge>
                </TableCell>
                <TableCell>{money(s.fee - s.paid)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setStudents((current) =>
                          current.map((item) =>
                            item.id === s.id
                              ? {
                                  ...item,
                                  attendance: item.attendance === "Present" ? "Absent" : "Present",
                                }
                              : item,
                          ),
                        )
                      }
                    >
                      Mark {s.attendance === "Present" ? "absent" : "present"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={s.paid === s.fee}
                      onClick={() => {
                        setStudents((current) =>
                          current.map((item) =>
                            item.id === s.id ? { ...item, paid: item.fee } : item,
                          ),
                        );
                        toast.success("Sample fee marked paid");
                      }}
                    >
                      Mark paid
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!visible.length && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No students match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Attendance and fee actions update sample records only.
        </p>
      </Card>
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Classroom agenda"
          description="Friday, October 9, 2026 ? Sample schedule"
          className="xl:col-span-2"
          bodyClassName="p-0"
          action={
            <Badge tone="primary">
              {teachers.filter((t) => grade === "all" || t.grade === grade).length} lessons
            </Badge>
          }
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 px-5 py-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-4 text-primary" />
              <span>Morning sessions</span>
            </div>
            <span className="text-xs text-muted-foreground">45 minutes per lesson</span>
          </div>
          <div className="space-y-4 p-5">
            {teachers
              .filter((t) => grade === "all" || t.grade === grade)
              .map((t) => {
                const index = grades.indexOf(t.grade);
                const SubjectIcon =
                  t.subject === "Mathematics"
                    ? GraduationCap
                    : t.subject === "Science"
                      ? ClipboardCheck
                      : BookOpen;
                return (
                  <article
                    key={t.name}
                    className="group grid grid-cols-[52px_minmax(0,1fr)] gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-5"
                  >
                    <div className="pt-4 text-center">
                      <p className="text-sm font-semibold tabular-nums">
                        {["09:00", "10:00", "11:00"][index]}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {["09:45", "10:45", "11:45"][index]}
                      </p>
                      <div className="mx-auto mt-3 h-6 w-px bg-border" />
                    </div>
                    <div className="min-w-0 overflow-hidden rounded-xl border border-border border-s-[3px] border-s-primary bg-card transition-shadow group-hover:shadow-md">
                      <div className="flex items-start gap-3 p-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <SubjectIcon className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-base font-semibold">{t.subject}</h3>
                            <Badge tone="primary" size="sm">
                              {t.grade}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Classroom lesson ? 45 minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={getUserImage(t.name)}
                            alt=""
                            className="size-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-medium">{t.name}</span>
                        </div>
                        <span className="rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium">
                          Room {index + 101}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            {!teachers.some((t) => grade === "all" || t.grade === grade) && (
              <div className="rounded-xl border border-dashed border-border py-10 text-center">
                <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">No lessons in this view</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose another grade to see its sample schedule.
                </p>
              </div>
            )}
          </div>
        </Card>
        <section className="vexui-card flex flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border p-5">
            <div>
              <h2 className="text-[15px] font-semibold">Campus calendar</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Upcoming school events ? Sample schedule
              </p>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="size-5" />
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 bg-muted/20 px-5 py-4">
            <div>
              <p className="text-lg font-semibold">
                October <span className="font-normal text-muted-foreground">2026</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Plan ahead for campus life</p>
            </div>
            <Badge tone="primary" size="sm">
              3 events
            </Badge>
          </div>
          <div className="flex-1 space-y-4 p-5">
            {[
              {
                title: "Parent-teacher meeting",
                day: "12",
                weekday: "MON",
                type: "Families",
                detail: "Connect with class teachers",
                color: "--primary",
              },
              {
                title: "Science fair registration",
                day: "16",
                weekday: "FRI",
                type: "Academics",
                detail: "Submit student project entries",
                color: "--info",
              },
              {
                title: "School sports day",
                day: "23",
                weekday: "FRI",
                type: "Campus life",
                detail: "Celebrate teamwork and school spirit",
                color: "--success",
              },
            ].map((event) => (
              <article
                key={event.day}
                className="flex items-start gap-4 rounded-xl border border-border p-3 transition-colors hover:bg-muted/20"
              >
                <div
                  className="w-12 shrink-0 overflow-hidden rounded-lg text-center"
                  style={{ background: `color-mix(in oklch, var(${event.color}) 8%, var(--card))` }}
                >
                  <p
                    className="py-1 text-[9px] font-semibold tracking-wider"
                    style={{ color: `var(${event.color})` }}
                  >
                    {event.weekday}
                  </p>
                  <p className="pb-2 text-2xl font-semibold leading-none">{event.day}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: `var(${event.color})` }}
                  >
                    {event.type}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold leading-5">{event.title}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-muted-foreground">{event.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
            <CalendarDays className="size-3.5" />
            <span>All dates shown in the school calendar</span>
          </div>
        </section>
      </div>
      <Card
        title="Faculty spotlight"
        description="Class teachers and subjects"
        bodyClassName="p-5"
        className="mb-6"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {teachers
            .filter((t) => grade === "all" || t.grade === grade)
            .map((t) => (
              <div key={t.name} className="flex items-center gap-4 rounded-xl bg-muted/30 p-4">
                <img
                  src={getUserImage(t.name)}
                  alt={t.name}
                  className="size-16 rounded-2xl object-cover"
                />
                <div>
                  <Badge tone="primary" size="sm">
                    {t.grade}
                  </Badge>
                  <h3 className="mt-2 text-sm font-semibold">{t.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t.subject}</p>
                </div>
              </div>
            ))}
          {!teachers.some((t) => grade === "all" || t.grade === grade) && (
            <p className="text-sm text-muted-foreground">
              No faculty records for this sample grade.
            </p>
          )}
        </div>
      </Card>
      <Card
        title="Assignment review board"
        description="Review classroom work and keep feedback moving."
        className="mb-6"
        bodyClassName="p-0"
        action={
          <Badge tone="primary">
            {assignments.filter((task) => grade === "all" || task.grade === grade).length}{" "}
            assignments
          </Badge>
        }
      >
        <div className="flex flex-wrap items-center gap-4 border-b border-border bg-muted/20 px-5 py-4">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Review progress</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {
                assignments.filter((task) => task.done && (grade === "all" || task.grade === grade))
                  .length
              }{" "}
              completed /{" "}
              {assignments.filter((task) => grade === "all" || task.grade === grade).length} in this
              view
            </p>
          </div>
          <div
            className="h-2 w-32 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Assignment review progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(
              (assignments.filter((task) => task.done && (grade === "all" || task.grade === grade))
                .length /
                Math.max(
                  assignments.filter((task) => grade === "all" || task.grade === grade).length,
                  1,
                )) *
                100,
            )}
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width:
                  (assignments.filter(
                    (task) => task.done && (grade === "all" || task.grade === grade),
                  ).length /
                    Math.max(
                      assignments.filter((task) => grade === "all" || task.grade === grade).length,
                      1,
                    )) *
                    100 +
                  "%",
              }}
            />
          </div>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-2">
          {[false, true].map((done) => {
            const tasks = assignments.filter(
              (task) => task.done === done && (grade === "all" || task.grade === grade),
            );
            const StatusIcon = done ? CheckCheck : Clock3;
            return (
              <div
                key={String(done)}
                className="min-w-0 rounded-2xl border border-border bg-muted/20 p-4"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={
                      "grid size-9 place-items-center rounded-lg " +
                      (done ? "bg-success/10 text-success" : "bg-primary/10 text-primary")
                    }
                  >
                    <StatusIcon className="size-4" />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{done ? "Reviewed" : "Needs review"}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {done ? "Feedback complete" : "Ready for teacher feedback"}
                    </p>
                  </div>
                  <span className="grid size-7 place-items-center rounded-lg border border-border bg-card text-xs font-semibold">
                    {tasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <article
                      key={task.title}
                      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {task.subject}
                          </span>
                          <Badge tone={done ? "success" : "primary"} size="sm">
                            {task.grade}
                          </Badge>
                        </div>
                        <h4 className="mt-3 text-base font-semibold">{task.title}</h4>
                        <div className="mt-4 flex items-center gap-2">
                          <img
                            src={getUserImage(
                              teachers.find((teacher) => teacher.grade === task.grade)?.name,
                            )}
                            alt=""
                            className="size-6 rounded-full object-cover"
                          />
                          <span className="text-xs text-muted-foreground">
                            {teachers.find((teacher) => teacher.grade === task.grade)?.name ??
                              "Class teacher"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/20 px-4 py-3">
                        <span
                          className={
                            "flex items-center gap-1.5 text-[11px] " +
                            (done ? "text-success" : "text-muted-foreground")
                          }
                        >
                          <StatusIcon className="size-3.5" />
                          {done ? "Reviewed" : "Awaiting feedback"}
                        </span>
                        <Button
                          variant={done ? "ghost" : "outline"}
                          size="sm"
                          onClick={() =>
                            setAssignments((current) =>
                              current.map((item) =>
                                item.title === task.title ? { ...item, done: !item.done } : item,
                              ),
                            )
                          }
                        >
                          {done ? (
                            <RotateCcw className="size-3.5" />
                          ) : (
                            <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
                          )}
                          {done ? "Reopen" : "Review"}
                        </Button>
                      </div>
                    </article>
                  ))}
                  {!tasks.length && (
                    <div className="grid min-h-40 place-items-center rounded-xl border border-dashed border-border px-4 text-center">
                      <div>
                        <StatusIcon className="mx-auto mb-2 size-7 text-muted-foreground/50" />
                        <p className="text-sm font-medium">
                          {done ? "No reviewed work yet" : "All caught up"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {done
                            ? "Reviewed assignments will appear here."
                            : "No assignments waiting in this view."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card
          title="Transport operations"
          description="Sample campus routes ? Independent of grade filters"
          bodyClassName="p-0"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border bg-primary/5 p-5">
            <div>
              <p className="text-3xl font-semibold">
                70<span className="ms-1 text-sm font-normal text-muted-foreground">/ 94 seats</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Total route occupancy</p>
            </div>
            <Badge tone="success">2 of 3 arrived</Badge>
          </div>
          <div className="divide-y divide-border px-5">
            {[
              { route: "North campus", bus: "01", seats: 24, total: 32, status: "Arrived" },
              { route: "Central park", bus: "02", seats: 28, total: 32, status: "Arrived" },
              { route: "West avenue", bus: "03", seats: 18, total: 30, status: "En route" },
            ].map((bus) => (
              <div key={bus.bus} className="flex flex-wrap items-center gap-4 py-4">
                <span className="grid size-10 place-items-center rounded-lg bg-muted text-sm font-semibold">
                  {bus.bus}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{bus.route}</p>
                  <div
                    className="mt-2 flex gap-1"
                    aria-label={bus.seats + " of " + bus.total + " seats occupied"}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <span
                        key={i}
                        className={
                          "h-2 flex-1 rounded-sm " +
                          (i < Math.round((bus.seats / bus.total) * 10) ? "bg-primary" : "bg-muted")
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="text-end">
                  <Badge tone={bus.status === "Arrived" ? "success" : "primary"} size="sm">
                    {bus.status}
                  </Badge>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {bus.seats}/{bus.total} seats
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <section className="vexui-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold">Library circulation</h2>
              <p className="mt-1 text-xs text-muted-foreground">Sample campus totals ? October 9</p>
            </div>
            <BookOpen className="size-6 text-primary" />
          </div>
          <div className="my-6 flex items-end gap-8">
            <div>
              <p className="text-4xl font-semibold">42</p>
              <p className="mt-1 text-xs text-muted-foreground">Issued today</p>
            </div>
            <div className="border-s border-border ps-8">
              <p className="text-4xl font-semibold text-primary">36</p>
              <p className="mt-1 text-xs text-muted-foreground">Returned today</p>
            </div>
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-muted">
            <span className="bg-primary" style={{ width: (36 / 42) * 100 + "%" }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">86% return-to-issue ratio today</p>
          <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upcoming returns
          </h3>
          {[
            { title: "The Science Explorer", due: "Oct 12" },
            { title: "A World of Stories", due: "Oct 14" },
          ].map((book) => (
            <div
              key={book.title}
              className="flex items-center justify-between gap-3 border-t border-border py-3"
            >
              <p className="text-sm">{book.title}</p>
              <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs">{book.due}</span>
            </div>
          ))}
        </section>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admit student</DialogTitle>
            <DialogDescription>
              Add a sample student. Fees start unpaid and attendance starts present.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={admit} className="space-y-4">
            <div>
              <Label htmlFor="school-name">Student name</Label>
              <Input
                id="school-name"
                minLength={2}
                maxLength={80}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="school-grade">Grade</Label>
              <select
                id="school-grade"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              >
                {grades.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full">
              Save student
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
