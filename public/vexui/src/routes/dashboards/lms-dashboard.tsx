import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { LmsDashboard } from "@/components/dashboard/LmsDashboard";

export const Route = createFileRoute("/dashboards/lms-dashboard")({
  head: () => ({ meta: [{ title: "LMS Dashboard | Vexui" }] }),
  component: () => (
    <AppShell>
      <LmsDashboard />
    </AppShell>
  ),
});
