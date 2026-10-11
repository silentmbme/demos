import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/verify-email/cover")({
  component: () => <AuthFlowApp flow="verify-email" variant="cover" />,
});
