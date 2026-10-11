import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { InvoiceListApp } from "@/components/pages/InvoiceListApp";
export const Route = createFileRoute("/invoices/list")({
  component: () => (
    <AppShell>
      <InvoiceListApp />
    </AppShell>
  ),
});
