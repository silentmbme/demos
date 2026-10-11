import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/floor-layout.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hospital/wards" });
  },
});
