import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CrmDashboard } from "@/components/dashboard/CrmDashboard";
export const Route = createFileRoute("/dashboards/crm")({
  component: () => (
    <AppShell>
      <CrmDashboard />
    </AppShell>
  ),
});
