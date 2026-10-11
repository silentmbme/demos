import { createFileRoute } from "@tanstack/react-router";
import { Error500Page } from "@/components/auth/pages/ErrorPagesApp";
export const Route = createFileRoute("/auth/errors/500")({ component: Error500Page });
