import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/pages/settings")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/pages/settings" />
    </AppShell>
  ),
});
