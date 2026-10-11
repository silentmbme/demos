import { createFileRoute } from "@tanstack/react-router";
import { HospitalPage } from "@/components/hospital/HospitalPages";
export const Route = createFileRoute("/hospital/wards")({
  head: () => ({ meta: [{ title: "Wards & Beds | Vexui" }] }),
  component: () => <HospitalPage kind="wards" />,
});
