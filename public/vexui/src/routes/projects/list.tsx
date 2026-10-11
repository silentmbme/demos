import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/projects/list")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/projects/list" />
    </AppShell>
  ),
});
