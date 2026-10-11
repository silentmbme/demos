import { useState } from "react";
import {
  BedDouble,
  Building2,
  CheckCheck,
  Sparkles,
  Search,
  Download,
  LayoutGrid,
  List,
  ArrowRightLeft,
  Users,
  Clock3,
  Wrench,
  ArrowUpRight,
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
import { records, patientRecords } from "./hospital-page-data";

type Status = "Available" | "Occupied" | "Cleaning" | "Maintenance";
type Bed = {
  id: string;
  ward: string;
  floor: string;
  room: string;
  status: Status;
  patientId: string;
  notes: string;
};
const statuses: Status[] = ["Available", "Occupied", "Cleaning", "Maintenance"];
const colors: Record<Status, string> = {
  Available: "border-success/25 bg-success/5 text-success",
  Occupied: "border-primary/25 bg-primary/5 text-primary",
  Cleaning: "border-warning/25 bg-warning/5 text-warning",
  Maintenance: "border-border bg-muted/50 text-muted-foreground",
};
const dots: Record<Status, string> = {
  Available: "bg-success",
  Occupied: "bg-primary",
  Cleaning: "bg-warning",
  Maintenance: "bg-muted-foreground",
};
export function WardsPage() {
  const [beds, setBeds] = useState<Bed[]>(() =>
    records.wards.map((e, i) => ({
      id: e.id,
      ward: e.category,
      floor: e.details.Floor,
      room: `${e.details.Floor}0${i % 4 < 2 ? 1 : 2}`,
      status: e.status as Status,
      patientId: patientRecords.find((p) => p.name === e.details.Patient)?.id ?? "",
      notes: "",
    })),
  );
  const [floor, setFloor] = useState("All");
  const [ward, setWard] = useState("All");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("map");
  const [selected, setSelected] = useState<string | null>(null);
  const [patientId, setPatientId] = useState("");
  const [transferId, setTransferId] = useState("");
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState<{ id: number; text: string; time: string }[]>([]);
  const patient = (id: string) => patientRecords.find((p) => p.id === id);
  const active = beds.find((b) => b.id === selected);
  const scope = beds.filter((b) => floor === "All" || b.floor === floor);
  const visible = scope.filter(
    (b) =>
      (ward === "All" || b.ward === ward) &&
      (status === "All" || b.status === status) &&
      `${b.id} ${b.ward} ${b.room} ${patient(b.patientId)?.name ?? ""}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const count = (value: Status) => scope.filter((b) => b.status === value).length;
  const rate = scope.length ? Math.round((count("Occupied") / scope.length) * 100) : 0;
  const record = (message: string) => {
    setNotice(message);
    setEvents((prev) =>
      [
        {
          id: Date.now() + Math.random(),
          text: message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ].slice(0, 5),
    );
    setError("");
  };
  const open = (id: string) => {
    const bed = beds.find((b) => b.id === id)!;
    setSelected(id);
    setPatientId("");
    setTransferId("");
    setNote(bed.notes);
    setError("");
  };
  const changeStatus = (value: Status) => {
    if (!active) return;
    setBeds((prev) =>
      prev.map((b) =>
        b.id === active.id
          ? { ...b, status: value, patientId: value === "Occupied" ? b.patientId : "" }
          : b,
      ),
    );
    record(`${active.id} marked ${value.toLowerCase()} in the sample layout.`);
  };
  const exportBeds = () => {
    const rows = [
      ["Bed", "Ward", "Floor", "Room", "Status", "Patient", "Note"],
      ...visible.map((b) => [
        b.id,
        b.ward,
        b.floor,
        b.room,
        b.status,
        patient(b.patientId)?.name ?? "",
        b.notes,
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
    a.download = "sample-ward-layout.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} visible beds.`);
  };
  return (
    <>
      <PageHeader
        title="Wards & Beds"
        subtitle="Explore floors, review occupancy, and manage a fictional bed allocation workspace."
        breadcrumb={["Management", "Hospital Management", "Wards & Beds"]}
        actions={
          <Button variant="outline" onClick={exportBeds}>
            <Download className="size-4" />
            Export layout
          </Button>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total beds",
            value: scope.length,
            caption: floor === "All" ? "Across three sample floors" : `Floor ${floor}`,
            Icon: BedDouble,
            tone: "bg-info/10 text-info",
          },
          {
            label: "Available",
            value: count("Available"),
            caption: "Ready for sample assignment",
            Icon: CheckCheck,
            tone: "bg-success/10 text-success",
          },
          {
            label: "Occupied",
            value: count("Occupied"),
            caption: `${rate}% of total beds in floor scope`,
            Icon: Users,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Turnaround & maintenance",
            value: count("Cleaning") + count("Maintenance"),
            caption: `${count("Cleaning")} cleaning / ${count("Maintenance")} maintenance`,
            Icon: Sparkles,
            tone: "bg-warning/10 text-warning",
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
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {["1", "2", "3"].map((value) => {
          const group = beds.filter((b) => b.floor === value);
          const occupied = group.filter((b) => b.status === "Occupied").length;
          return (
            <button
              key={value}
              aria-label={`Floor ${value}`}
              aria-pressed={floor === value}
              onClick={() => {
                setFloor(floor === value ? "All" : value);
                setWard("All");
              }}
              className={`rounded-2xl border bg-card p-5 text-start ${floor === value ? "border-primary ring-1 ring-primary/20" : "border-border hover:border-primary/30"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Building2 className="size-4 text-primary" />
                  Floor {value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {group.filter((b) => b.status === "Available").length} available
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{group[0].ward}</p>
              <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-muted">
                {statuses.map((s) => (
                  <span
                    key={s}
                    className={dots[s]}
                    style={{
                      width: `${(group.filter((b) => b.status === s).length / group.length) * 100}%`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                {occupied}/{group.length} occupied
              </p>
            </button>
          );
        })}
      </div>
      {notice && (
        <p role="status" className="mb-5 rounded-xl bg-success/10 p-3 text-sm text-success">
          {notice}
        </p>
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div>
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="relative min-w-0 flex-1 sm:min-w-48">
              <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
              <Input
                aria-label="Search hospital records"
                className="ps-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bed, room, ward, or patient..."
              />
            </div>
            <select
              aria-label="Ward filter"
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="All">All wards</option>
              {[...new Set(scope.map((b) => b.ward))].map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
            <select
              aria-label="Hospital status"
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All statuses</option>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <div className="flex rounded-lg border border-border bg-card p-1">
              <Button
                variant={view === "map" ? "default" : "ghost"}
                size="sm"
                aria-label="Bed map view"
                aria-pressed={view === "map"}
                onClick={() => setView("map")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                aria-label="Bed list view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
            {statuses.map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${dots[s]}`} />
                {s}
              </span>
            ))}
            <span>{visible.length} beds shown</span>
            {floor !== "All" && (
              <button
                className="text-primary"
                onClick={() => {
                  setFloor("All");
                  setWard("All");
                }}
              >
                Show all floors
              </button>
            )}
          </div>
          {view === "map" ? (
            <div className="space-y-5">
              {[...new Set(visible.map((b) => b.ward))].map((w) => {
                const group = visible.filter((b) => b.ward === w);
                return (
                  <Card
                    key={w}
                    title={w}
                    description={`Floor ${group[0].floor} / ${group.length} visible beds`}
                    action={<Badge tone="info">Sample floor plan</Badge>}
                    bodyClassName="p-5"
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      {[...new Set(group.map((b) => b.room))].map((room) => (
                        <div
                          key={room}
                          className="rounded-2xl border border-dashed border-border bg-muted/20 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <p className="text-xs font-semibold">Room {room}</p>
                            <span className="text-[10px] text-muted-foreground">2-bed room</span>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {group
                              .filter((b) => b.room === room)
                              .map((b) => (
                                <button
                                  key={b.id}
                                  aria-label={`View ${b.id}`}
                                  onClick={() => open(b.id)}
                                  className={`min-h-40 rounded-xl border p-4 text-start transition-shadow hover:shadow-sm ${colors[b.status]}`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <BedDouble className="size-7" />
                                    <ArrowUpRight className="size-3.5" />
                                  </div>
                                  <p className="mt-4 text-sm font-semibold text-foreground">
                                    {b.id}
                                  </p>
                                  <p className="mt-1 text-[11px] font-medium">{b.status}</p>
                                  <div className="mt-3 flex items-center gap-2">
                                    {patient(b.patientId)?.image && (
                                      <img
                                        src={patient(b.patientId)!.image}
                                        alt={patient(b.patientId)!.name}
                                        className="size-6 rounded-full object-cover"
                                      />
                                    )}
                                    <span className="text-[10px] text-muted-foreground">
                                      {patient(b.patientId)?.name ??
                                        (b.status === "Available"
                                          ? "Ready for assignment"
                                          : b.status === "Cleaning"
                                            ? "Turnaround pending"
                                            : "Out of service")}
                                    </span>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 rounded-lg bg-muted/40 px-3 py-2 text-center text-[10px] text-muted-foreground">
                      Shared corridor / illustrative layout, not a building plan
                    </p>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card title="Bed inventory" bodyClassName="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["Bed", "Ward / room", "Patient", "Status", "Actions"].map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-semibold">{b.id}</TableCell>
                      <TableCell>
                        <p>{b.ward}</p>
                        <p className="text-xs text-muted-foreground">
                          Floor {b.floor} / Room {b.room}
                        </p>
                      </TableCell>
                      <TableCell>{patient(b.patientId)?.name ?? "Not assigned"}</TableCell>
                      <TableCell>
                        <Badge
                          tone={
                            b.status === "Available"
                              ? "success"
                              : b.status === "Occupied"
                                ? "primary"
                                : "warning"
                          }
                        >
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          aria-label={`View ${b.id}`}
                          onClick={() => open(b.id)}
                        >
                          Manage bed
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
          {!visible.length && (
            <Card bodyClassName="p-8 text-center">
              <p className="text-sm text-muted-foreground">No beds match your filters.</p>
              <Button
                className="mt-3"
                variant="outline"
                onClick={() => {
                  setFloor("All");
                  setWard("All");
                  setStatus("All");
                  setQuery("");
                }}
              >
                Reset filters
              </Button>
            </Card>
          )}
        </div>
        <div className="space-y-5">
          <Card
            title="Turnaround queue"
            description="Cleaning beds in the selected floor scope"
            bodyClassName="p-5"
          >
            <div className="space-y-3">
              {scope
                .filter((b) => b.status === "Cleaning")
                .map((b) => (
                  <div key={b.id} className="rounded-xl border border-warning/20 bg-warning/5 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{b.id}</span>
                      <Sparkles className="size-4 text-warning" />
                    </div>
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      {b.ward} / Room {b.room}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 w-full"
                      aria-label={`Clean ${b.id}`}
                      onClick={() => {
                        setBeds((prev) =>
                          prev.map((e) => (e.id === b.id ? { ...e, status: "Available" } : e)),
                        );
                        record(`${b.id} sample cleaning completed; bed marked available.`);
                      }}
                    >
                      Complete sample cleaning
                    </Button>
                  </div>
                ))}
              {!scope.some((b) => b.status === "Cleaning") && (
                <p className="py-4 text-xs text-muted-foreground">No beds awaiting cleaning.</p>
              )}
            </div>
          </Card>
          <Card title="Session activity" bodyClassName="p-5">
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex gap-2">
                  <Clock3 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs leading-5">{event.text}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
              {!events.length && (
                <p className="text-xs text-muted-foreground">Bed updates appear here.</p>
              )}
            </div>
          </Card>
          <p className="px-1 text-[10px] leading-5 text-muted-foreground">
            All patients and assignments are fictional. Changes apply to this page session only and
            do not update admissions or hospital systems.
          </p>
        </div>
      </div>
      <Dialog
        open={!!active}
        onOpenChange={(value) => {
          if (!value) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage {active?.id}</DialogTitle>
            <DialogDescription>
              {active?.ward} / Floor {active?.floor} / Room {active?.room} / Sample bed
            </DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <div
                className={`flex items-center justify-between rounded-xl border p-4 ${colors[active.status]}`}
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <BedDouble className="size-6" />
                  {active.status}
                </span>
                <span className="text-xs">
                  {patient(active.patientId)?.name ?? "No patient assigned"}
                </span>
              </div>
              {active.status === "Available" && (
                <>
                  <label className="block text-sm font-medium">
                    Fictional patient
                    <select
                      aria-label="Bed patient"
                      className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    >
                      <option value="">Select an unassigned patient</option>
                      {patientRecords
                        .filter((p) => !beds.some((b) => b.patientId === p.id))
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      disabled={!patientId}
                      onClick={() => {
                        if (beds.some((b) => b.patientId === patientId)) {
                          setError("This patient already has a sample bed.");
                          return;
                        }
                        setBeds((prev) =>
                          prev.map((b) =>
                            b.id === active.id ? { ...b, status: "Occupied", patientId } : b,
                          ),
                        );
                        record(
                          `${patient(patientId)?.name} assigned to ${active.id} in the sample layout.`,
                        );
                        setPatientId("");
                      }}
                    >
                      Assign sample bed
                    </Button>
                    <Button variant="outline" onClick={() => changeStatus("Maintenance")}>
                      <Wrench className="size-4" />
                      Mark maintenance
                    </Button>
                  </div>
                </>
              )}
              {active.status === "Occupied" && (
                <>
                  <label className="block text-sm font-medium">
                    Transfer to an available bed
                    <select
                      aria-label="Transfer bed"
                      value={transferId}
                      onChange={(e) => setTransferId(e.target.value)}
                      className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                    >
                      <option value="">Select destination bed</option>
                      {beds
                        .filter((b) => b.status === "Available")
                        .map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.id} / {b.ward} / Room {b.room}
                          </option>
                        ))}
                    </select>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      disabled={!transferId}
                      onClick={() => {
                        const target = beds.find((b) => b.id === transferId);
                        if (!target || target.status !== "Available") {
                          setError("Choose an available destination bed.");
                          return;
                        }
                        setBeds((prev) =>
                          prev.map((b) =>
                            b.id === active.id
                              ? { ...b, status: "Cleaning", patientId: "" }
                              : b.id === target.id
                                ? { ...b, status: "Occupied", patientId: active.patientId }
                                : b,
                          ),
                        );
                        record(
                          `Sample transfer completed from ${active.id} to ${target.id}; source bed needs cleaning.`,
                        );
                        setTransferId("");
                      }}
                    >
                      <ArrowRightLeft className="size-4" />
                      Transfer sample patient
                    </Button>
                    <Button variant="outline" onClick={() => changeStatus("Cleaning")}>
                      Release bed for cleaning
                    </Button>
                  </div>
                </>
              )}
              {active.status === "Cleaning" && (
                <Button onClick={() => changeStatus("Available")}>
                  <Sparkles className="size-4" />
                  Complete sample cleaning
                </Button>
              )}
              {active.status === "Maintenance" && (
                <Button variant="outline" onClick={() => changeStatus("Available")}>
                  Return sample bed to service
                </Button>
              )}
              <label className="block text-sm font-medium">
                Bed note
                <textarea
                  aria-label="Bed note"
                  rows={3}
                  maxLength={500}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a local housekeeping or allocation note..."
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-card p-3 text-sm"
                />
              </label>
              <Button
                variant="outline"
                onClick={() => {
                  setBeds((prev) =>
                    prev.map((b) => (b.id === active.id ? { ...b, notes: note.trim() } : b)),
                  );
                  record(`Note saved for ${active.id}.`);
                }}
              >
                Save bed note
              </Button>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground">
                Assignments, transfers, and service states update the local sample layout only.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
