import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/reviews-list.html")({
  beforeLoad: () => {
    throw redirect({ to: "/hrm/reviews" });
  },
});
