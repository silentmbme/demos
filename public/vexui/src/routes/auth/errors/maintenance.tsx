import { createFileRoute } from "@tanstack/react-router";
import { MaintenanceSystemPage } from "@/components/auth/pages/ErrorPagesApp";
export const Route = createFileRoute("/auth/errors/maintenance")({
  component: MaintenanceSystemPage,
});
