import { useState } from "react";
import {
  Users,
  CheckCheck,
  UserX,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Undo2,
  StickyNote,
  Clock3,
  Filter,
  CalendarDays,
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
import { ApexChart } from "@/components/charts/ApexChart";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";

type Status = "Present" | "Absent" | "Late" | "Excused" | "Unmarked";
type Student = {
  id: string;
  name: string;
  classId: string;
  photo: string;
  guardian: string;
  email: string;
};
type Group = { id: string; title: string; teacher: string };
type Entry = { status: Status; note: string; minutes: number };
const statuses: Status[] = ["Present", "Late", "Absent", "Excused", "Unmarked"];
const statusColor: Record<Status, string> = {
  Present: "bg-success",
  Late: "bg-warning",
  Absent: "bg-destructive",
  Excused: "bg-info",
  Unmarked: "bg-muted-foreground/30",
};
export function AttendancePage({
  students,
  classes,
  initial,
}: {
  students: Student[];
  classes: Group[];
  initial: Record<string, Exclude<Status, "Unmarked">>;
}) {
  const [date, setDate] = useState("2026-10-09");
  const [registers, setRegisters] = useState<Record<string, Record<string, Entry>>>({
    "2026-10-09": Object.fromEntries(
      Object.entries(initial).map(([id, status]) => [id, { status, note: "", minutes: 0 }]),
    ),
  });
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulk, setBulk] = useState<Status>("Present");
  const [undo, setUndo] = useState<{ date: string; entries: Record<string, Entry> } | null>(null);
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Student | null>(null);
  const [draft, setDraft] = useState<Entry>({ status: "Present", note: "", minutes: 0 });
  const [error, setError] = useState("");
  const { base } = useChartTheme();
  const register = registers[date] ?? {};
  const entry = (id: string): Entry => register[id] ?? { status: "Unmarked", note: "", minutes: 0 };
  const scope = students.filter((s) => classFilter === "All" || s.classId === classFilter);
  const count = (value: Status) => scope.filter((s) => entry(s.id).status === value).length;
  const marked = scope.length - count("Unmarked");
  const denominator = count("Present") + count("Late") + count("Absent");
  const rate = denominator
    ? Math.round(((count("Present") + count("Late")) / denominator) * 100)
    : null;
  const visible = scope.filter(
    (s) =>
      `${s.name} ${s.id} ${s.guardian}`.toLowerCase().includes(query.trim().toLowerCase()) &&
      (filter === "All" || entry(s.id).status === filter),
  );
  const attention = scope.filter((s) => ["Absent", "Late"].includes(entry(s.id).status));
  const changeDate = (value: string) => {
    setDate(value);
    setSelected([]);
    setNotice("");
  };
  const moveDate = (days: number) => {
    if (!date) return;
    const day = new Date(date + "T12:00:00Z");
    day.setUTCDate(day.getUTCDate() + days);
    changeDate(day.toISOString().slice(0, 10));
  };
  const changeEntries = (changes: Record<string, Entry>, message: string) => {
    if (!date) return;
    setUndo({ date, entries: { ...register } });
    setRegisters((prev) => ({ ...prev, [date]: { ...register, ...changes } }));
    setNotice(message);
  };
  const apply = (ids: string[], value: Status) => {
    changeEntries(
      Object.fromEntries(
        ids.map((id) => [
          id,
          { ...entry(id), status: value, minutes: value === "Late" ? entry(id).minutes : 0 },
        ]),
      ),
      `Marked ${ids.length} student${ids.length === 1 ? "" : "s"} ${value.toLowerCase()} for ${date}.`,
    );
    setSelected([]);
  };
  const donutOptions = mergeOptions(base, {
    labels: statuses,
    colors: [
      token("--success"),
      token("--warning"),
      token("--destructive"),
      token("--info"),
      token("--muted"),
    ],
    stroke: { width: 3, colors: [token("--card")] },
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "78%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Recorded",
              formatter: () => `${marked}/${scope.length}`,
            },
          },
        },
      },
    },
  });
  const exportRegister = () => {
    const rows = [
      ["Date", "ID", "Student", "Class", "Status", "Late minutes", "Note"],
      ...visible.map((s) => [
        date,
        s.id,
        s.name,
        s.classId,
        entry(s.id).status,
        String(entry(s.id).minutes),
        entry(s.id).note,
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
    a.download = `attendance-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} visible attendance records.`);
  };
  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle="A focused daily register for class attendance, exceptions, and review notes."
        breadcrumb={["Management", "School Management", "Attendance"]}
        actions={
          <Button variant="outline" disabled={!date} onClick={exportRegister}>
            <Download className="size-4" />
            Export register
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-6" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Daily attendance</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Sample academic year 2026-27 / edits last for this page session
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous attendance day"
            disabled={!date}
            onClick={() => moveDate(-1)}
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </Button>
          <Input
            aria-label="Attendance date"
            type="date"
            className="w-auto"
            value={date}
            onChange={(e) => changeDate(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            aria-label="Next attendance day"
            disabled={!date}
            onClick={() => moveDate(1)}
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Button>
          <Badge tone="info">Demo data</Badge>
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Students in scope",
            value: scope.length,
            caption: classFilter === "All" ? "All five class groups" : classFilter,
            Icon: Users,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Present / late",
            value: count("Present") + count("Late"),
            caption: `${count("Late")} late arrivals`,
            Icon: CheckCheck,
            tone: "bg-success/10 text-success",
          },
          {
            label: "Absent",
            value: count("Absent"),
            caption: `${count("Excused")} excused separately`,
            Icon: UserX,
            tone: "bg-destructive/10 text-destructive",
          },
          {
            label: "Unmarked",
            value: count("Unmarked"),
            caption: `${marked} of ${scope.length} recorded`,
            Icon: ClipboardList,
            tone: "bg-warning/10 text-warning",
          },
        ].map((s) => (
          <Card key={s.label} bodyClassName="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <span className={`grid size-10 place-items-center rounded-xl ${s.tone}`}>
                <s.Icon className="size-5" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold">{s.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.caption}</p>
          </Card>
        ))}
      </div>
      <div className="mb-6 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        <Card
          title="Daily distribution"
          description="Selected date and class scope"
          bodyClassName="p-5"
        >
          {marked || scope.length ? (
            <ApexChart
              type="donut"
              height={180}
              options={donutOptions}
              series={statuses.map(count)}
            />
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No students in this class.
            </p>
          )}
          <div className="mt-2 space-y-2">
            {statuses.map((value) => (
              <button
                key={value}
                onClick={() => {
                  setFilter(filter === value ? "All" : value);
                  setSelected([]);
                }}
                aria-pressed={filter === value}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${statusColor[value]}`} />
                  {value}
                </span>
                <span className="font-semibold">{count(value)}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs font-medium">
              Attendance rate: {rate === null ? "Not available" : `${rate}%`}
            </p>
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
              Present and late divided by present, late, and absent. Excused and unmarked records
              are excluded.
            </p>
          </div>
        </Card>
        <Card
          title="Class completion"
          description="Click a class to focus the register"
          bodyClassName="p-5"
        >
          <div className="space-y-5">
            {classes.map((c) => {
              const roster = students.filter((s) => s.classId === c.id);
              const recorded = roster.filter((s) => entry(s.id).status !== "Unmarked").length;
              return (
                <button
                  key={c.id}
                  aria-label={`Focus ${c.id}`}
                  aria-pressed={classFilter === c.id}
                  onClick={() => {
                    setClassFilter(classFilter === c.id ? "All" : c.id);
                    setSelected([]);
                  }}
                  className="block w-full text-start"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold">{c.title}</span>
                    <span className="text-muted-foreground">
                      {recorded}/{roster.length} recorded
                    </span>
                  </div>
                  <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-muted">
                    {statuses.map((value) => (
                      <span
                        key={value}
                        className={statusColor[value]}
                        style={{
                          width: `${roster.length ? (roster.filter((s) => entry(s.id).status === value).length / roster.length) * 100 : 0}%`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground">{c.teacher}</p>
                </button>
              );
            })}
          </div>
        </Card>
        <Card
          title="Needs attention"
          description="Absent students and late arrivals"
          bodyClassName="p-5"
        >
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {attention.map((s) => (
              <button
                key={s.id}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-start hover:bg-muted/40"
                onClick={() => {
                  setEditing(s);
                  setDraft(entry(s.id));
                  setError("");
                }}
              >
                <img
                  src={s.photo}
                  alt={s.name}
                  className="size-9 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold">{s.name}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {s.classId} / {entry(s.id).status}
                    {entry(s.id).minutes ? ` / ${entry(s.id).minutes} min` : ""}
                  </p>
                </div>
                <StickyNote className="size-3.5 text-muted-foreground" />
              </button>
            ))}
            {!attention.length && (
              <div className="py-6 text-center">
                <CheckCheck className="mx-auto size-8 text-success" />
                <p className="mt-3 text-xs text-muted-foreground">
                  No marked absences or late arrivals.
                </p>
              </div>
            )}
          </div>
          <p className="mt-4 text-[10px] leading-4 text-muted-foreground">
            Review notes remain local. No guardian notifications are sent.
          </p>
        </Card>
      </div>
      {notice && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-success/10 p-3">
          <p role="status" className="text-sm text-success">
            {notice}
          </p>
          {undo && undo.date === date && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRegisters((prev) => ({ ...prev, [date]: undo.entries }));
                setUndo(null);
                setNotice("Last attendance change undone.");
                setSelected([]);
              }}
            >
              <Undo2 className="size-4" />
              Undo last change
            </Button>
          )}
        </div>
      )}
      <Card
        title="Student register"
        description={`${visible.length} students in the current view`}
        action={
          <Button
            variant="outline"
            size="sm"
            disabled={!date || !visible.some((s) => entry(s.id).status === "Unmarked")}
            onClick={() =>
              apply(
                visible.filter((s) => entry(s.id).status === "Unmarked").map((s) => s.id),
                "Present",
              )
            }
          >
            Mark unmarked present
          </Button>
        }
        bodyClassName="p-0"
      >
        <div className="flex flex-wrap gap-3 border-b border-border p-5">
          <div className="relative min-w-0 flex-1 sm:min-w-52">
            <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Search school records"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected([]);
              }}
              placeholder="Search student, reference, or guardian..."
              className="ps-9"
            />
          </div>
          <select
            aria-label="Filter class"
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setSelected([]);
            }}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          >
            <option value="All">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter school status"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setSelected([]);
            }}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          >
            <option value="All">All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-border bg-primary/5 px-5 py-3">
            <span className="text-xs font-medium">{selected.length} selected</span>
            <select
              aria-label="Bulk attendance status"
              value={bulk}
              onChange={(e) => setBulk(e.target.value as Status)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs"
            >
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <Button size="sm" disabled={!date} onClick={() => apply(selected, bulk)}>
              Apply to selected
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Clear selection
            </Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  aria-label="Select visible students"
                  className="accent-primary"
                  checked={visible.length > 0 && visible.every((s) => selected.includes(s.id))}
                  onChange={(e) => setSelected(e.target.checked ? visible.map((s) => s.id) : [])}
                />
              </TableHead>
              {["Student", "Class", "Attendance", "Review notes", "Actions"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    aria-label={`Select ${s.id}`}
                    className="accent-primary"
                    checked={selected.includes(s.id)}
                    onChange={(e) =>
                      setSelected((prev) =>
                        e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id),
                      )
                    }
                  />
                </TableCell>
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
                  <select
                    aria-label={`Attendance ${s.id}`}
                    disabled={!date}
                    value={entry(s.id).status}
                    onChange={(e) => apply([s.id], e.target.value as Status)}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    {statuses.map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <p className="max-w-52 truncate text-xs text-muted-foreground">
                    {entry(s.id).note || "No review note"}
                  </p>
                  {entry(s.id).status === "Late" && entry(s.id).minutes > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-warning">
                      <Clock3 className="size-3" />
                      {entry(s.id).minutes} minutes late
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    aria-label={`Review ${s.id}`}
                    size="sm"
                    variant="outline"
                    disabled={!date}
                    onClick={() => {
                      setEditing(s);
                      setDraft({ ...entry(s.id) });
                      setError("");
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!visible.length && (
              <TableRow>
                <TableCell colSpan={6} className="p-8 text-center">
                  <Filter className="mx-auto size-6 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No students match your filters.
                  </p>
                  <Button
                    className="mt-3"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setClassFilter("All");
                      setFilter("All");
                      setSelected([]);
                    }}
                  >
                    Reset filters
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance review</DialogTitle>
            <DialogDescription>
              {editing?.id} / {date} / Local sample record
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (
                  draft.status === "Late" &&
                  (!Number.isInteger(draft.minutes) || draft.minutes < 0 || draft.minutes > 240)
                ) {
                  setError("Late minutes must be a whole number from 0 to 240.");
                  return;
                }
                changeEntries(
                  {
                    [editing.id]: {
                      ...draft,
                      note: draft.note.trim(),
                      minutes: draft.status === "Late" ? draft.minutes : 0,
                    },
                  },
                  `Attendance review saved for ${editing.name}.`,
                );
                setEditing(null);
              }}
            >
              <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-4">
                <img
                  src={editing.photo}
                  alt={editing.name}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{editing.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {editing.classId} / Guardian: {editing.guardian}
                  </p>
                </div>
              </div>
              <label className="block text-sm font-medium">
                Status
                <select
                  aria-label="Review attendance status"
                  className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}
                >
                  {statuses.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              {draft.status === "Late" && (
                <label className="block text-sm font-medium">
                  Minutes late
                  <Input
                    aria-label="Minutes late"
                    type="number"
                    min="0"
                    max="240"
                    step="1"
                    required
                    className="mt-2"
                    value={draft.minutes}
                    onChange={(e) => setDraft({ ...draft, minutes: Number(e.target.value) })}
                  />
                </label>
              )}
              <label className="block text-sm font-medium">
                Reason or review note
                <textarea
                  aria-label="Attendance note"
                  maxLength={500}
                  rows={4}
                  value={draft.note}
                  onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                  placeholder="Record an absence reason or follow-up note..."
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary"
                />
                <span className="mt-1 block text-[10px] font-normal text-muted-foreground">
                  {draft.note.length}/500 characters / session-only record
                </span>
              </label>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full">
                Save attendance review
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
