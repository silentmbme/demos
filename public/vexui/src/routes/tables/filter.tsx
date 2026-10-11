import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { TablesModuleApp } from "@/components/pages/TablesModuleApp";

export const Route = createFileRoute("/tables/filter")({
  component: () => (
    <AppShell>
      <TablesModuleApp mode="filter" />
    </AppShell>
  ),
});
