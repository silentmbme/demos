import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CreateInvoiceApp } from "@/components/pages/CreateInvoiceApp";
export const Route = createFileRoute("/invoices/create")({
  component: () => (
    <AppShell>
      <CreateInvoiceApp />
    </AppShell>
  ),
});
