import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SaasDashboard } from "@/components/dashboard/SaasDashboard";
export const Route = createFileRoute("/dashboards/saas")({
  component: () => (
    <AppShell>
      <SaasDashboard />
    </AppShell>
  ),
});
