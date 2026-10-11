import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FormLayoutsApp } from "@/components/pages/FormLayoutsApp";

export const Route = createFileRoute("/forms/layouts")({
  component: () => (
    <AppShell>
      <FormLayoutsApp />
    </AppShell>
  ),
});
