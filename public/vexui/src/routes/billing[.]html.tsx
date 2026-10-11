import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/billing.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hospital/billing" });
  },
});
