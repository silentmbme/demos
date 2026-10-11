import { AttendancePage } from "./AttendancePage";
import { useState } from "react";
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarDays,
  Plus,
  Search,
  Download,
  Clock3,
  CheckCheck,
  MapPin,
  ArrowUpRight,
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

type Kind = "students" | "classes" | "attendance" | "exams";
type Student = {
  id: string;
  name: string;
  classId: string;
  guardian: string;
  email: string;
  status: "Active" | "On leave";
  photo: string;
};
type Attendance = "Present" | "Absent" | "Late" | "Excused";
type Exam = {
  id: string;
  subject: string;
  classId: string;
  date: string;
  time: string;
  duration: number;
  room: string;
  status: "Scheduled" | "Cancelled";
};
const classes = [
  {
    id: "8-A",
    title: "Grade 8 / A",
    teacher: "Sophia Carter",
    room: "Room 201",
    capacity: 30,
    subjects: 7,
    color: "primary",
  },
  {
    id: "9-A",
    title: "Grade 9 / A",
    teacher: "Daniel Reyes",
    room: "Room 202",
    capacity: 32,
    subjects: 8,
    color: "info",
  },
  {
    id: "10-A",
    title: "Grade 10 / A",
    teacher: "Emma Wilson",
    room: "Room 301",
    capacity: 30,
    subjects: 8,
    color: "success",
  },
  {
    id: "11-A",
    title: "Grade 11 / A",
    teacher: "Noah Williams",
    room: "Room 302",
    capacity: 28,
    subjects: 6,
    color: "warning",
  },
  {
    id: "12-A",
    title: "Grade 12 / A",
    teacher: "Olivia Smith",
    room: "Room 401",
    capacity: 28,
    subjects: 6,
    color: "primary",
  },
];
const initialStudents: Student[] = [
  {
    id: "STU-101",
    name: "Ava Thompson",
    classId: "8-A",
    guardian: "Sarah Thompson",
    email: "sarah@example.com",
    status: "Active",
    photo: userImages.user1,
  },
  {
    id: "STU-102",
    name: "Liam Brown",
    classId: "8-A",
    guardian: "Michael Brown",
    email: "michael@example.com",
    status: "Active",
    photo: userImages.user2,
  },
  {
    id: "STU-103",
    name: "Emma Davis",
    classId: "9-A",
    guardian: "Laura Davis",
    email: "laura@example.com",
    status: "Active",
    photo: userImages.user3,
  },
  {
    id: "STU-104",
    name: "Noah Patel",
    classId: "9-A",
    guardian: "Priya Patel",
    email: "priya@example.com",
    status: "On leave",
    photo: userImages.user4,
  },
  {
    id: "STU-105",
    name: "Olivia Martin",
    classId: "10-A",
    guardian: "Alex Martin",
    email: "alex@example.com",
    status: "Active",
    photo: userImages.user1,
  },
  {
    id: "STU-106",
    name: "James Wilson",
    classId: "10-A",
    guardian: "Grace Wilson",
    email: "grace@example.com",
    status: "Active",
    photo: userImages.user2,
  },
  {
    id: "STU-107",
    name: "Sophia Lee",
    classId: "11-A",
    guardian: "David Lee",
    email: "david@example.com",
    status: "Active",
    photo: userImages.user3,
  },
  {
    id: "STU-108",
    name: "Ethan Miller",
    classId: "11-A",
    guardian: "Rachel Miller",
    email: "rachel@example.com",
    status: "Active",
    photo: userImages.user4,
  },
  {
    id: "STU-109",
    name: "Mia Anderson",
    classId: "12-A",
    guardian: "Lucy Anderson",
    email: "lucy@example.com",
    status: "Active",
    photo: userImages.user1,
  },
  {
    id: "STU-110",
    name: "Lucas Meyer",
    classId: "12-A",
    guardian: "Thomas Meyer",
    email: "thomas@example.com",
    status: "Active",
    photo: userImages.user2,
  },
];
const initialExams: Exam[] = [
  {
    id: "EXM-101",
    subject: "Mathematics",
    classId: "10-A",
    date: "2026-10-12",
    time: "09:00",
    duration: 90,
    room: "Hall A",
    status: "Scheduled",
  },
  {
    id: "EXM-102",
    subject: "English",
    classId: "9-A",
    date: "2026-10-13",
    time: "10:00",
    duration: 60,
    room: "Hall B",
    status: "Scheduled",
  },
  {
    id: "EXM-103",
    subject: "Science",
    classId: "8-A",
    date: "2026-10-14",
    time: "09:00",
    duration: 90,
    room: "Lab 1",
    status: "Scheduled",
  },
  {
    id: "EXM-104",
    subject: "Physics",
    classId: "11-A",
    date: "2026-10-15",
    time: "10:00",
    duration: 120,
    room: "Hall A",
    status: "Scheduled",
  },
  {
    id: "EXM-105",
    subject: "Economics",
    classId: "12-A",
    date: "2026-10-16",
    time: "09:00",
    duration: 90,
    room: "Hall B",
    status: "Scheduled",
  },
  {
    id: "EXM-106",
    subject: "History",
    classId: "10-A",
    date: "2026-10-17",
    time: "11:00",
    duration: 60,
    room: "Hall A",
    status: "Cancelled",
  },
];
const titles = {
  students: "Students",
  classes: "Classes",
  attendance: "Attendance",
  exams: "Exams",
};
const color = {
  primary: "bg-primary/10 text-primary",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};
