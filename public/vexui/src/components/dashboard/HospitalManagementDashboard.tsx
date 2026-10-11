import { useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  HeartPulse,
  Hospital,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ApexChart } from "@/components/charts/ApexChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HOSPITAL_APPOINTMENTS,
  HOSPITAL_DEPARTMENTS,
  HOSPITAL_DOCTORS,
  HOSPITAL_SUPPLIES,
  getHospitalOverview,
  hospitalMoney,
  type HospitalAppointment,
} from "@/data/hospital-dashboard-data";
import { mergeOptions, token, useChartTheme } from "@/lib/chart-config";
import { Badge, Card, PageHeader } from "./widgets";

export function HospitalManagementPage() {
  return (
    <AppShell navigationPath="/dashboards/hospital-management">
      <HospitalManagementDashboard />
    </AppShell>
  );
}

function DoctorPortrait({ doctorId, small = false }: { doctorId: string; small?: boolean }) {
  const doctor = HOSPITAL_DOCTORS.find((item) => item.id === doctorId);
  if (!doctor) return null;
  return (
    <span
      role="img"
      aria-label={`Portrait of ${doctor.name}`}
      data-doctor-portrait={doctor.id}
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-border font-semibold ${small ? "size-9 text-xs" : "size-16 text-lg"} ${doctor.tone}`}
    >
      <span aria-hidden>{doctor.initials}</span>
      <img
        src={doctor.image}
        alt=""
        aria-hidden
        width={384}
        height={384}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}

function Metric({
  title,
  value,
  icon,
  iconColor,
  footer,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  iconColor: string;
  footer: ReactNode;
}) {
  return (
    <section className="vexui-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{title}</p>
        <span className={`grid size-10 place-items-center rounded-xl ${iconColor}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-[28px] font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-3 text-xs text-muted-foreground">{footer}</div>
    </section>
  );
}

