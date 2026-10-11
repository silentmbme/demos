import { createFileRoute } from "@tanstack/react-router";
import { RestaurantPosPage } from "@/components/dashboard/RestaurantPos";
export const Route = createFileRoute("/dashboards/restaurant-pos")({
  head: () => ({ meta: [{ title: "Restaurant POS | Vexui" }] }),
  component: RestaurantPosPage,
});
