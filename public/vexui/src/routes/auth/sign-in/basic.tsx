import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/sign-in/basic")({
  component: () => <AuthFlowApp flow="sign-in" variant="basic" />,
});
