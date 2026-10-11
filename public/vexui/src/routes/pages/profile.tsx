import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/pages/profile")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/pages/profile" />
    </AppShell>
  ),
});
