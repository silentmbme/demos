import { createFileRoute } from "@tanstack/react-router";
import { SchoolPage } from "@/components/school/SchoolPages";
export const Route = createFileRoute("/school/students")({
  head: () => ({ meta: [{ title: "Students | Vexui" }] }),
  component: () => <SchoolPage kind="students" />,
});
