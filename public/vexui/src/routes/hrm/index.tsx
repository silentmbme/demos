import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/hrm/")({
  beforeLoad: () => {
    throw redirect({ to: "/hrm/employees" });
  },
});
