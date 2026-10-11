import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/sign-up/basic")({
  component: () => <AuthFlowApp flow="sign-up" variant="basic" />,
});
