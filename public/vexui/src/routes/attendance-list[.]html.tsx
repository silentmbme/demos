import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/attendance-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/school/attendance" });
  },
});
