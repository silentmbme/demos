import { createFileRoute } from "@tanstack/react-router";
import { FinancePage } from "@/components/finance/FinancePages";
export const Route = createFileRoute("/finance/transactions")({
  head: () => ({ meta: [{ title: "Transactions | Vexui Finance" }] }),
  component: () => <FinancePage kind="transactions" />,
});
