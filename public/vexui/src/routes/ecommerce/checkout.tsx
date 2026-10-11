import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CheckoutApp } from "@/components/pages/CheckoutApp";

export const Route = createFileRoute("/ecommerce/checkout")({
  component: () => (
    <AppShell>
      <CheckoutApp />
    </AppShell>
  ),
});
