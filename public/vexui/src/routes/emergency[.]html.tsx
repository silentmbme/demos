import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/emergency.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hospital/ambulance" });
  },
});
