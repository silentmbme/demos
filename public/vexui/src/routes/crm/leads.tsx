import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/crm/leads")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/crm/leads" />
    </AppShell>
  ),
});
