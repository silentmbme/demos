import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

export const Route = createFileRoute("/dashboards/analytics")({
  component: () => (
    <AppShell>
      <AnalyticsDashboard />
    </AppShell>
  ),
});
