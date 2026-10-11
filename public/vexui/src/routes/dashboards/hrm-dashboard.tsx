import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HrmDashboard } from "@/components/dashboard/HrmDashboard";
export const Route = createFileRoute("/dashboards/hrm-dashboard")({
  head: () => ({ meta: [{ title: "HRM Dashboard | Vexui" }] }),
  component: () => (
    <AppShell>
      <HrmDashboard />
    </AppShell>
  ),
});