const sampleAttendance: Record<string, Attendance> = {
  "STU-101": "Present",
  "STU-102": "Late",
  "STU-103": "Present",
  "STU-104": "Excused",
  "STU-105": "Present",
  "STU-106": "Absent",
  "STU-107": "Present",
  "STU-108": "Present",
  "STU-109": "Present",
  "STU-110": "Present",
};
function exportCsv(name: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((v) => '"' + v.replaceAll('"', '""') + '"').join(","))
    .join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
export function SchoolPage({ kind }: { kind: Kind }) {
  return (
    <AppShell>
      {kind === "attendance" ? (
        <AttendancePage students={initialStudents} classes={classes} initial={sampleAttendance} />
      ) : (
        <SchoolWorkspace key={kind} kind={kind} />
      )}
    </AppShell>
  );
}
function SchoolWorkspace({ kind }: { kind: Kind }) {
  const [students, setStudents] = useState(initialStudents);
  const [exams, setExams] = useState(initialExams);
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [date, setDate] = useState("2026-10-09");
  const [registers, setRegisters] = useState<Record<string, Record<string, Attendance>>>({
    "2026-10-09": sampleAttendance,
  });
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"student" | "exam" | null>(null);
  const [studentDetail, setStudentDetail] = useState<Student | null>(null);
  const [classDetail, setClassDetail] = useState<(typeof classes)[number] | null>(null);
  const [examDetail, setExamDetail] = useState<Exam | null>(null);
  const [error, setError] = useState("");
  const [studentForm, setStudentForm] = useState({
    name: "",
    classId: "8-A",
    guardian: "",
    email: "",
  });
  const [examForm, setExamForm] = useState({
    subject: "",
    classId: "8-A",
    date: "2026-10-19",
    time: "09:00",
    duration: 60,
    room: "Hall A",
  });
  const register = registers[date] ?? {};
  const roster = students.filter(
    (s) =>
      (classFilter === "All" || s.classId === classFilter) &&
      `${s.name} ${s.id} ${s.guardian}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const visibleStudents = roster.filter(
    (s) =>
      statusFilter === "All" ||
      (kind === "attendance" ? (register[s.id] ?? "Unmarked") : s.status) === statusFilter,
  );
  const visibleClasses = classes.filter(
    (c) =>
      (classFilter === "All" || c.id === classFilter) &&
      `${c.title} ${c.teacher}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const visibleExams = exams
    .filter(
      (e) =>
        (classFilter === "All" || e.classId === classFilter) &&
        (statusFilter === "All" || statusFilter === e.status) &&
        `${e.id} ${e.subject} ${e.room}`.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const count = (value: Attendance) => students.filter((s) => register[s.id] === value).length;
  const stats =
    kind === "students"
      ? [
          ["Sample students", students.length],
          ["Active students", students.filter((s) => s.status === "Active").length],
          ["On leave", students.filter((s) => s.status === "On leave").length],
          ["Classes", classes.length],
        ]
      : kind === "classes"
        ? [
            ["Class groups", classes.length],
            ["Enrolled sample students", students.length],
            ["Teachers", classes.length],
            ["Total capacity", classes.reduce((n, c) => n + c.capacity, 0)],
          ]
        : kind === "attendance"
          ? [
              ["Present / late", count("Present") + count("Late")],
              ["Absent", count("Absent")],
              ["Excused", count("Excused")],
              ["Unmarked", students.filter((s) => !register[s.id]).length],
            ]
          : [
              ["Planned exams", exams.filter((e) => e.status === "Scheduled").length],
              ["Subjects", new Set(exams.map((e) => e.subject)).size],
              ["Exam venues", new Set(exams.map((e) => e.room)).size],
              ["Cancelled", exams.filter((e) => e.status === "Cancelled").length],
            ];
  const mark = (id: string, value: Attendance) =>
    setRegisters((prev) => ({ ...prev, [date]: { ...(prev[date] ?? {}), [id]: value } }));
  const doExport = () => {
    if (kind === "students")
      exportCsv("students.csv", [
        ["ID", "Name", "Class", "Guardian", "Email", "Status"],
        ...visibleStudents.map((s) => [s.id, s.name, s.classId, s.guardian, s.email, s.status]),
      ]);
    if (kind === "classes")
      exportCsv("classes.csv", [
        ["Class", "Teacher", "Room", "Enrolled", "Capacity"],
        ...visibleClasses.map((c) => [
          c.title,
          c.teacher,
          c.room,
          String(students.filter((s) => s.classId === c.id).length),
          String(c.capacity),
        ]),
      ]);
    if (kind === "attendance")
      exportCsv(`attendance-${date}.csv`, [
        ["Date", "Student ID", "Name", "Class", "Status"],
        ...visibleStudents.map((s) => [
          date,
          s.id,
          s.name,
          s.classId,
          register[s.id] ?? "Unmarked",
        ]),
      ]);
    if (kind === "exams")
      exportCsv("exams.csv", [
        ["ID", "Subject", "Class", "Date", "Time", "Duration minutes", "Room", "Status"],
        ...visibleExams.map((e) => [
          e.id,
          e.subject,
          e.classId,
          e.date,
          e.time,
          String(e.duration),
          e.room,
          e.status,
        ]),
      ]);
    setNotice("Filtered sample records exported.");
  };
  return (
    <>
      <PageHeader
        title={titles[kind]}
        subtitle={
          {
            students: "Manage your student directory and guardian contacts.",
            classes: "Explore class groups, teachers, and student rosters.",
            attendance: "Review and mark the daily attendance register.",
            exams: "Plan exam schedules, venues, and class assignments.",
          }[kind]
        }
        breadcrumb={["Management", "School Management", titles[kind]]}
        actions={
          <>
            <Button variant="outline" onClick={doExport}>
              <Download className="size-4" />
              Export
            </Button>
            {(kind === "students" || kind === "exams") && (
              <Button
                onClick={() => {
                  setError("");
                  setModal(kind === "students" ? "student" : "exam");
                }}
              >
                <Plus className="size-4" />
                {kind === "students" ? "Add student" : "Schedule exam"}
              </Button>
            )}
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value], i) => {
          const Icon = [Users, CheckCheck, BookOpen, CalendarDays][i];
          return (
            <Card key={label} bodyClassName="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <span
                  className={`grid size-11 place-items-center rounded-xl ${Object.values(color)[i]}`}
                >
                  <Icon className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </Card>
          );
        })}
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-info/15 bg-info/5 p-4">
        <p className="text-xs text-muted-foreground">
          Sample academic workspace / 2026-27. Records and edits apply to this page session.
        </p>
        <Badge tone="info">Demo data</Badge>
      </div>
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Search school records"
            placeholder="Search records..."
            className="ps-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter class"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
        >
          <option value="All">All classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        {kind !== "classes" && (
          <select
            aria-label="Filter school status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          >
            {(kind === "attendance"
              ? ["All", "Unmarked", "Present", "Absent", "Late", "Excused"]
              : kind === "students"
                ? ["All", "Active", "On leave"]
                : ["All", "Scheduled", "Cancelled"]
            ).map((v) => (
              <option key={v} value={v}>
                {v === "All" ? "All statuses" : v}
              </option>
            ))}
          </select>
        )}
        {kind === "attendance" && (
          <Input
            aria-label="Attendance date"
            type="date"
            className="w-auto"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setNotice("");
            }}
          />
        )}
      </div>
      {kind === "students" && (
        <Card
          title="Student directory"
          description={`${visibleStudents.length} students in the current view`}
          bodyClassName="p-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                {["Student", "Class", "Guardian", "Status", "Actions"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleStudents.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={s.photo}
                        alt={s.name}
                        className="size-10 shrink-0 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{s.classId}</TableCell>
                  <TableCell>
                    <p>{s.guardian}</p>
                    <p className="text-xs text-muted-foreground">{s.email}</p>
                  </TableCell>
                  <TableCell>
                    <Badge tone={s.status === "Active" ? "success" : "warning"}>{s.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`View ${s.id}`}
                      onClick={() => setStudentDetail(s)}
                    >
                      View profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!visibleStudents.length && (
                <TableRow>
                  <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                    No students match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      {kind === "classes" && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleClasses.map((c) => {
            const count = students.filter((s) => s.classId === c.id).length;
            return (
              <Card key={c.id} bodyClassName="p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${color[c.color as keyof typeof color]}`}
                  >
                    <GraduationCap className="size-6" />
                  </span>
                  <Badge tone="success">Active class</Badge>
                </div>
                <h2 className="mt-4 text-lg font-semibold">{c.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">Class teacher: {c.teacher}</p>
                <div className="my-5 grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-4">
                  {[
                    ["Students", count],
                    ["Capacity", c.capacity],
                    ["Subjects", c.subjects],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="mt-1 text-lg font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sample enrollment</span>
                  <span>{Math.round((count / c.capacity) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / c.capacity) * 100}%` }}
                  />
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="size-4" />
                  {c.room}
                </p>
                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  aria-label={`Roster ${c.id}`}
                  onClick={() => setClassDetail(c)}
                >
                  Open class roster
                  <ArrowUpRight className="size-4" />
                </Button>
              </Card>
            );
          })}
          {!visibleClasses.length && (
            <Card>
              <p className="p-5 text-sm text-muted-foreground">No matching classes.</p>
            </Card>
          )}
        </div>
      )}
      {kind === "attendance" && (
        <Card
          title="Daily attendance register"
          description={`Date: ${date || "Select a date"} / ${visibleStudents.length} students in view`}
          action={
            <Button
              size="sm"
              variant="outline"
              disabled={!date || !visibleStudents.length}
              onClick={() => {
                setRegisters((prev) => ({
                  ...prev,
                  [date]: {
                    ...(prev[date] ?? {}),
                    ...Object.fromEntries(
                      visibleStudents.map((s) => [s.id, "Present" as Attendance]),
                    ),
                  },
                }));
                setNotice(`Marked ${visibleStudents.length} visible students present for ${date}.`);
              }}
            >
              Mark visible present
            </Button>
          }
          bodyClassName="p-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                {["Student", "Class", "Attendance status", "Last recorded status"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleStudents.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={s.photo}
                        alt={s.name}
                        className="size-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{s.classId}</TableCell>
                  <TableCell>
                    <select
                      aria-label={`Attendance ${s.id}`}
                      disabled={!date}
                      value={register[s.id] ?? "Unmarked"}
                      onChange={(e) => mark(s.id, e.target.value as Attendance)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    >
                      <option value="Unmarked" disabled>
                        Unmarked
                      </option>
                      {["Present", "Absent", "Late", "Excused"].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        register[s.id] === "Present"
                          ? "success"
                          : register[s.id] === "Absent"
                            ? "warning"
                            : "info"
                      }
                    >
                      {register[s.id] ?? "Unmarked"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {!visibleStudents.length && (
                <TableRow>
                  <TableCell colSpan={4} className="p-8 text-center text-muted-foreground">
                    No students match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
      {kind === "exams" && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleExams.map((e) => (
            <Card key={e.id} bodyClassName="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="size-6" />
                </span>
                <Badge tone={e.status === "Scheduled" ? "success" : "muted"}>{e.status}</Badge>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                {e.id} / {e.classId}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{e.subject}</h2>
              <div className="my-5 space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  {e.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4 text-muted-foreground" />
                  {e.time} / {e.duration} minutes
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  {e.room}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                aria-label={`Exam ${e.id}`}
                onClick={() => setExamDetail(e)}
              >
                Exam details
                <ArrowUpRight className="size-4" />
              </Button>
            </Card>
          ))}
          {!visibleExams.length && (
            <Card>
              <p className="p-5 text-sm text-muted-foreground">No exams match these filters.</p>
            </Card>
          )}
        </div>
      )}
      <Dialog
        open={!!modal}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modal === "student" ? "Add student" : "Schedule exam"}</DialogTitle>
            <DialogDescription>Creates a sample record for this page session.</DialogDescription>
          </DialogHeader>
          {modal === "student" ? (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!studentForm.name.trim() || !studentForm.guardian.trim()) {
                  setError("Enter the student and guardian names.");
                  return;
                }
                const group = classes.find((c) => c.id === studentForm.classId)!;
                if (students.filter((s) => s.classId === group.id).length >= group.capacity) {
                  setError("This class is at capacity.");
                  return;
                }
                const id = `STU-${Math.max(...students.map((s) => Number(s.id.split("-")[1]))) + 1}`;
                setStudents((prev) => [
                  ...prev,
                  {
                    ...studentForm,
                    name: studentForm.name.trim(),
                    guardian: studentForm.guardian.trim(),
                    id,
                    status: "Active",
                    photo: userImages.user1,
                  },
                ]);
                setNotice(`${id} added to the sample directory.`);
                setModal(null);
                setStudentForm({ name: "", guardian: "", email: "", classId: "8-A" });
              }}
            >
              <label className="block text-sm font-medium">
                Student name
                <Input
                  aria-label="Student name"
                  required
                  maxLength={80}
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="mt-2"
                />
              </label>
              <label className="block text-sm font-medium">
                Class
                <select
                  aria-label="Student class"
                  className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  value={studentForm.classId}
                  onChange={(e) => setStudentForm({ ...studentForm, classId: e.target.value })}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Guardian name
                <Input
                  aria-label="Guardian name"
                  required
                  maxLength={80}
                  className="mt-2"
                  value={studentForm.guardian}
                  onChange={(e) => setStudentForm({ ...studentForm, guardian: e.target.value })}
                />
              </label>
              <label className="block text-sm font-medium">
                Guardian email
                <Input
                  aria-label="Guardian email"
                  type="email"
                  required
                  maxLength={120}
                  className="mt-2"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                />
              </label>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full">
                Add student
              </Button>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  !examForm.subject.trim() ||
                  !examForm.room.trim() ||
                  !Number.isInteger(examForm.duration) ||
                  examForm.duration < 30 ||
                  examForm.duration > 180
                ) {
                  setError("Enter a subject, venue, and a duration from 30 to 180 minutes.");
                  return;
                }
                const minutes = (time: string) =>
                  Number(time.split(":")[0]) * 60 + Number(time.split(":")[1]);
                const start = minutes(examForm.time);
                if (start + examForm.duration > 1440) {
                  setError("The exam must finish on the selected date.");
                  return;
                }
                if (
                  exams.some(
                    (x) =>
                      x.status === "Scheduled" &&
                      x.date === examForm.date &&
                      (x.classId === examForm.classId ||
                        x.room.toLowerCase() === examForm.room.trim().toLowerCase()) &&
                      start < minutes(x.time) + x.duration &&
                      start + examForm.duration > minutes(x.time),
                  )
                ) {
                  setError("This time overlaps a scheduled exam for the same class or venue.");
                  return;
                }
                const id = `EXM-${Math.max(...exams.map((x) => Number(x.id.split("-")[1]))) + 1}`;
                setExams((prev) => [
                  ...prev,
                  {
                    ...examForm,
                    subject: examForm.subject.trim(),
                    room: examForm.room.trim(),
                    id,
                    status: "Scheduled",
                  },
                ]);
                setNotice(`${id} scheduled in the sample planner.`);
                setModal(null);
              }}
            >
              <label className="block text-sm font-medium">
                Subject
                <Input
                  aria-label="Exam subject"
                  required
                  maxLength={80}
                  className="mt-2"
                  value={examForm.subject}
                  onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                />
              </label>
              <label className="block text-sm font-medium">
                Class
                <select
                  aria-label="Exam class"
                  className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  value={examForm.classId}
                  onChange={(e) => setExamForm({ ...examForm, classId: e.target.value })}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium">
                  Date
                  <Input
                    aria-label="Exam date"
                    type="date"
                    required
                    className="mt-2"
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Start time
                  <Input
                    aria-label="Exam time"
                    type="time"
                    required
                    className="mt-2"
                    value={examForm.time}
                    onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
                  />
                </label>
              </div>
              <label className="block text-sm font-medium">
                Duration (minutes)
                <Input
                  aria-label="Exam duration"
                  type="number"
                  min="30"
                  max="180"
                  step="1"
                  required
                  className="mt-2"
                  value={examForm.duration}
                  onChange={(e) => setExamForm({ ...examForm, duration: Number(e.target.value) })}
                />
              </label>
              <label className="block text-sm font-medium">
                Venue
                <Input
                  aria-label="Exam venue"
                  required
                  maxLength={60}
                  className="mt-2"
                  value={examForm.room}
                  onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
                />
              </label>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full">
                Schedule exam
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!studentDetail}
        onOpenChange={(open) => {
          if (!open) setStudentDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student profile</DialogTitle>
            <DialogDescription>{studentDetail?.id} / Sample directory record</DialogDescription>
          </DialogHeader>
          {studentDetail && (
            <>
              <div className="flex items-center gap-4">
                <img
                  src={studentDetail.photo}
                  alt={studentDetail.name}
                  className="size-16 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{studentDetail.name}</h3>
                  <Badge tone="info">{studentDetail.classId}</Badge>
                </div>
              </div>
              <dl className="space-y-4 rounded-xl bg-muted/40 p-4">
                {[
                  ["Guardian", studentDetail.guardian],
                  ["Email", studentDetail.email],
                  ["Enrollment", studentDetail.status],
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
                  const status = studentDetail.status === "Active" ? "On leave" : "Active";
                  setStudents((prev) =>
                    prev.map((s) => (s.id === studentDetail.id ? { ...s, status } : s)),
                  );
                  setStudentDetail({ ...studentDetail, status });
                  setNotice(`${studentDetail.id} enrollment status updated.`);
                }}
              >
                {studentDetail.status === "Active" ? "Mark on leave" : "Mark active"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!classDetail}
        onOpenChange={(open) => {
          if (!open) setClassDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{classDetail?.title} roster</DialogTitle>
            <DialogDescription>
              {classDetail?.teacher} / {classDetail?.room}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 space-y-3 overflow-y-auto">
            {students
              .filter((s) => s.classId === classDetail?.id)
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  <img src={s.photo} alt={s.name} className="size-10 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.id}</p>
                  </div>
                  <Badge tone="info">{s.status}</Badge>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!examDetail}
        onOpenChange={(open) => {
          if (!open) setExamDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{examDetail?.subject} exam</DialogTitle>
            <DialogDescription>{examDetail?.id} / Sample schedule</DialogDescription>
          </DialogHeader>
          {examDetail && (
            <>
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/40 p-4">
                {[
                  ["Class", examDetail.classId],
                  ["Date", examDetail.date],
                  ["Time", examDetail.time],
                  ["Duration", `${examDetail.duration} min`],
                  ["Venue", examDetail.room],
                  ["Status", examDetail.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {examDetail.status === "Scheduled" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setExams((prev) =>
                      prev.map((x) => (x.id === examDetail.id ? { ...x, status: "Cancelled" } : x)),
                    );
                    setExamDetail({ ...examDetail, status: "Cancelled" });
                    setNotice(`${examDetail.id} cancelled in this session.`);
                  }}
                >
                  Cancel sample exam
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This sample exam is cancelled. Create a new schedule to plan it again.
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
