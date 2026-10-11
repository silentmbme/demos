import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard";
export const Route = createFileRoute("/dashboards/finance")({
  component: () => (
    <AppShell>
      <FinanceDashboard />
    </AppShell>
  ),
});
