import { createFileRoute } from "@tanstack/react-router";
import { Error503Page } from "@/components/auth/pages/ErrorPagesApp";
export const Route = createFileRoute("/auth/errors/503")({ component: Error503Page });
