import { createFileRoute } from "@tanstack/react-router";
import { HrmPage } from "@/components/hrm/HrmPages";
export const Route = createFileRoute("/hrm/reviews")({
  head: () => ({ meta: [{ title: "Performance Reviews | Vexui" }] }),
  component: () => <HrmPage kind="reviews" />,
});
