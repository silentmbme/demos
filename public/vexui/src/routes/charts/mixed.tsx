import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ChartsShowcaseApp } from "@/components/pages/ChartsShowcaseApp";

export const Route = createFileRoute("/charts/mixed")({
  component: () => (
    <AppShell>
      <ChartsShowcaseApp mode="mixed" />
    </AppShell>
  ),
});
