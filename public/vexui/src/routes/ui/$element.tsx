import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { UiElementDetailApp } from "@/components/pages/UiElementDetailApp";
import { TailwindElementApp } from "@/components/pages/TailwindElementApp";
const tailwindElements = new Set(["tables"]);
export const Route = createFileRoute("/ui/$element")({ component: UiElementRoute });
function UiElementRoute() {
  const { element } = Route.useParams();
  return (
    <AppShell>
      {tailwindElements.has(element) ? (
        <TailwindElementApp element={element} />
      ) : (
        <UiElementDetailApp element={element} />
      )}
    </AppShell>
  );
}
