import { createFileRoute } from "@tanstack/react-router";
import { SchoolPage } from "@/components/school/SchoolPages";
export const Route = createFileRoute("/school/attendance")({
  head: () => ({ meta: [{ title: "Attendance | Vexui" }] }),
  component: () => <SchoolPage kind="attendance" />,
});
