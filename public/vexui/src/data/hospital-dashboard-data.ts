import ameliaBrooksPortrait from "@/assets/images/doctors/amelia-brooks.jpg";
import danielChenPortrait from "@/assets/images/doctors/daniel-chen.jpg";
import mayaPatelPortrait from "@/assets/images/doctors/maya-patel.jpg";
import jamesWilsonPortrait from "@/assets/images/doctors/james-wilson.jpg";

export const HOSPITAL_DEPARTMENTS = [
  { name: "General Medicine", beds: 48, occupied: 37, visits: 286, color: "--primary" },
  { name: "Cardiology", beds: 24, occupied: 20, visits: 164, color: "--chart-2" },
  { name: "Orthopedics", beds: 20, occupied: 14, visits: 138, color: "--chart-3" },
  { name: "Neurology", beds: 18, occupied: 13, visits: 92, color: "--chart-4" },
  { name: "Pediatrics", beds: 20, occupied: 12, visits: 181, color: "--chart-5" },
  { name: "ICU", beds: 12, occupied: 10, visits: 42, color: "--warning" },
] as const;

export const HOSPITAL_DOCTORS = [
  {
    id: "dr-01",
    name: "Dr. Amelia Brooks",
    initials: "AB",
    image: ameliaBrooksPortrait,
    department: "General Medicine",
    role: "Consultant physician",
    patients: 12,
    available: true,
    tone: "bg-primary/10 text-primary",
  },
  {
    id: "dr-02",
    name: "Dr. Daniel Chen",
    initials: "DC",
    image: danielChenPortrait,
    department: "Cardiology",
    role: "Cardiology consultant",
    patients: 8,
    available: true,
    tone: "bg-info/10 text-info",
  },
  {
    id: "dr-03",
    name: "Dr. Maya Patel",
    initials: "MP",
    image: mayaPatelPortrait,
    department: "Pediatrics",
    role: "Pediatric specialist",
    patients: 10,
    available: true,
    tone: "bg-success/10 text-success",
  },
  {
    id: "dr-04",
    name: "Dr. James Wilson",
    initials: "JW",
    image: jamesWilsonPortrait,
    department: "Orthopedics",
    role: "Orthopedic surgeon",
    patients: 6,
    available: false,
    tone: "bg-warning/10 text-warning",
  },
] as const;

export type HospitalAppointmentStatus = "Scheduled" | "Checked in" | "Completed";
export interface HospitalAppointment {
  id: string;
  patient: string;
  age: number | null;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  type: string;
  status: HospitalAppointmentStatus;
}

export const HOSPITAL_APPOINTMENTS: HospitalAppointment[] = [
  {
    id: "APT-2101",
    patient: "Olivia Bennett",
    age: 34,
    doctorId: "dr-01",
    department: "General Medicine",
    date: "2026-10-09",
    time: "09:00",
    type: "Consultation",
    status: "Completed",
  },
  {
    id: "APT-2102",
    patient: "Liam Carter",
    age: 58,
    doctorId: "dr-02",
    department: "Cardiology",
    date: "2026-10-09",
    time: "09:30",
    type: "Follow-up",
    status: "Checked in",
  },
  {
    id: "APT-2103",
    patient: "Emma Davis",
    age: 8,
    doctorId: "dr-03",
    department: "Pediatrics",
    date: "2026-10-09",
    time: "10:00",
    type: "Consultation",
    status: "Scheduled",
  },
  {
    id: "APT-2104",
    patient: "Noah Williams",
    age: 42,
    doctorId: "dr-04",
    department: "Orthopedics",
    date: "2026-10-09",
    time: "10:30",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "APT-2105",
    patient: "Sophia Miller",
    age: 29,
    doctorId: "dr-01",
    department: "General Medicine",
    date: "2026-10-09",
    time: "11:00",
    type: "Consultation",
    status: "Scheduled",
  },
  {
    id: "APT-2106",
    patient: "Ethan Reed",
    age: 63,
    doctorId: "dr-02",
    department: "Cardiology",
    date: "2026-10-09",
    time: "11:30",
    type: "Follow-up",
    status: "Scheduled",
  },
];

export const HOSPITAL_SUPPLIES = [
  { name: "Examination gloves", remaining: 1240, target: 2000, unit: "pairs" },
  { name: "Disposable masks", remaining: 860, target: 1200, unit: "units" },
  { name: "PPE kits", remaining: 42, target: 200, unit: "kits" },
  { name: "Sterile dressing packs", remaining: 68, target: 300, unit: "packs" },
] as const;

export function getHospitalOverview(period: "7" | "30", department: string) {
  const departments = HOSPITAL_DEPARTMENTS.filter(
    (item) => department === "all" || item.name === department,
  );
  const visits = departments.reduce(
    (sum, item) => sum + Math.round((item.visits * Number(period)) / 7),
    0,
  );
  const beds = departments.reduce((sum, item) => sum + item.beds, 0);
  const occupied = departments.reduce((sum, item) => sum + item.occupied, 0);
  const weights = [0.8, 0.92, 1.06, 0.94, 1.24, 0.9, 1.14];
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  const admissions = weights.map((value) => Math.floor((visits * value) / totalWeight));
  admissions[6] = (admissions[6] ?? 0) + visits - admissions.reduce((sum, value) => sum + value, 0);
  const discharged = admissions.map((value, index) =>
    Math.round(value * (0.73 + (index % 3) * 0.05)),
  );
  const labels = weights.map((_, index) => {
    const date = new Date(
      Date.UTC(2026, 9, 9 - Math.round(((6 - index) * (Number(period) - 1)) / 6)),
    );
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  });
  return {
    departments,
    visits,
    beds,
    occupied,
    available: beds - occupied,
    occupancy: beds ? (occupied / beds) * 100 : 0,
    admissions,
    discharged,
    labels,
    revenue: visits * 148,
  };
}

export function hospitalMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
