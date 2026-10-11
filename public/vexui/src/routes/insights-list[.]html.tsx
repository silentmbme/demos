import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/insights-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/ai-analytics/insights" });
  },
});
