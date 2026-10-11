import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { DatePickersApp } from "@/components/pages/DatePickersApp";

export const Route = createFileRoute("/forms/date-pickers")({
  component: () => (
    <AppShell>
      <DatePickersApp />
    </AppShell>
  ),
});
