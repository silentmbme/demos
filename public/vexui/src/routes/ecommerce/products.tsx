import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspacePage } from "@/components/pages/WorkspacePages";
export const Route = createFileRoute("/ecommerce/products")({
  component: () => (
    <AppShell>
      <WorkspacePage path="/ecommerce/products" />
    </AppShell>
  ),
});
