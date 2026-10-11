import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { InvoiceDetailsApp } from "@/components/pages/InvoiceDetailsApp";
export const Route = createFileRoute("/invoices/detail")({
  component: () => (
    <AppShell>
      <InvoiceDetailsApp />
    </AppShell>
  ),
});
