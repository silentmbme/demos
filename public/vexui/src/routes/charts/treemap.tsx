import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ChartsShowcaseApp } from "@/components/pages/ChartsShowcaseApp";

export const Route = createFileRoute("/charts/treemap")({
  component: () => (
    <AppShell>
      <ChartsShowcaseApp mode="treemap" />
    </AppShell>
  ),
});
