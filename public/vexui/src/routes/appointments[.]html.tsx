import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/appointments.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hospital/appointments" });
  },
});
