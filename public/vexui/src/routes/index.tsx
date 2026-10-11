import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ExecutiveDashboard } from "@/components/dashboard/ExecutiveDashboard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <ExecutiveDashboard />
    </AppShell>
  );
}
