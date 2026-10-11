import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/model-settings-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/ai-analytics/model-settings" });
  },
});
