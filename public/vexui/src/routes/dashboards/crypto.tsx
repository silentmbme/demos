import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CryptoDashboard } from "@/components/dashboard/CryptoDashboard";

export const Route = createFileRoute("/dashboards/crypto")({
  head: () => ({ meta: [{ title: "Crypto Dashboard | Vexui" }] }),
  component: () => (
    <AppShell>
      <CryptoDashboard />
    </AppShell>
  ),
});
