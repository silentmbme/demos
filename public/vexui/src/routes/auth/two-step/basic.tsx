import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/two-step/basic")({
  component: () => <AuthFlowApp flow="two-step" variant="basic" />,
});
