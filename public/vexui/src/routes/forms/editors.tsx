import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EditorsApp } from "@/components/pages/EditorsApp";

export const Route = createFileRoute("/forms/editors")({
  component: () => (
    <AppShell>
      <EditorsApp />
    </AppShell>
  ),
});
