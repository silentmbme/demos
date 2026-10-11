import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/reset-password/cover")({
  component: () => <AuthFlowApp flow="reset-password" variant="cover" />,
});
