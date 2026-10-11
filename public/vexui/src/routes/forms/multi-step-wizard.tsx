import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MultiStepWizardApp } from "@/components/pages/MultiStepWizardApp";

export const Route = createFileRoute("/forms/multi-step-wizard")({
  component: () => (
    <AppShell>
      <MultiStepWizardApp />
    </AppShell>
  ),
});
