import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";

export const Route = createFileRoute("/auth/forgot-password/cover")({
  component: () => <AuthFlowApp flow="forgot-password" variant="cover" />,
});
