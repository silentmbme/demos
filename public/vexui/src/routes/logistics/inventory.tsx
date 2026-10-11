import { createFileRoute } from "@tanstack/react-router";
import { LogisticsPage } from "@/components/logistics/LogisticsPages";
export const Route = createFileRoute("/logistics/inventory")({
  head: () => ({ meta: [{ title: "Inventory | Vexui Logistics" }] }),
  component: () => <LogisticsPage kind="inventory" />,
});
