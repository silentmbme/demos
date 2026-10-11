import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/ai-analytics/")({
  beforeLoad: () => {
    throw redirect({ to: "/ai-analytics/insights" });
  },
});
