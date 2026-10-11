import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FormValidationApp } from "@/components/pages/FormValidationApp";

export const Route = createFileRoute("/forms/validation")({
  component: () => (
    <AppShell>
      <FormValidationApp />
    </AppShell>
  ),
});
