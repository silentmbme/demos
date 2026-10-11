import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectTeamApp } from "@/components/pages/ProjectTeamApp";
export const Route = createFileRoute("/projects/team")({
  component: () => (
    <AppShell>
      <ProjectTeamApp />
    </AppShell>
  ),
});
