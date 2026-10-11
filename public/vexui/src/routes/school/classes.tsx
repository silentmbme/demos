import { createFileRoute } from "@tanstack/react-router";
import { SchoolPage } from "@/components/school/SchoolPages";
export const Route = createFileRoute("/school/classes")({
  head: () => ({ meta: [{ title: "Classes | Vexui" }] }),
  component: () => <SchoolPage kind="classes" />,
});
