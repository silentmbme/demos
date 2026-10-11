import { createFileRoute } from "@tanstack/react-router";
import { SchoolPage } from "@/components/school/SchoolPages";
export const Route = createFileRoute("/school/exams")({
  head: () => ({ meta: [{ title: "Exams | Vexui" }] }),
  component: () => <SchoolPage kind="exams" />,
});
