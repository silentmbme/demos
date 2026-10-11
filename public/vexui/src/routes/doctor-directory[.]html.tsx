import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/doctor-directory.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hospital/doctors" });
  },
});
