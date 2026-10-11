import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/verify-email/basic")({
  component: () => <AuthFlowApp flow="verify-email" variant="basic" />,
});
