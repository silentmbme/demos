import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/register")({
  component: () => <AuthFlowApp flow="sign-up" variant="basic" />,
});
