import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EcommerceDashboard } from "@/components/dashboard/EcommerceDashboard";

export const Route = createFileRoute("/dashboards/ecommerce")({
  component: () => (
    <AppShell>
      <EcommerceDashboard />
    </AppShell>
  ),
});
