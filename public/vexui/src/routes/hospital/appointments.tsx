import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/appointments")({
  head: () => ({ meta: [{ title: "Appointments | Vexui" }] }),
  component: () => <HospitalPage kind="appointments" />,
});
