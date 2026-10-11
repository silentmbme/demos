import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/payroll-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hrm/payroll" });
  },
});
