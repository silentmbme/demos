import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/pages/faq")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/pages/faq" />
    </AppShell>
  ),
});
