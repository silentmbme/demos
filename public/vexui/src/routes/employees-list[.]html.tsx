import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/employees-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hrm/employees" });
  },
});
