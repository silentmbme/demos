import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/student-directory.html")({
  beforeLoad: () => {
    throw redirect({ to: "/school/students" });
  },
});
