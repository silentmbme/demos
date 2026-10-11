import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FormElementsApp } from "@/components/pages/FormElementsApp";
export const Route = createFileRoute("/forms/elements")({
  component: () => (
    <AppShell>
      <FormElementsApp />
    </AppShell>
  ),
});
