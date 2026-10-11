import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SchoolManagementDashboard } from "@/components/dashboard/SchoolManagementDashboard";
export const Route = createFileRoute("/dashboards/school-management")({
  head: () => ({ meta: [{ title: "School Management | Vexui" }] }),
  component: () => (
    <AppShell navigationPath="/dashboards/school-management">
      <SchoolManagementDashboard />
    </AppShell>
  ),
});
