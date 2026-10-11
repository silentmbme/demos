import { createFileRoute } from "@tanstack/react-router";
import { LogisticsDashboardPage } from "@/components/dashboard/LogisticsDashboard";
export const Route = createFileRoute("/logistics-dashboard.html")({
  head: () => ({ meta: [{ title: "Logistics Dashboard | Vexui" }] }),
  component: LogisticsDashboardPage,
});
