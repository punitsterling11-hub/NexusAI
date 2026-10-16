import { createFileRoute } from "@tanstack/react-router";
import { SchedulesPage } from "@/components/section-pages";

export const Route = createFileRoute("/schedules")({
  head: () => ({ meta: [{ title: "Schedules | Nexus AI" }] }),
  component: SchedulesPage,
});
