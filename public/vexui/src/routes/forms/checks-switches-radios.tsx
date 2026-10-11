import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ChecksSwitchesRadiosApp } from "@/components/pages/ChecksSwitchesRadiosApp";

export const Route = createFileRoute("/forms/checks-switches-radios")({
  component: () => (
    <AppShell>
      <ChecksSwitchesRadiosApp />
    </AppShell>
  ),
});
