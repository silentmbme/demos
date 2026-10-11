import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/patients.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hospital/patients" });
  },
});
