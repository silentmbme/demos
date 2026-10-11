import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/forgot-password/basic")({
  component: () => <AuthFlowApp flow="forgot-password" variant="basic" />,
});
