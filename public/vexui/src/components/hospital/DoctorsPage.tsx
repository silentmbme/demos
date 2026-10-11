import { useState } from "react";
import {
  Stethoscope,
  Users,
  CalendarDays,
  Clock3,
  Search,
  Download,
  LayoutGrid,
  List,
  Bookmark,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
  CheckCheck,
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
import {
  HOSPITAL_DOCTORS,
  HOSPITAL_APPOINTMENTS,
  type HospitalAppointment,
} from "@/data/hospital-dashboard-data";
import { patientRecords } from "./hospital-page-data";

type Doctor = {
  id: string;
  name: string;
  image: string;
  department: string;
  role: string;
  available: boolean;
  experience: number;
  room: string;
  email: string;
  phone: string;
  bio: string;
};
const slots = Array.from(
  { length: 12 },
  (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
);
const today = (() => {
  const localDate = new Date();
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().slice(0, 10);
})();
export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(() =>
    HOSPITAL_DOCTORS.map((d, i) => ({
      id: d.id,
      name: d.name,
      image: d.image,
      department: d.department,
      role: d.role,
      available: d.available,
      experience: [14, 12, 9, 16][i] ?? 0,
      room: `Clinic ${i + 1} / Floor ${i < 2 ? 1 : 2}`,
      email: `${d.name.replace("Dr. ", "").toLowerCase().replace(" ", ".")}@example.com`,
      phone: `+1 202-555-01${20 + i}`,
      bio: `Fictional ${d.role.toLowerCase()} profile for the ${d.department.toLowerCase()} team. Contact details and experience are sample data.`,
    })),
  );
  const [appointments, setAppointments] = useState<HospitalAppointment[]>(HOSPITAL_APPOINTMENTS);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState<"name" | "experience" | "specialty">("name");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [tab, setTab] = useState("Overview");
  const [date, setDate] = useState("2026-10-09");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    patientId: patientRecords[0]?.id ?? "",
    date: "2026-10-12",
    time: "09:00",
    type: "Consultation",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const visible = doctors
    .filter(
      (d) =>
        `${d.name} ${d.department} ${d.role} ${d.room}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (specialty === "All" || d.department === specialty) &&
        (availability === "All" || (availability === "Available") === d.available) &&
        (!savedOnly || saved.includes(d.id)),
    )
    .sort((a, b) =>
      sort === "experience"
        ? b.experience - a.experience
        : sort === "specialty"
          ? a.department.localeCompare(b.department)
          : a.name.localeCompare(b.name),
    );
  const active = doctors.find((d) => d.id === profileId);
  const bookingDoctor = doctors.find((d) => d.id === bookingId);
  const specialties = [...new Set(doctors.map((d) => d.department))];
  const visits = (id: string) => appointments.filter((a) => a.doctorId === id && a.date === date);
  const openProfile = (id: string) => {
    setProfileId(id);
    setTab("Overview");
  };
  const book = (id: string, time?: string) => {
    const bookingDate = date && date >= today ? date : today;
    const patient = patientRecords.find((item) => item.id === form.patientId);
    const availableTime = (candidate: string) =>
      !appointments.some(
        (appointment) =>
          appointment.date === bookingDate &&
          appointment.time === candidate &&
          (appointment.doctorId === id || appointment.patient === patient?.name),
      );
    setProfileId(null);
    setBookingId(id);
    setError("");
    setForm({
      ...form,
      date: bookingDate,
      time: time && availableTime(time) ? time : slots.find(availableTime) ?? "09:00",
    });
  };
  const exportDoctors = () => {
    const rows = [
      [
        "ID",
        "Name",
        "Specialty",
        "Role",
        "Availability",
        "Sample experience years",
        "Clinic",
        "Email",
        "Phone",
      ],
      ...visible.map((d) => [
        d.id,
        d.name,
        d.department,
        d.role,
        d.available ? "Available" : "Unavailable",
        String(d.experience),
        d.room,
        d.email,
        d.phone,
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
    a.download = "sample-doctor-directory.csv";
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Exported ${visible.length} doctor profiles.`);
  };
  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  return (
    <>
      <PageHeader
        title="Doctors"
        subtitle="Explore your medical team, review specialties, and manage sample appointment availability."
        breadcrumb={["Management", "Hospital Management", "Doctors"]}
        actions={
          <Button variant="outline" onClick={exportDoctors}>
            <Download className="size-4" />
            Export directory
          </Button>
        }
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Doctor profiles",
            value: doctors.length,
            caption: "Fictional medical team",
            Icon: Stethoscope,
            tone: "bg-primary/10 text-primary",
          },
          {
            label: "Available doctors",
            value: doctors.filter((d) => d.available).length,
            caption: "Local availability preference",
            Icon: CheckCheck,
            tone: "bg-success/10 text-success",
          },
          {
            label: "Specialties",
            value: specialties.length,
            caption: "Clinical teams represented",
            Icon: Users,
            tone: "bg-info/10 text-info",
          },
          {
            label: "Visits on selected date",
            value: appointments.filter((a) => a.date === date).length,
            caption: date || "Select a schedule date",
            Icon: CalendarDays,
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
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {specialties.map((value) => {
          const group = doctors.filter((d) => d.department === value);
          return (
            <button
              key={value}
              aria-label={`Specialty ${value}`}
              aria-pressed={specialty === value}
              onClick={() => setSpecialty(specialty === value ? "All" : value)}
              className={`rounded-xl border bg-card p-4 text-start ${specialty === value ? "border-primary ring-1 ring-primary/20" : "border-border hover:bg-muted/30"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{value}</p>
                <Stethoscope className="size-4 text-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {group.length} doctor / {group.filter((d) => d.available).length} available
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Doctor directory</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {visible.length} profiles / portraits, experience, and contact details are illustrative
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={savedOnly ? "default" : "outline"}
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((v) => !v)}
          >
            <Bookmark className="size-4" />
            Saved ({saved.length})
          </Button>
          <div className="flex rounded-lg border border-border bg-card p-1">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              aria-label="Doctor grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              aria-label="Doctor list view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-0 flex-1 sm:min-w-48">
          <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Search hospital records"
            className="ps-9"
            placeholder="Search doctor, specialty, or clinic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Doctor specialty"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          <option value="All">All specialties</option>
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="Hospital status"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="All">All availability</option>
          <option>Available</option>
          <option>Unavailable</option>
        </select>
        <select
          aria-label="Sort doctors"
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as "name" | "experience" | "specialty")}
        >
          <option value="name">Name A-Z</option>
          <option value="experience">Sample experience</option>
          <option value="specialty">Specialty</option>
        </select>
        <Input
          aria-label="Doctor schedule date"
          type="date"
          className="w-auto"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {visible.length ? (
        view === "grid" ? (
          <div className="grid gap-5 md:grid-cols-3 2xl:grid-cols-4">
            {visible.map((d) => (
              <Card key={d.id} bodyClassName="p-0">
                <div className="relative h-56 overflow-hidden rounded-t-xl bg-muted">
                  <img src={d.image} alt={d.name} className="size-full object-cover object-top" />
                  <span className="absolute start-3 top-3">
                    <Badge tone={d.available ? "success" : "warning"}>
                      {d.available ? "Available" : "Unavailable"}
                    </Badge>
                  </span>
                  <button
                    aria-label={`Save ${d.id}`}
                    aria-pressed={saved.includes(d.id)}
                    onClick={() => toggleSaved(d.id)}
                    className="absolute end-3 top-3 grid size-8 place-items-center rounded-full bg-card/90 text-primary shadow-sm"
                  >
                    <Bookmark className={`size-4 ${saved.includes(d.id) ? "fill-current" : ""}`} />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold text-primary">{d.department}</p>
                  <h3 className="mt-1 text-lg font-semibold">{d.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{d.role}</p>
                  <div className="my-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Sample experience</p>
                      <p className="mt-1 text-sm font-semibold">{d.experience} years</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Visits on date</p>
                      <p className="mt-1 text-sm font-semibold">{visits(d.id).length}</p>
                    </div>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="size-4" />
                    {d.room}
                  </p>
                  <p className="mt-3 flex items-center gap-2 break-all text-xs text-muted-foreground">
                    <Mail className="size-4 shrink-0" />
                    {d.email}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`View ${d.id}`}
                      onClick={() => openProfile(d.id)}
                    >
                      Profile
                      <ArrowUpRight className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      aria-label={`Book ${d.id}`}
                      disabled={!d.available || !date}
                      onClick={() => book(d.id)}
                    >
                      Book sample
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
                    "Doctor",
                    "Specialty",
                    "Clinic",
                    "Availability",
                    "Visits on date",
                    "Actions",
                  ].map((h) => (
                    <TableHead key={h}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={d.image}
                          alt={d.name}
                          className="size-11 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{d.department}</TableCell>
                    <TableCell>{d.room}</TableCell>
                    <TableCell>
                      <Badge tone={d.available ? "success" : "warning"}>
                        {d.available ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>{visits(d.id).length}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`View ${d.name} profile`}
                          onClick={() => openProfile(d.id)}
                        >
                          View profile
                        </Button>
                        <Button
                          size="sm"
                          aria-label={`Book sample appointment with ${d.name}`}
                          disabled={!d.available || !date}
                          onClick={() => book(d.id)}
                        >
                          Book
                        </Button>
                        <Button
                          variant={saved.includes(d.id) ? "default" : "ghost"}
                          size="iconSm"
                          aria-label={`${saved.includes(d.id) ? "Remove" : "Save"} ${d.name}`}
                          aria-pressed={saved.includes(d.id)}
                          onClick={() => toggleSaved(d.id)}
                        >
                          <Bookmark
                            className={`size-4 ${saved.includes(d.id) ? "fill-current" : ""}`}
                          />
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
          <Stethoscope className="mx-auto size-8 text-muted-foreground" />
          <h3 className="mt-4 font-semibold">No matching doctors</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another specialty, availability, or search.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setQuery("");
              setSpecialty("All");
              setAvailability("All");
              setSavedOnly(false);
            }}
          >
            Reset filters
          </Button>
        </Card>
      )}
      <p className="mt-5 text-[10px] leading-5 text-muted-foreground">
        All profiles and schedules are fictional. Availability, bookmarks, and sample bookings apply
        to this page session only and do not update the Appointments page or contact patients.
      </p>
      <Dialog
        open={!!active}
        onOpenChange={(value) => {
          if (!value) setProfileId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Doctor profile</DialogTitle>
            <DialogDescription>{active?.id} / Fictional medical team</DialogDescription>
          </DialogHeader>
          {active && (
            <>
              <div className="flex items-center gap-4 rounded-2xl bg-primary/5 p-5">
                <img
                  src={active.image}
                  alt={active.name}
                  className="size-24 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{active.name}</h3>
                  <p className="mt-1 text-sm text-primary">{active.department}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{active.role}</p>
                  <div className="mt-3">
                    <Badge tone={active.available ? "success" : "warning"}>
                      {active.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 rounded-xl bg-muted/40 p-2">
                {["Overview", "Schedule"].map((value) => (
                  <Button
                    key={value}
                    variant={tab === value ? "default" : "ghost"}
                    size="sm"
                    aria-pressed={tab === value}
                    onClick={() => setTab(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              {tab === "Overview" ? (
                <>
                  <p className="text-sm leading-6 text-muted-foreground">{active.bio}</p>
                  <dl className="grid grid-cols-2 gap-4">
                    {[
                      ["Clinic", active.room],
                      ["Sample experience", `${active.experience} years`],
                      ["Email", active.email],
                      ["Phone", active.phone],
                    ].map(([label, value]) => (
                      <div key={label} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className="mt-1 break-words text-sm font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">Sample schedule</h3>
                    <Input
                      aria-label="Profile schedule date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-auto"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((time) => {
                      const busy = appointments.some(
                        (a) => a.doctorId === active.id && a.date === date && a.time === time,
                      );
                      return (
                        <button
                          key={time}
                          aria-label={`Slot ${time}`}
                          disabled={busy || !active.available || !date}
                          onClick={() => book(active.id, time)}
                          className={`rounded-lg border p-3 text-xs ${busy ? "border-border bg-muted text-muted-foreground" : "border-success/25 bg-success/5 text-success disabled:opacity-40"}`}
                        >
                          {time}
                          <span className="mt-1 block text-[10px]">
                            {busy ? "Booked" : active.available ? "Sample slot" : "Unavailable"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Illustrative 30-minute slots, 09:00-15:00. This is not a real availability feed.
                  </p>
                  <div className="max-h-40 space-y-2 overflow-y-auto">
                    {visits(active.id).map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 p-3 text-xs"
                      >
                        <span>
                          {a.time} / {a.patient}
                        </span>
                        <Badge tone={a.status === "Completed" ? "success" : "info"}>
                          {a.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-3 border-t border-border pt-4">
                <Button disabled={!active.available || !date} onClick={() => book(active.id)}>
                  <CalendarDays className="size-4" />
                  Book sample appointment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDoctors((prev) =>
                      prev.map((d) => (d.id === active.id ? { ...d, available: !d.available } : d)),
                    );
                    setNotice(`${active.name} availability updated locally.`);
                  }}
                >
                  {active.available ? "Mark unavailable" : "Mark available"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!bookingDoctor}
        onOpenChange={(value) => {
          if (!value) setBookingId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book sample appointment</DialogTitle>
            <DialogDescription>
              {bookingDoctor?.name} / Local simulation; no patient notification
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!bookingDoctor || !bookingDoctor.available) {
                setError("This sample doctor is unavailable.");
                return;
              }
              const patient = patientRecords.find((p) => p.id === form.patientId);
              if (!patient) {
                setError("Choose a patient for this sample appointment.");
                return;
              }
              if (
                appointments.some(
                  (a) =>
                    a.date === form.date &&
                    a.time === form.time &&
                    (a.doctorId === bookingDoctor.id || a.patient === patient.name),
                )
              ) {
                setError("This doctor or patient already has a sample appointment at this time.");
                return;
              }
              const id = `APT-${Math.max(...appointments.map((a) => Number(a.id.split("-")[1]))) + 1}`;
              setAppointments((prev) => [
                ...prev,
                {
                  id,
                  patient: patient.name,
                  age: Number(patient.details["Age"]),
                  doctorId: bookingDoctor.id,
                  department: bookingDoctor.department,
                  date: form.date,
                  time: form.time,
                  type: form.type,
                  status: "Scheduled",
                },
              ]);
              setDate(form.date);
              setNotice(
                `${id} booked locally with ${bookingDoctor.name}. No real appointment created.`,
              );
              setBookingId(null);
            }}
          >
            <label className="block text-sm font-medium">
              Patient
              <select
                aria-label="Doctor booking patient"
                value={form.patientId}
                onChange={(e) => {
                  const patientId = e.target.value;
                  const patient = patientRecords.find((item) => item.id === patientId);
                  const nextTime = slots.find(
                    (time) =>
                      !appointments.some(
                        (appointment) =>
                          appointment.date === form.date &&
                          appointment.time === time &&
                          (appointment.doctorId === bookingDoctor?.id ||
                            appointment.patient === patient?.name),
                      ),
                  );
                  setForm({ ...form, patientId, time: nextTime ?? "09:00" });
                  setError("");
                }}
                className="mt-2 w-full rounded-lg border border-border bg-card p-2"
              >
                {patientRecords.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Date
              <Input
                aria-label="Doctor booking date"
                type="date"
                required
                min={today}
                className="mt-2"
                value={form.date}
                onChange={(e) => {
                  const nextDate = e.target.value;
                  const nextPatient = patientRecords.find((item) => item.id === form.patientId);
                  const nextTime = slots.find(
                    (time) =>
                      !appointments.some(
                        (appointment) =>
                          appointment.date === nextDate &&
                          appointment.time === time &&
                          (appointment.doctorId === bookingDoctor?.id ||
                            appointment.patient === nextPatient?.name),
                      ),
                  );
                  setForm({ ...form, date: nextDate, time: nextTime ?? "09:00" });
                  setError("");
                }}
              />
            </label>
            <label className="block text-sm font-medium">
              Time
              <select
                aria-label="Doctor booking time"
                required
                value={form.time}
                onChange={(e) => {
                  setForm({ ...form, time: e.target.value });
                  setError("");
                }}
                className="mt-2 w-full rounded-lg border border-border bg-card p-2"
              >
                {slots.map((time) => (
                  <option
                    key={time}
                    disabled={appointments.some(
                      (appointment) =>
                        appointment.date === form.date &&
                        appointment.time === time &&
                        (appointment.doctorId === bookingDoctor?.id ||
                          appointment.patient ===
                            patientRecords.find((patient) => patient.id === form.patientId)?.name),
                    )}
                  >
                    {time}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Visit type
              <select
                aria-label="Doctor booking type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-2 w-full rounded-lg border border-border bg-card p-2"
              >
                <option>Consultation</option>
                <option>Follow-up</option>
              </select>
            </label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button className="w-full" type="submit">
              Save sample appointment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
