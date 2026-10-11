import { createFileRoute } from "@tanstack/react-router";
import { HospitalManagementPage } from "@/components/dashboard/HospitalManagementDashboard";

export const Route = createFileRoute("/dashboards/hospital-management")({
  head: () => ({ meta: [{ title: "Hospital Management | Vexui" }] }),
  component: HospitalManagementPage,
});
