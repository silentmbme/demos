import { createFileRoute } from "@tanstack/react-router";
import { LogisticsPage } from "@/components/logistics/LogisticsPages";
export const Route = createFileRoute("/logistics/stock-transfer")({
  head: () => ({ meta: [{ title: "Stock Transfer | Vexui Logistics" }] }),
  component: () => <LogisticsPage kind="stock-transfer" />,
});
