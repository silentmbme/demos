import { createFileRoute } from "@tanstack/react-router";
import { HrmPage } from "@/components/hrm/HrmPages";
export const Route = createFileRoute("/hrm/payroll")({
  head: () => ({ meta: [{ title: "Payroll | Vexui" }] }),
  component: () => <HrmPage kind="payroll" />,
});
