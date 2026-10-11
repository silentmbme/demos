import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectsDashboard } from "@/components/dashboard/ProjectsDashboard";
export const Route = createFileRoute("/dashboards/projects")({
  component: () => (
    <AppShell>
      <ProjectsDashboard />
    </AppShell>
  ),
});
