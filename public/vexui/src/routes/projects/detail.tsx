import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ProjectDetailsApp } from "@/components/pages/ProjectDetailsApp";

export const Route = createFileRoute("/projects/detail")({
  component: () => (
    <AppShell>
      <ProjectDetailsApp />
    </AppShell>
  ),
});
