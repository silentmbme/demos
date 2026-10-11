import { createFileRoute } from "@tanstack/react-router";
import { Error404Page } from "@/components/auth/pages/ErrorPagesApp";
export const Route = createFileRoute("/auth/errors/404")({ component: Error404Page });
