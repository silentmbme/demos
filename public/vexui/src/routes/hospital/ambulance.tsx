import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/ambulance")({
  head: () => ({ meta: [{ title: "Ambulance | Vexui" }] }),
  component: () => <HospitalPage kind="ambulance" />,
});
