import { createFileRoute } from "@tanstack/react-router";
import { AiAnalyticsPage } from "@/components/ai-analytics/AiAnalyticsPages";
export const Route = createFileRoute("/ai-analytics/insights")({
  head: () => ({ meta: [{ title: "AI Insights | Vexui" }] }),
  component: () => <AiAnalyticsPage kind="insights" />,
});
