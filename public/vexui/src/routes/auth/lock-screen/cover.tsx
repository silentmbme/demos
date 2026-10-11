import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowApp } from "@/components/auth/pages/AuthFlowApp";
export const Route = createFileRoute("/auth/lock-screen/cover")({
  component: () => <AuthFlowApp flow="lock-screen" variant="cover" />,
});