export function HospitalManagementDashboard() {
  const [period, setPeriod] = useState<"7" | "30">("7");
  const [department, setDepartment] = useState("all");
  const [appointments, setAppointments] = useState(HOSPITAL_APPOINTMENTS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [patient, setPatient] = useState("");
  const [doctorId, setDoctorId] = useState("dr-01");
  const [date, setDate] = useState("2026-10-09");
  const [time, setTime] = useState("14:00");
  const [appointmentType, setAppointmentType] = useState("Consultation");
  const [bookingError, setBookingError] = useState("");
  const [details, setDetails] = useState<HospitalAppointment | null>(null);
  const { base } = useChartTheme();
  const data = getHospitalOverview(period, department);
  const departmentAppointments = appointments.filter(
    (item) => department === "all" || item.department === department,
  );
  const visibleAppointments = departmentAppointments.filter(
    (item) =>
      (status === "all" || item.status === status) &&
      `${item.patient} ${item.id} ${item.department}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const doctors = HOSPITAL_DOCTORS.filter(
    (item) => department === "all" || item.department === department,
  );
  const scheduled = departmentAppointments.filter((item) => item.status === "Scheduled").length;
  const flowOptions = mergeOptions(base, {
    colors: [token("--primary"), token("--chart-2")],
    stroke: { curve: "smooth", width: [3, 2], dashArray: [0, 5] },
    xaxis: { categories: data.labels },
    yaxis: { min: 0, labels: { formatter: (value: number) => Math.round(value).toString() } },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { y: { formatter: (value: number) => `${Math.round(value)} patients` } },
  });
  const departmentOptions = mergeOptions(base, {
    colors: data.departments.map((item) => token(item.color)),
    stroke: { width: 0 },
    fill: { opacity: 0.95 },
    plotOptions: {
      bar: { horizontal: true, distributed: true, borderRadius: 4, barHeight: "45%" },
    },
    legend: { show: false },
    xaxis: {
      categories: data.departments.map((item) => item.name),
      labels: { formatter: (value: string) => Math.round(Number(value)).toString() },
    },
    yaxis: { labels: { maxWidth: 125 } },
    tooltip: { y: { formatter: (value: number) => `${value} visits` } },
  });
  const occupancyOptions = mergeOptions(base, {
    colors: [token("--primary")],
    labels: ["Beds occupied"],
    stroke: { lineCap: "round" },
    plotOptions: {
      radialBar: {
        startAngle: -125,
        endAngle: 125,
        hollow: { size: "70%" },
        track: { background: token("--muted") },
        dataLabels: {
          name: { offsetY: 25, fontSize: "12px" },
          value: {
            offsetY: -15,
            fontSize: "28px",
            fontWeight: 600,
            formatter: (value: number) => value.toFixed(1) + "%",
          },
        },
      },
    },
  });
  function openBooking(id = "dr-01") {
    setDoctorId(id);
    setPatient("");
    setDate("2026-10-09");
    setTime("14:00");
    setBookingError("");
    setBookingOpen(true);
  }
  function bookAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const doctor = HOSPITAL_DOCTORS.find((item) => item.id === doctorId && item.available);
    if (
      !doctor ||
      patient.trim().length < 2 ||
      date < "2026-10-09" ||
      !/^\d{2}:\d{2}$/.test(time)
    ) {
      setBookingError(
        "Enter a patient name, an available doctor, and a valid appointment date and time.",
      );
      return;
    }
    if (
      appointments.some(
        (item) => item.doctorId === doctorId && item.date === date && item.time === time,
      )
    ) {
      setBookingError("This doctor already has an appointment at that time. Choose another time.");
      return;
    }
    const appointment: HospitalAppointment = {
      id: `APT-${2101 + appointments.length}`,
      patient: patient.trim(),
      age: null,
      doctorId,
      department: doctor.department,
      date,
      time,
      type: appointmentType,
      status: "Scheduled",
    };
    setAppointments((current) => [appointment, ...current]);
    setDepartment("all");
    setStatus("all");
    setQuery("");
    setBookingOpen(false);
    toast.success("Sample appointment added");
  }
  function checkIn(id: string) {
    setAppointments((current) =>
      current.map((item) => (item.id === id ? { ...item, status: "Checked in" } : item)),
    );
    toast.success("Sample patient checked in");
  }
  function exportAppointments() {
    const rows = [
      ["Appointment", "Patient", "Department", "Doctor", "Date", "Time", "Status"],
      ...visibleAppointments.map((item) => [
        item.id,
        item.patient,
        item.department,
        HOSPITAL_DOCTORS.find((doctor) => doctor.id === item.doctorId)?.name ?? "",
        item.date,
        item.time,
        item.status,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "hospital-appointments.csv";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <PageHeader
        title="Hospital Management"
        subtitle="A coordinated view of patients, appointments, and hospital operations."
        breadcrumb={["Dashboards", "Hospital Management"]}
        actions={
          <>
            <Button variant="outline" onClick={exportAppointments}>
              <Download className="size-4" />
              Export report
            </Button>
            <Button onClick={() => openBooking()}>
              <Plus className="size-4" />
              New appointment
            </Button>
          </>
        }
      />
      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-sm">
            <Hospital className="size-6" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold">Carewell Medical Center</h2>
              <Badge tone="primary" size="sm">
                Sample data
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Friday, October 9, 2026 · Hospital operations overview
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger aria-label="Hospital department" className="h-9 w-[190px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {HOSPITAL_DEPARTMENTS.map((item) => (
                <SelectItem key={item.name} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={(value) => setPeriod(value as "7" | "30")}>
            <SelectTrigger aria-label="Hospital reporting period" className="h-9 w-[140px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Patient visits"
          iconColor="bg-primary/10 text-primary"
          value={data.visits.toLocaleString("en-US")}
          icon={<UsersRound className="size-5" />}
          footer={
            <span className="flex items-center gap-1.5">
              <ArrowUpRight className="size-3.5 text-success" />
              Across the last {period} days
            </span>
          }
        />
        <Metric
          title="Appointments"
          iconColor="bg-info/10 text-info"
          value={String(departmentAppointments.length)}
          icon={<CalendarDays className="size-5" />}
          footer={`${scheduled} scheduled · ${departmentAppointments.filter((item) => item.status === "Checked in").length} checked in`}
        />
        <Metric
          title="Available beds"
          iconColor="bg-success/10 text-success"
          value={String(data.available)}
          icon={<BedDouble className="size-5" />}
          footer={`${data.occupied} occupied of ${data.beds} total beds`}
        />
        <Metric
          title="Sample revenue"
          iconColor="bg-warning/10 text-warning"
          value={hospitalMoney(data.revenue)}
          icon={<ClipboardList className="size-5" />}
          footer={`Visit revenue over ${period} days`}
        />
      </div>
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Patient flow"
          description={`Arrivals and discharges over the last ${period} days`}
          className="xl:col-span-2"
          bodyClassName="px-3 pb-2 pt-4"
          action={<Badge tone="primary">{data.visits.toLocaleString("en-US")} arrivals</Badge>}
        >
          <div className="mb-2 flex gap-6 px-3">
            <div>
              <p className="text-xl font-semibold">{data.visits.toLocaleString("en-US")}</p>
              <p className="text-xs text-muted-foreground">Patient arrivals</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                {data.discharged.reduce((sum, value) => sum + value, 0).toLocaleString("en-US")}
              </p>
              <p className="text-xs text-muted-foreground">Discharged</p>
            </div>
          </div>
          <ApexChart
            type="line"
            height={290}
            options={flowOptions}
            series={[
              { name: "Arrivals", data: data.admissions },
              { name: "Discharged", data: data.discharged },
            ]}
          />
        </Card>
        <Card
          title="Bed occupancy"
          description="Current capacity in selected departments"
          bodyClassName="px-5 pb-5 pt-2"
        >
          <ApexChart
            type="radialBar"
            height={255}
            options={occupancyOptions}
            series={[data.occupancy]}
          />
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Total beds", data.beds],
              ["Occupied", data.occupied],
              ["Available", data.available],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-muted/40 p-3">
                <p className="text-lg font-semibold">{value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-success" />
            {data.available} beds available for allocation
          </p>
        </Card>
      </div>

      <Card
        title="Appointments"
        description="Manage sample patient visits and check-ins"
        bodyClassName="p-0"
        className="mb-6"
        action={<Badge tone="primary">{visibleAppointments.length} appointments</Badge>}
      >
        <div className="flex flex-wrap gap-3 border-b border-border px-5 py-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              aria-label="Search hospital appointments"
              className="ps-9"
              placeholder="Search patient, appointment, or department..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Appointment status" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["Scheduled", "Checked in", "Completed"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-5">Patient</TableHead>
              <TableHead>Doctor / department</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pe-5">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleAppointments.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="ps-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {item.patient
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div>
                      <p className="whitespace-nowrap text-[13px] font-semibold">{item.patient}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.id}
                        {item.age !== null ? ` · ${item.age} years` : ""}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <DoctorPortrait doctorId={item.doctorId} small />
                    <div>
                      <p className="whitespace-nowrap text-xs font-medium">
                        {HOSPITAL_DOCTORS.find((doctor) => doctor.id === item.doctorId)?.name}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{item.department}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs">
                  <p>{item.time}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{item.date}</p>
                </TableCell>
                <TableCell className="text-xs">{item.type}</TableCell>
                <TableCell>
                  <Badge
                    size="sm"
                    tone={
                      item.status === "Completed"
                        ? "success"
                        : item.status === "Checked in"
                          ? "info"
                          : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="pe-5">
                  <div className="flex items-center gap-1">
                    {item.status === "Scheduled" && (
                      <Button
                        size="sm"
                        variant="soft"
                        aria-label={`Check in ${item.patient}`}
                        onClick={() => checkIn(item.id)}
                      >
                        <Check className="size-3.5" />
                        Check in
                      </Button>
                    )}
                    <Button
                      size="iconSm"
                      variant="ghost"
                      aria-label={`View ${item.patient} appointment`}
                      onClick={() => setDetails(item)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {visibleAppointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No appointments match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Showing {visibleAppointments.length} of {departmentAppointments.length} appointments ·
          Changes stay in this demo session
        </div>
      </Card>

      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Visits by department"
          description={`Department activity over ${period} days`}
          bodyClassName="px-3 pb-2 pt-3"
        >
          <ApexChart
            type="bar"
            height={285}
            options={departmentOptions}
            series={[
              {
                name: "Visits",
                data: data.departments.map((item) =>
                  Math.round((item.visits * Number(period)) / 7),
                ),
              },
            ]}
          />
        </Card>
        <Card
          title="Ward capacity"
          description="Occupied and available beds by ward"
          className="xl:col-span-2"
          bodyClassName="p-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {data.departments.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.occupied} / {item.beds} beds
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label={`${item.name} occupancy`}
                  aria-valuenow={item.occupied}
                  aria-valuemin={0}
                  aria-valuemax={item.beds}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.occupied / item.beds) * 100}%`,
                      background: `var(${item.color})`,
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {item.beds - item.occupied} beds available
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-4 text-primary" />
          <h2 className="text-[15px] font-semibold">Doctor availability</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {doctors.filter((item) => item.available).length} available
        </span>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <section key={doctor.id} className="vexui-card p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <DoctorPortrait doctorId={doctor.id} />
              <Badge size="sm" tone={doctor.available ? "success" : "warning"}>
                {doctor.available ? "Available" : "In surgery"}
              </Badge>
            </div>
            <h3 className="text-sm font-semibold">{doctor.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{doctor.department}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{doctor.role}</p>
            <div className="my-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <UsersRound className="size-3.5" />
              {doctor.patients} patients assigned
            </div>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled={!doctor.available}
              onClick={() => openBooking(doctor.id)}
            >
              <CalendarDays className="size-3.5" />
              Book appointment
            </Button>
          </section>
        ))}
        {doctors.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No doctors are listed for this department in the sample roster.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Supply inventory"
          description="Stock levels for daily hospital operations"
          action={<Package className="size-4 text-muted-foreground" />}
          bodyClassName="p-5"
        >
          <div className="space-y-4">
            {HOSPITAL_SUPPLIES.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium">{item.name}</p>
                  <Badge
                    size="sm"
                    tone={item.remaining / item.target < 0.3 ? "warning" : "success"}
                  >
                    {item.remaining / item.target < 0.3 ? "Low stock" : "In stock"}
                  </Badge>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${item.remaining / item.target < 0.3 ? "bg-warning" : "bg-primary"}`}
                    style={{ width: `${(item.remaining / item.target) * 100}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  {item.remaining.toLocaleString("en-US")} of {item.target.toLocaleString("en-US")}{" "}
                  {item.unit}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title="Operations activity"
          description="Sample updates from the hospital team"
          action={<Activity className="size-4 text-muted-foreground" />}
          bodyClassName="p-5"
        >
          <div className="space-y-5">
            {[
              {
                title: "Morning ward review completed",
                text: "Capacity and staffing reviewed across all six departments.",
                time: "09:15",
                icon: <HeartPulse className="size-4" />,
                tone: "bg-primary/10 text-primary",
              },
              {
                title: "Supply stock review",
                text: "PPE kits and dressing packs marked for replenishment.",
                time: "09:40",
                icon: <Package className="size-4" />,
                tone: "bg-warning/10 text-warning",
              },
              {
                title: "Afternoon clinic schedule ready",
                text: "Available doctors are accepting sample appointment bookings.",
                time: "10:00",
                icon: <Clock3 className="size-4" />,
                tone: "bg-success/10 text-success",
              },
              {
                title: "Bed allocation updated",
                text: "Available beds confirmed with ward coordinators for incoming patients.",
                time: "10:20",
                icon: <BedDouble className="size-4" />,
                tone: "bg-info/10 text-info",
              },
              {
                title: "Staff handover completed",
                text: "The afternoon team received appointment and department updates.",
                time: "10:45",
                icon: <UsersRound className="size-4" />,
                tone: "bg-primary/10 text-primary",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${item.tone}`}>
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <h3 className="text-xs font-semibold">{item.title}</h3>
                    <span className="text-[11px] text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New appointment</DialogTitle>
            <DialogDescription>
              Add a sample booking. Appointment changes are kept for this page session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={bookAppointment} className="space-y-4">
            <div>
              <Label htmlFor="hospital-patient">Patient name</Label>
              <Input
                id="hospital-patient"
                className="mt-2"
                placeholder="Enter sample patient name"
                value={patient}
                onChange={(event) => setPatient(event.target.value)}
                required
                minLength={2}
                maxLength={80}
              />
            </div>
            <div>
              <Label htmlFor="hospital-doctor">Doctor</Label>
              <Select value={doctorId} onValueChange={setDoctorId}>
                <SelectTrigger
                  id="hospital-doctor"
                  aria-label="Appointment doctor"
                  className="mt-2"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOSPITAL_DOCTORS.filter((item) => item.available).map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} · {doctor.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hospital-date">Date</Label>
                <Input
                  id="hospital-date"
                  type="date"
                  min="2026-10-09"
                  className="mt-2"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hospital-time">Time</Label>
                <Input
                  id="hospital-time"
                  type="time"
                  className="mt-2"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hospital-visit-type">Visit type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger id="hospital-visit-type" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {bookingError && (
              <p role="alert" className="text-sm text-destructive">
                {bookingError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setBookingOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="size-4" />
                Save appointment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={details !== null}
        onOpenChange={(open) => {
          if (!open) setDetails(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment details</DialogTitle>
            <DialogDescription>Sample patient visit information.</DialogDescription>
          </DialogHeader>
          {details && (
            <dl className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
              {[
                ["Patient", details.patient],
                ["Appointment ID", details.id],
                [
                  "Doctor",
                  HOSPITAL_DOCTORS.find((doctor) => doctor.id === details.doctorId)?.name ?? "",
                ],
                ["Department", details.department],
                ["Date / time", `${details.date} · ${details.time}`],
                [
                  "Status",
                  appointments.find((item) => item.id === details.id)?.status ?? details.status,
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
