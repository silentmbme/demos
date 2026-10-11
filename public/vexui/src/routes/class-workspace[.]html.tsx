import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/class-workspace.html")({
  beforeLoad: () => {
    throw redirect({ to: "/school/classes" });
  },
});
