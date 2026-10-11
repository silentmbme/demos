import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { FormPluginsApp } from "@/components/pages/FormPluginsApp";

export const Route = createFileRoute("/forms/plugins")({
  component: () => (
    <AppShell>
      <FormPluginsApp />
    </AppShell>
  ),
});
