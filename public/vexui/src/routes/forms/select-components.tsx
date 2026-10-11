import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SelectComponentsApp } from "@/components/pages/SelectComponentsApp";

export const Route = createFileRoute("/forms/select-components")({
  component: () => (
    <AppShell>
      <SelectComponentsApp />
    </AppShell>
  ),
});
