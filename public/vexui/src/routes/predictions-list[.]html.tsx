import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/predictions-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/ai-analytics/predictions" });
  },
});
