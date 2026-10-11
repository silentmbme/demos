import { createFileRoute } from "@tanstack/react-router";
import { NotesPage } from "@/components/apps/NotesApp";
export const Route = createFileRoute("/apps/notes")({
  head: () => ({ meta: [{ title: "Notes | Vexui" }] }),
  component: NotesPage,
});
