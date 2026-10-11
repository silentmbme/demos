import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/medicine-catalog.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hospital/pharmacy" });
  },
});
