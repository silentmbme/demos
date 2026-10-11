import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AiAnalyticsDashboard } from "@/components/dashboard/AiAnalyticsDashboard";

export const Route = createFileRoute("/dashboards/ai-analytics")({
  head: () => ({ meta: [{ title: "AI Analytics | Vexui" }] }),
  component: () => (
    <AppShell>
      <AiAnalyticsDashboard />
    </AppShell>
  ),
});
