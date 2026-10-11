import { createFileRoute } from "@tanstack/react-router";
import { ErrorIndex } from "@/components/auth/pages/ErrorPagesApp";
export const Route = createFileRoute("/auth/errors/")({ component: ErrorIndex });
