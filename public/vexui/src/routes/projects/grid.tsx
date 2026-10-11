import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/projects/grid")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/projects/grid" />
    </AppShell>
  ),
});
