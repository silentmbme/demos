import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { UiElementDetailApp } from "@/components/pages/UiElementDetailApp";
export const Route = createFileRoute("/ui/elements")({
  component: () => (
    <AppShell>
      <UiElementDetailApp element="buttons" />
    </AppShell>
  ),
});
