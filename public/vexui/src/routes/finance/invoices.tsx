import { createFileRoute } from "@tanstack/react-router";
import { FinancePage } from "@/components/finance/FinancePages";
export const Route = createFileRoute("/finance/invoices")({
  head: () => ({ meta: [{ title: "Invoices | Vexui Finance" }] }),
  component: () => <FinancePage kind="invoices" />,
});
