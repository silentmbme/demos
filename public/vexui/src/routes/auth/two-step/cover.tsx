import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/two-step/cover")({
  component: () => <AuthFlowApp flow="two-step" variant="cover" />,
});
