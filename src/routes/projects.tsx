import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/components/section-pages";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects | Nexus AI" }] }),
  component: ProjectsPage,
});
