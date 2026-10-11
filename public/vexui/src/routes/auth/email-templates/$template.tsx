import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmailTemplateDetail } from "@/components/auth/pages/EmailTemplatesApp";

export const Route = createFileRoute("/auth/email-templates/$template")({
  component: EmailTemplateRoute,
});

function EmailTemplateRoute() {
  const { template } = Route.useParams();
  return (
    <AppShell>
      <EmailTemplateDetail id={template} />
    </AppShell>
  );
}
