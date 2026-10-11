import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/crm/companies")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/crm/companies" />
    </AppShell>
  ),
});
