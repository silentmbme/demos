import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/leave-requests-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hrm/leave-requests" });
  },
});
