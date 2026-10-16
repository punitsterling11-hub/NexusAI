import { useMemo, useState } from "react";
import { CalendarDays, FolderKanban, Grid2X2, List, Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { projects, schedules } from "@/lib/dashboard-data";

function PageHeading({ icon: Icon, eyebrow, title, description }: { icon: typeof FolderKanban; eyebrow: string; title: string; description: string }) {
  return <section className="section-page-heading">
    <div className="section-page-icon"><Icon /></div>
    <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
  </section>;
}

export function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [view, setView] = useState<"grid" | "list">("grid");
  const filteredProjects = useMemo(() => projects.filter(project =>
    project.name.toLowerCase().includes(query.toLowerCase()) &&
    (status === "All Status" || project.status === status),
  ), [query, status]);

  return <DashboardLayout>
    <div className="dashboard-content">
      <PageHeading icon={FolderKanban} eyebrow="Automation workspace" title="Projects" description="Review project health, schedules, and recent activity across your automation workspace." />
      <section className="panel projects-page-panel">
        <div className="panel-head">
          <h2>All Projects <span className="panel-count">{filteredProjects.length} of {projects.length}</span></h2>
          <div className="table-tools">
            <label className="table-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects..." aria-label="Search projects" /></label>
            <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter projects by status"><option>All Status</option><option>Active</option><option>Paused</option></select>
            <div className="view-toggle" role="group" aria-label="Project view">
              <Button type="button" variant={view === "grid" ? "default" : "ghost"} size="icon" aria-label="Card view" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 /></Button>
              <Button type="button" variant={view === "list" ? "default" : "ghost"} size="icon" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")}><List /></Button>
            </div>
          </div>
        </div>
        {filteredProjects.length > 0 && view === "grid" ? <div className="project-card-grid">
          {filteredProjects.map(project => {
            const Icon = project.icon;
            return <article key={project.name} className={`project-card tone-${project.tone}`}>
              <div className="project-card-top"><span className={`project-icon ${project.tone}`}><Icon /></span><span className={`status-pill ${project.status.toLowerCase()}`}>{project.status}</span></div>
              <h3>{project.name}</h3><p>{project.desc}</p>
              <span className="type-chip">{project.type}</span>
              <div className="project-card-metrics"><div><span>Schedules</span><strong>{project.schedules}</strong></div><div><span>Recent run</span><strong>{project.run}</strong></div></div>
              <div className="project-card-success"><div><span>Success rate</span><strong>{project.success}%</strong></div><div className="progress"><i style={{ width: `${project.success}%` }} /></div></div>
            </article>;
          })}
        </div> : filteredProjects.length > 0 ? <div className="table-scroll">
          <table>
            <thead><tr><th>Project</th><th>AI Type</th><th>Schedules</th><th>Status</th><th>Last Run</th><th>Success Rate</th></tr></thead>
            <tbody>{filteredProjects.map(project => {
              const Icon = project.icon;
              return <tr key={project.name}>
                <td><div className="project-name"><span className={`project-icon ${project.tone}`}><Icon /></span><div><strong>{project.name}</strong><span>{project.desc}</span></div></div></td>
                <td><span className="type-chip">{project.type}</span></td>
                <td><strong>{project.schedules}</strong><span className="cell-sub">{project.active}</span></td>
                <td><span className={`status-pill ${project.status.toLowerCase()}`}>{project.status}</span></td>
                <td>{project.run}</td>
                <td><strong>{project.success}%</strong><div className="progress"><i style={{ width: `${project.success}%` }} /></div></td>
              </tr>;
            })}</tbody>
          </table>
        </div> : <div className="empty-state">No projects match your filters.</div>}
      </section>
    </div>
  </DashboardLayout>;
}

export function SchedulesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Schedules");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(schedules.map(schedule => [schedule.project, true])));

  const filteredSchedules = useMemo(() => schedules.filter(schedule => {
    const isEnabled = enabled[schedule.project];
    return schedule.project.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "All Schedules" || (filter === "Enabled" ? isEnabled : !isEnabled));
  }), [enabled, filter, query]);
  const enabledCount = schedules.filter(schedule => enabled[schedule.project]).length;

  return <DashboardLayout>
    <div className="dashboard-content">
      <PageHeading icon={CalendarDays} eyebrow="Automation workspace" title="Schedules" description="Review upcoming runs and locally enable or pause project schedules." />
      <section className="panel schedules-page-panel">
        <div className="panel-head">
          <h2>Upcoming Schedules <span className="panel-count">{enabledCount} enabled</span></h2>
          <div className="table-tools">
            <label className="table-search"><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search schedules..." aria-label="Search schedules" /></label>
            <select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filter schedules"><option>All Schedules</option><option>Enabled</option><option>Paused</option></select>
          </div>
        </div>
        {filteredSchedules.length > 0 ? <div className="schedule-page-list">
          {filteredSchedules.map(schedule => {
            const project = projects.find(item => item.name === schedule.project);
            if (!project) return null;
            const Icon = project.icon;
            const isEnabled = enabled[schedule.project];
            return <div className="schedule-page-row" key={schedule.project}>
              <time>{schedule.time}</time>
              <span className={`project-icon ${project.tone}`}><Icon /></span>
              <div className="schedule-page-project"><strong>{project.name}</strong><span>{project.desc}</span></div>
              <span className="schedule-page-recurrence">{schedule.recurrence}</span>
              <span className={`status-pill ${isEnabled ? "active" : "paused"}`}>{isEnabled ? "Enabled" : "Paused"}</span>
              <button className={`toggle ${isEnabled ? "on" : "off"}`} aria-label={`${isEnabled ? "Pause" : "Enable"} ${project.name} schedule`} aria-pressed={isEnabled} onClick={() => setEnabled(current => ({ ...current, [schedule.project]: !current[schedule.project] }))}><i /></button>
            </div>;
          })}
        </div> : <div className="empty-state">No schedules match your filters.</div>}
      </section>
    </div>
  </DashboardLayout>;
}
