import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmailTemplatesIndex } from "@/components/auth/pages/EmailTemplatesApp";
export const Route = createFileRoute("/auth/email-templates/")({
  component: () => (
    <AppShell>
      <EmailTemplatesIndex />
    </AppShell>
  ),
});
