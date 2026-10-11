import { createFileRoute } from "@tanstack/react-router";
import { ErrorPage } from "@/components/auth/pages/ErrorPagesApp";
export const Route = createFileRoute("/$")({ component: () => <ErrorPage id="404" /> });
