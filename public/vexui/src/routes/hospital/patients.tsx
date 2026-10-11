import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/patients")({
  head: () => ({ meta: [{ title: "Patients | Vexui" }] }),
  component: () => <HospitalPage kind="patients" />,
});
