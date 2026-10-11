import { HOSPITAL_DOCTORS, HOSPITAL_APPOINTMENTS } from "@/data/hospital-dashboard-data";
import { userImages } from "@/lib/user-images";
export type Kind =
  "patients" | "doctors" | "appointments" | "wards" | "pharmacy" | "ambulance" | "billing";
export type Entry = {
  id: string;
  name: string;
  category: string;
  status: string;
  image?: string;
  details: Record<string, string>;
};
export const titles: Record<Kind, string> = {
  patients: "Patients",
  doctors: "Doctors",
  appointments: "Appointments",
  wards: "Wards & Beds",
  pharmacy: "Pharmacy",
  ambulance: "Ambulance",
  billing: "Billing",
};
export const options: Record<Kind, string[]> = {
  patients: ["Outpatient", "Inpatient"],
  doctors: ["Available", "Unavailable"],
  appointments: ["Scheduled", "Checked in", "Completed"],
  wards: ["Available", "Occupied", "Cleaning"],
  pharmacy: ["In stock", "Low stock"],
  ambulance: ["Available", "On duty", "Maintenance"],
  billing: ["Unpaid", "Paid"],
};
export const patientRecords: Entry[] = HOSPITAL_APPOINTMENTS.map((a, i) => ({
  id: `PAT-${101 + i}`,
  name: a.patient,
  category: a.department,
  status: i % 3 === 0 ? "Inpatient" : "Outpatient",
  image: Object.values(userImages)[i % 4],
  details: { Age: String(a.age ?? 30), Contact: `+1 202-555-01${i + 10}` },
}));
export const records: Record<Kind, Entry[]> = {
  patients: patientRecords,
  doctors: HOSPITAL_DOCTORS.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.department,
    status: d.available ? "Available" : "Unavailable",
    image: d.image,
    details: { Role: d.role },
  })),
  appointments: HOSPITAL_APPOINTMENTS.map((a) => ({
    id: a.id,
    name: a.patient,
    category: a.department,
    status: a.status,
    details: {
      Doctor: HOSPITAL_DOCTORS.find((d) => d.id === a.doctorId)!.name,
      Date: a.date,
      Time: a.time,
      Type: a.type,
    },
  })),
  wards: Array.from({ length: 12 }, (_, i) => ({
    id: `BED-${101 + i}`,
    name: `Bed ${101 + i}`,
    category: ["General Ward", "Cardiology", "Pediatrics"][Math.floor(i / 4)],
    status: i === 0 || i === 4 ? "Occupied" : i === 7 ? "Cleaning" : "Available",
    details: {
      Patient: i === 0 ? patientRecords[0].name : i === 4 ? patientRecords[3].name : "Not assigned",
      Floor: String(Math.floor(i / 4) + 1),
    },
  })),
  pharmacy: [
    ["MED-101", "Paracetamol", "Tablets", "840", "300", "2027-06-30"],
    ["MED-102", "Oral rehydration salts", "Supplies", "85", "120", "2027-04-30"],
    ["MED-103", "Cetirizine", "Tablets", "420", "200", "2027-08-31"],
    ["MED-104", "Sterile dressing packs", "Supplies", "68", "100", "2028-01-31"],
    ["MED-105", "Saline solution", "Solutions", "180", "100", "2027-03-31"],
    ["MED-106", "Antiseptic solution", "Solutions", "240", "80", "2027-09-30"],
  ].map(([id, name, category, stock, minimum, expiry], i) => ({
    id,
    name,
    category,
    status: Number(stock) < Number(minimum) ? "Low stock" : "In stock",
    details: { Stock: stock, Minimum: minimum, Batch: `DEMO-${i + 1}`, Expiry: expiry },
  })),
  ambulance: [
    ["AMB-101", "DEMO-01", "North station", "Available", "Team Alpha"],
    ["AMB-102", "DEMO-02", "Central station", "On duty", "Team Bravo"],
    ["AMB-103", "DEMO-03", "East station", "Available", "Team Charlie"],
    ["AMB-104", "DEMO-04", "Central station", "Maintenance", "Team Delta"],
  ].map(([id, name, category, status, crew]) => ({
    id,
    name,
    category,
    status,
    details: { Crew: crew },
  })),
  billing: patientRecords.map((p, i) => ({
    id: `BILL-${101 + i}`,
    name: p.name,
    category: "October 2026",
    status: i < 2 ? "Paid" : "Unpaid",
    details: {
      Date: "2026-10-09",
      Consultation: "80",
      Services: String(i % 2 ? 120 : 40),
      Adjustment: String(i % 3 ? 0 : 20),
    },
  })),
};
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
export const invoiceTotal = (entry: Entry) =>
  Number(entry.details.Consultation) +
  Number(entry.details.Services) -
  Number(entry.details.Adjustment);
