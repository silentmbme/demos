import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/apps/chat")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/apps/chat" />
    </AppShell>
  ),
});
