import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MarketingDashboard } from "@/components/dashboard/MarketingDashboard";
export const Route = createFileRoute("/dashboards/marketing")({
  component: () => (
    <AppShell>
      <MarketingDashboard />
    </AppShell>
  ),
});
