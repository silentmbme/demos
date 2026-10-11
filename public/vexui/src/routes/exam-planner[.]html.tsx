import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/exam-planner.html")({
  beforeLoad: () => {
    throw redirect({ to: "/school/exams" });
  },
});
