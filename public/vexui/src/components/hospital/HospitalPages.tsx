import { DoctorsPage } from "./DoctorsPage";
import { WardsPage } from "./WardsPage";
import { useState } from "react";
import {
  Hospital,
  Users,
  Stethoscope,
  CalendarDays,
  BedDouble,
  Pill,
  Ambulance,
  Receipt,
  Plus,
  Search,
  Download,
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
import {
  records,
  titles,
  options,
  patientRecords,
  money,
  invoiceTotal,
  type Kind,
  type Entry,
} from "./hospital-page-data";
import { userImages } from "@/lib/user-images";
const icons = {
  patients: Users,
  doctors: Stethoscope,
  appointments: CalendarDays,
  wards: BedDouble,
  pharmacy: Pill,
  ambulance: Ambulance,
  billing: Receipt,
};
export function HospitalPage({ kind }: { kind: Kind }) {
  return (
    <AppShell>
      {kind === "wards" ? (
        <WardsPage />
      ) : kind === "doctors" ? (
        <DoctorsPage />
      ) : (
        <Workspace key={kind} kind={kind} />
      )}
    </AppShell>
  );
}
function Workspace({ kind }: { kind: Kind }) {
  const [entries, setEntries] = useState(records[kind]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [create, setCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [units, setUnits] = useState(50);
  const [bedPatient, setBedPatient] = useState("");
  const [form, setForm] = useState({
    name: "",
    age: 30,
    contact: "",
    department: "General Medicine",
    patient: patientRecords[0].name,
    doctor: records.doctors[0].name,
    date: "2026-10-12",
    time: "09:00",
    type: "Consultation",
  });
  const active = entries.find((e) => e.id === selected);
  const visible = entries.filter(
    (e) =>
      `${e.name} ${e.id} ${e.category} ${Object.values(e.details).join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (filter === "All" || e.status === filter) &&
      (category === "All" || e.category === category),
  );
  const categories = [...new Set(entries.map((e) => e.category))];
  const Icon = icons[kind];
  const summary =
    kind === "billing"
      ? [
          ["Total billed", money(entries.reduce((n, e) => n + invoiceTotal(e), 0))],
          [
            "Sample paid",
            money(
              entries.filter((e) => e.status === "Paid").reduce((n, e) => n + invoiceTotal(e), 0),
            ),
          ],
          [
            "Outstanding",
            money(
              entries.filter((e) => e.status === "Unpaid").reduce((n, e) => n + invoiceTotal(e), 0),
            ),
          ],
          ["Invoices", entries.length],
        ]
      : kind === "pharmacy"
        ? [
            ["Catalog items", entries.length],
            ["Low stock", entries.filter((e) => e.status === "Low stock").length],
            ["Stock units", entries.reduce((n, e) => n + Number(e.details.Stock), 0)],
            ["Categories", categories.length],
          ]
        : [
            ["Total records", entries.length],
            ...options[kind]
              .slice(0, 3)
              .map((status) => [status, entries.filter((e) => e.status === status).length]),
            ...(options[kind].length < 3 ? [["Categories", categories.length]] : []),
          ];
  const tone = (status: string) =>
    ["Available", "Paid", "Completed", "In stock"].includes(status)
      ? ("success" as const)
      : ["Cleaning", "Low stock", "Maintenance", "Unpaid", "Unavailable"].includes(status)
        ? ("warning" as const)
        : ("info" as const);
  const open = (id: string) => {
    setSelected(id);
    setError("");
    setUnits(50);
    setBedPatient("");
  };
  const update = (changes: Partial<Entry>, message: string) => {
    if (!active) return;
    setEntries((prev) => prev.map((e) => (e.id === active.id ? { ...e, ...changes } : e)));
    setNotice(message);
    setSelected(null);
  };
  const exportEntries = () => {
    const keys = [...new Set(entries.flatMap((e) => Object.keys(e.details)))];
    const rows = [
      ["Reference", "Name", "Category", "Status", ...keys],
      ...visible.map((e) => [
        e.id,
        e.name,
        e.category,
        e.status,
        ...keys.map((k) => e.details[k] ?? ""),
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
    a.download = `hospital-${kind}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} filtered sample records.`);
  };
  const itemName = (entry: Entry) => (
    <div className="flex items-center gap-3">
      {entry.image ? (
        <img
          src={entry.image}
          alt={entry.name}
          className="size-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
      )}
      <div>
        <p className="font-semibold">{entry.name}</p>
        <p className="text-xs text-muted-foreground">{entry.id}</p>
      </div>
    </div>
  );
  const tableColumns =
    kind === "patients"
      ? ["Age", "Contact"]
      : kind === "appointments"
        ? ["Doctor", "Date", "Time"]
        : kind === "pharmacy"
          ? ["Stock", "Batch", "Expiry"]
          : kind === "billing"
            ? ["Date", "Net total"]
            : [];
  return (
    <>
      <PageHeader
        title={titles[kind]}
        subtitle={
          {
            patients: "Manage fictional patient directory records and visit details.",
            doctors: "Explore doctor specialties, profiles, and availability.",
            appointments: "Plan visits and manage a sample appointment queue.",
            wards: "Explore ward capacity and local sample bed assignments.",
            pharmacy: "Track catalog batches, stock levels, and inventory updates.",
            ambulance: "Review fleet availability and simulated dispatch status.",
            billing: "Review sample invoices and itemized service charges.",
          }[kind]
        }
        breadcrumb={["Management", "Hospital Management", titles[kind]]}
        actions={
          <>
            <Button variant="outline" onClick={exportEntries}>
              <Download className="size-4" />
              Export
            </Button>
            {(kind === "patients" || kind === "appointments") && (
              <Button
                onClick={() => {
                  setCreate(true);
                  setError("");
                }}
              >
                <Plus className="size-4" />
                {kind === "patients" ? "Add patient" : "Book appointment"}
              </Button>
            )}
          </>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(([label, value], i) => {
          const StatIcon = [Users, Stethoscope, CalendarDays, Hospital][i];
          return (
            <Card key={label} bodyClassName="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <span
                  className={`grid size-11 place-items-center rounded-xl ${["bg-primary/10 text-primary", "bg-success/10 text-success", "bg-info/10 text-info", "bg-warning/10 text-warning"][i]}`}
                >
                  <StatIcon className="size-5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
            </Card>
          );
        })}
      </div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-info/15 bg-info/5 p-4">
        <p className="text-xs text-muted-foreground">
          Fictional hospital workspace / 2026 sample records / edits last for this page session.
          {kind === "ambulance"
            ? " No real dispatch or emergency service is connected."
            : kind === "billing"
              ? " No payment is collected."
              : kind === "pharmacy"
                ? " Inventory only; no prescribing or dispensing workflow."
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
            aria-label="Search hospital records"
            className="ps-9"
            placeholder="Search name, specialty, or reference..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Hospital status"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          {options[kind].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="Hospital category"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          {categories.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {["patients", "appointments", "pharmacy", "billing"].includes(kind) ? (
        <Card
          title={`${titles[kind]} register`}
          description={`${visible.length} fictional records in the current view`}
          bodyClassName="p-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                {["Record", "Category", ...tableColumns, "Status", "Actions"].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{itemName(e)}</TableCell>
                  <TableCell>{e.category}</TableCell>
                  {tableColumns.map((column) => (
                    <TableCell key={column}>
                      {column === "Net total"
                        ? money(invoiceTotal(e))
                        : column === "Stock"
                          ? `${e.details.Stock} units`
                          : e.details[column]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Badge tone={tone(e.status)}>{e.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`View ${e.id}`}
                      onClick={() => open(e.id)}
                    >
                      {kind === "patients"
                        ? "View profile"
                        : kind === "appointments"
                          ? "Manage visit"
                          : kind === "pharmacy"
                            ? "Stock details"
                            : "View invoice"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!visible.length && (
                <TableRow>
                  <TableCell
                    colSpan={4 + tableColumns.length}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No records match these filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : kind === "wards" ? (
        <div className="space-y-5">
          {categories
            .filter((c) => category === "All" || category === c)
            .map((ward) => (
              <Card
                key={ward}
                title={ward}
                description={`${entries.filter((e) => e.category === ward && e.status === "Available").length} available / ${entries.filter((e) => e.category === ward).length} sample beds`}
                bodyClassName="p-5"
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {visible
                    .filter((e) => e.category === ward)
                    .map((e) => (
                      <button
                        key={e.id}
                        aria-label={`View ${e.id}`}
                        onClick={() => open(e.id)}
                        className={`rounded-xl border p-5 text-start ${e.status === "Available" ? "border-success/20 bg-success/5" : e.status === "Occupied" ? "border-primary/20 bg-primary/5" : "border-warning/20 bg-warning/5"}`}
                      >
                        <BedDouble className="size-7 text-muted-foreground" />
                        <div className="mt-4 flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">{e.name}</span>
                          <Badge tone={tone(e.status)}>{e.status}</Badge>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">{e.details.Patient}</p>
                      </button>
                    ))}
                  {!visible.some((e) => e.category === ward) && (
                    <p className="text-xs text-muted-foreground">No matching beds in this ward.</p>
                  )}
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((e) => (
            <Card key={e.id} bodyClassName="p-0">
              {e.image ? (
                <div className="relative h-48 overflow-hidden rounded-t-xl bg-muted">
                  <img src={e.image} alt={e.name} className="size-full object-cover object-top" />
                  <span className="absolute end-3 top-3">
                    <Badge tone={tone(e.status)}>{e.status}</Badge>
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between p-5">
                  <span className="grid size-12 place-items-center rounded-xl bg-info/10 text-info">
                    <Icon className="size-6" />
                  </span>
                  <Badge tone={tone(e.status)}>{e.status}</Badge>
                </div>
              )}
              <div className="p-5">
                <h2 className="text-base font-semibold">{e.name}</h2>
                <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                  {kind === "ambulance" && <MapPin className="size-3" />}
                  {e.category}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {e.details.Role ?? e.details.Crew}
                </p>
                <p className="mt-3 text-[10px] text-muted-foreground">{e.id}</p>
                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  aria-label={`View ${e.id}`}
                  onClick={() => open(e.id)}
                >
                  {kind === "doctors" ? "Doctor profile" : "Fleet details"}
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
          {!visible.length && (
            <Card>
              <p className="p-6 text-sm text-muted-foreground">No records match these filters.</p>
            </Card>
          )}
        </div>
      )}
      <Dialog
        open={!!active}
        onOpenChange={(value) => {
          if (!value) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{titles[kind]} details</DialogTitle>
            <DialogDescription>{active?.id} / Fictional sample record</DialogDescription>
          </DialogHeader>
          {active && (
            <>
              {active.image && (
                <img
                  src={active.image}
                  alt={active.name}
                  className="size-20 rounded-2xl object-cover"
                />
              )}
              <dl className="grid grid-cols-2 gap-4 rounded-xl bg-muted/40 p-4">
                {[
                  ["Name", active.name],
                  ["Category", active.category],
                  ["Status", active.status],
                  ...Object.entries(active.details),
                  ...(kind === "billing" ? [["Net total", money(invoiceTotal(active))]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium">
                      {kind === "billing" &&
                      ["Consultation", "Services", "Adjustment"].includes(label)
                        ? money(Number(value))
                        : value}
                    </dd>
                  </div>
                ))}
              </dl>
              {kind === "doctors" && (
                <Button
                  variant="outline"
                  onClick={() =>
                    update(
                      { status: active.status === "Available" ? "Unavailable" : "Available" },
                      "Sample doctor availability updated.",
                    )
                  }
                >
                  {active.status === "Available" ? "Mark unavailable" : "Mark available"}
                </Button>
              )}
              {kind === "appointments" && active.status !== "Completed" && (
                <Button
                  onClick={() =>
                    update(
                      { status: active.status === "Scheduled" ? "Checked in" : "Completed" },
                      "Sample appointment status updated.",
                    )
                  }
                >
                  {active.status === "Scheduled"
                    ? "Check in sample visit"
                    : "Complete sample visit"}
                </Button>
              )}
              {kind === "wards" &&
                (active.status === "Available" ? (
                  <>
                    <label className="block text-sm font-medium">
                      Assign fictional patient
                      <select
                        aria-label="Bed patient"
                        className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                        value={bedPatient}
                        onChange={(e) => setBedPatient(e.target.value)}
                      >
                        <option value="">Select a patient</option>
                        {patientRecords
                          .filter((p) => !entries.some((e) => e.details.Patient === p.name))
                          .map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                    </label>
                    <Button
                      disabled={!bedPatient}
                      onClick={() => {
                        if (entries.some((e) => e.details.Patient === bedPatient)) {
                          setError("This patient already has a sample bed.");
                          return;
                        }
                        update(
                          {
                            status: "Occupied",
                            details: { ...active.details, Patient: bedPatient },
                          },
                          "Fictional patient assigned to the sample bed.",
                        );
                      }}
                    >
                      Assign sample bed
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() =>
                      update(
                        {
                          status: active.status === "Occupied" ? "Cleaning" : "Available",
                          details: { ...active.details, Patient: "Not assigned" },
                        },
                        active.status === "Occupied"
                          ? "Sample bed released for cleaning."
                          : "Sample bed marked available.",
                      )
                    }
                  >
                    {active.status === "Occupied" ? "Release bed for cleaning" : "Mark available"}
                  </Button>
                ))}
              {kind === "pharmacy" && (
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!Number.isInteger(units) || units < 1 || units > 10000) {
                      setError("Enter a whole number from 1 to 10000 units.");
                      return;
                    }
                    const stock = Number(active.details.Stock) + units;
                    update(
                      {
                        status: stock < Number(active.details.Minimum) ? "Low stock" : "In stock",
                        details: { ...active.details, Stock: String(stock) },
                      },
                      `${units} sample units added to ${active.id}.`,
                    );
                  }}
                >
                  <label className="block text-sm font-medium">
                    Units to add
                    <Input
                      aria-label="Stock units"
                      type="number"
                      min="1"
                      max="10000"
                      step="1"
                      required
                      className="mt-2"
                      value={units}
                      onChange={(e) => setUnits(Number(e.target.value))}
                    />
                  </label>
                  <Button type="submit">Add sample stock</Button>
                </form>
              )}
              {kind === "ambulance" && (
                <>
                  <p className="text-xs leading-5 text-muted-foreground">
                    Simulation only. This changes a local status label and does not dispatch a
                    vehicle or contact emergency services.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      update(
                        { status: active.status === "Available" ? "On duty" : "Available" },
                        active.status === "Available"
                          ? "Simulated dispatch status set. No vehicle dispatched."
                          : "Sample vehicle marked available.",
                      )
                    }
                  >
                    {active.status === "Available" ? "Simulate dispatch" : "Mark sample available"}
                  </Button>
                </>
              )}
              {kind === "billing" && (
                <>
                  <p className="text-xs text-muted-foreground">
                    Net = consultation + services - adjustment. No payment service is connected.
                  </p>
                  <Button
                    disabled={active.status === "Paid"}
                    onClick={() =>
                      update(
                        { status: "Paid" },
                        "Sample invoice marked paid. No payment collected.",
                      )
                    }
                  >
                    Mark sample paid
                  </Button>
                </>
              )}
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{kind === "patients" ? "Add patient" : "Book appointment"}</DialogTitle>
            <DialogDescription>Create a fictional record for this page session.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              if (kind === "patients") {
                if (!form.name.trim() || !form.contact.trim()) {
                  setError("Enter the patient name and contact.");
                  return;
                }
                if (!Number.isInteger(form.age) || form.age < 0 || form.age > 120) {
                  setError("Age must be a whole number from 0 to 120.");
                  return;
                }
                const id = `PAT-${Math.max(...entries.map((e) => Number(e.id.split("-")[1]))) + 1}`;
                setEntries((prev) => [
                  ...prev,
                  {
                    id,
                    name: form.name.trim(),
                    category: form.department,
                    status: "Outpatient",
                    image: userImages.user1,
                    details: { Age: String(form.age), Contact: form.contact.trim() },
                  },
                ]);
                setNotice(`${id} added to the fictional directory.`);
                setForm({ ...form, name: "", contact: "" });
              } else {
                if (
                  entries.some(
                    (a) =>
                      a.details.Date === form.date &&
                      a.details.Time === form.time &&
                      (a.details.Doctor === form.doctor || a.name === form.patient),
                  )
                ) {
                  setError("This doctor or patient already has a sample appointment at this time.");
                  return;
                }
                const d = records.doctors.find((d) => d.name === form.doctor)!;
                if (d.status !== "Available") {
                  setError("Choose an available doctor.");
                  return;
                }
                const id = `APT-${Math.max(...entries.map((e) => Number(e.id.split("-")[1]))) + 1}`;
                setEntries((prev) => [
                  ...prev,
                  {
                    id,
                    name: form.patient,
                    category: d.category,
                    status: "Scheduled",
                    details: {
                      Doctor: form.doctor,
                      Date: form.date,
                      Time: form.time,
                      Type: form.type,
                    },
                  },
                ]);
                setNotice(`${id} booked in the sample queue.`);
              }
              setCreate(false);
            }}
          >
            {kind === "patients" ? (
              <>
                <label className="block text-sm font-medium">
                  Patient name
                  <Input
                    aria-label="Patient name"
                    required
                    maxLength={80}
                    className="mt-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Age
                  <Input
                    aria-label="Patient age"
                    type="number"
                    min="0"
                    max="120"
                    step="1"
                    required
                    className="mt-2"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Department
                  <select
                    aria-label="Patient department"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  >
                    {records.doctors.map((d) => (
                      <option key={d.id}>{d.category}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  Contact
                  <Input
                    aria-label="Patient contact"
                    required
                    maxLength={80}
                    className="mt-2"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                </label>
              </>
            ) : (
              <>
                <label className="block text-sm font-medium">
                  Patient
                  <select
                    aria-label="Appointment patient"
                    value={form.patient}
                    onChange={(e) => setForm({ ...form, patient: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  >
                    {patientRecords.map((p) => (
                      <option key={p.id}>{p.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  Doctor
                  <select
                    aria-label="Appointment doctor"
                    value={form.doctor}
                    onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  >
                    {records.doctors.map((d) => (
                      <option key={d.id} value={d.name} disabled={d.status !== "Available"}>
                        {d.name}
                        {d.status !== "Available" ? " (unavailable)" : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium">
                    Date
                    <Input
                      aria-label="Appointment date"
                      type="date"
                      required
                      className="mt-2"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Time
                    <Input
                      aria-label="Appointment time"
                      type="time"
                      required
                      className="mt-2"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium">
                  Visit type
                  <select
                    aria-label="Appointment type"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2"
                  >
                    <option>Consultation</option>
                    <option>Follow-up</option>
                  </select>
                </label>
              </>
            )}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full">
              {kind === "patients" ? "Save patient" : "Save appointment"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
