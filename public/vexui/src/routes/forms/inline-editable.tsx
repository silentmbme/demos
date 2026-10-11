import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { InlineEditableApp } from "@/components/pages/InlineEditableApp";

export const Route = createFileRoute("/forms/inline-editable")({
  component: () => (
    <AppShell>
      <InlineEditableApp />
    </AppShell>
  ),
});
