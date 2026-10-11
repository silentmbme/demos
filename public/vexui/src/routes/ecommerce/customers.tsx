import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/ecommerce/customers")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/ecommerce/customers" />
    </AppShell>
  ),
});
