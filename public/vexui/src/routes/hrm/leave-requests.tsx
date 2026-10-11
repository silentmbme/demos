import { createFileRoute } from "@tanstack/react-router";
import { HrmPage } from "@/components/hrm/HrmPages";
export const Route = createFileRoute("/hrm/leave-requests")({
  head: () => ({ meta: [{ title: "Leave Requests | Vexui" }] }),
  component: () => <HrmPage kind="leave-requests" />,
});
