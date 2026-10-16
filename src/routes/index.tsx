import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  Activity, AlertTriangle, CalendarDays, Check, ChevronDown, Database, FileText,
  FolderKanban, Grid2X2, LayoutDashboard, List, MoreHorizontal, Play, Plus,
  RadioTower, Search, Sparkles, Workflow, X, Zap, ArrowUpRight, Upload, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";
import { projects } from "@/lib/dashboard-data";
import heroImage from "@/assets/ai-orchestrator-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Nexus AI — Automation Orchestrator" },
    { name: "description", content: "Monitor, schedule, and scale intelligent automations from one enterprise control center." },
    { property: "og:title", content: "Nexus AI — Automation Orchestrator" },
    { property: "og:description", content: "Enterprise control center for reliable AI automation." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Dashboard,
});

type IconType = typeof LayoutDashboard;

const activities = [
  { name: "FXStatementAI executed successfully", detail: "Completed in 24s · 32 KB", time: "10:10", ok: true },
  { name: "InvoiceProcessor executed", detail: "Completed in 40s · 804 KB", time: "08:35", ok: true },
  { name: "DataEnrichment failed", detail: "HTTP 500 · Timeout error", time: "08:50", ok: false },
  { name: "ReportGenerator executed successfully", detail: "Completed in 42s · 2.0 MB", time: "Yesterday", ok: true },
];

function Panel({ title, action, className = "", children }: { title: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return <section className={`panel ${className}`}><div className="panel-head"><h2>{title}</h2>{action}</div>{children}</section>;
}

function useCardSpotlight() {
  const cardRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      const point = pointerRef.current;
      if (cardRef.current && point) {
        cardRef.current.style.setProperty("--spotlight-x", `${point.x}px`);
        cardRef.current.style.setProperty("--spotlight-y", `${point.y}px`);
      }
      frameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    pointerRef.current = null;
  };

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
  }, []);

  return { cardRef, handlePointerMove, handlePointerLeave };
}

function StatCard({ icon: Icon, label, value, note, tone, bars }: { icon: IconType; label: string; value: string; note: string; tone: string; bars: number[] }) {
  const spotlight = useCardSpotlight();
  return <article ref={spotlight.cardRef} onPointerMove={spotlight.handlePointerMove} onPointerLeave={spotlight.handlePointerLeave} className={`stat-card tone-${tone}`}><div className="stat-icon"><Icon /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div><div className="spark-bars">{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div></article>;
}

function ExecutionChart() {
  return <div className="chart-wrap"><svg viewBox="0 0 700 190" role="img" aria-label="Execution overview for the last seven days" preserveAspectRatio="none"><defs><linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".5"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><g className="grid-lines"><path d="M38 24H684M38 62H684M38 100H684M38 138H684M38 176H684" /></g><path className="chart-fill" d="M38 110 L145 64 L252 104 L359 108 L466 65 L573 101 L680 38 L680 176 L38 176Z"/><path className="chart-success" d="M38 110 L145 64 L252 104 L359 108 L466 65 L573 101 L680 38"/><path className="chart-total" d="M38 87 L145 42 L252 84 L359 87 L466 41 L573 69 L680 14"/><path className="chart-failed" d="M38 168 L145 156 L252 166 L359 164 L466 153 L573 164 L680 163"/><g className="chart-points">{[[38,110],[145,64],[252,104],[359,108],[466,65],[573,101],[680,38]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="4" />)}</g></svg><div className="chart-labels">{["Sep 24","Sep 25","Sep 26","Sep 27","Sep 28","Sep 29","Sep 30"].map(v => <span key={v}>{v}</span>)}</div></div>;
}

function Donut() { return <div className="donut"><div><strong>94.4%</strong><span>Success Rate</span></div></div>; }

function ProjectTable({ query, status }: { query: string; status: string }) {
  const filtered = useMemo(() => projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) && (status === "All Status" || p.status === status)), [query, status]);
  return <div className="table-scroll"><table><thead><tr><th>#</th><th>Project</th><th>AI Type</th><th>Schedules</th><th>Status</th><th>Last Run</th><th>Success Rate</th><th>Actions</th></tr></thead><tbody>{filtered.map((p, idx) => <tr key={p.name}><td>{idx + 1}</td><td><div className="project-name"><span className={`project-icon ${p.tone}`}><p.icon /></span><div><strong>{p.name}</strong><span>{p.desc}</span></div></div></td><td><span className="type-chip">{p.type}</span></td><td><strong>{p.schedules}</strong><span className="cell-sub">{p.active}</span></td><td><span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span></td><td><span>{p.run}</span><span className="cell-sub success-text"><Check /> Success</span></td><td><strong>{p.success}%</strong><div className="progress"><i style={{ width: `${p.success}%` }} /></div></td><td><div className="row-actions"><Button variant="secondary" size="icon" aria-label={`Run ${p.name}`} title="Run project"><Play /></Button><Button variant="ghost" size="icon" aria-label={`More actions for ${p.name}`} title="More actions"><MoreHorizontal /></Button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No projects match your filters.</div>}</div>;
}

export function Dashboard() {
  const active = "Dashboard";
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("All Status"); const [view, setView] = useState<"grid"|"list">("list");
  return <DashboardLayout><div className="dashboard-content">
    <section className="welcome-banner"><img src={heroImage} width={1536} height={640} alt="Friendly AI orchestrator surrounded by flowing data" /><div className="welcome-copy"><span className="eyebrow"><Sparkles /> Intelligence layer online</span><h1>{active === "Dashboard" ? "Good evening, Punit." : active}</h1><p>{active === "Dashboard" ? "Your automation ecosystem is running smoothly. Here’s what’s happening today." : `Manage and monitor ${active.toLowerCase()} across your automation ecosystem.`}</p></div><div className="quote">“Automate today,<br/><em>brighter tomorrow.</em>”<span>— Nexus AI</span></div></section>
    <section className="stats-grid"><StatCard icon={FolderKanban} label="Total Projects" value="5" note="↑ 2 new this week" tone="amber" bars={[25,45,65,40,72,90]}/><StatCard icon={CalendarDays} label="Active Schedules" value="12" note="↑ 3 enabled" tone="green" bars={[20,35,48,80,66,95]}/><StatCard icon={Play} label="Total Executions (30d)" value="18" note="↑ 68% vs yesterday" tone="violet" bars={[28,42,67,58,82,96]}/><StatCard icon={AlertTriangle} label="Failed Executions (30d)" value="1" note="↓ 75% vs yesterday" tone="red" bars={[55,82,35,70,45,60]}/></section>
    <section className="analytics-grid"><Panel title="Execution Overview (Last 7 Days)" action={<div className="legend"><span className="success-dot"/>Successful <span className="danger-dot"/>Failed <span className="blue-dot"/>Total</div>}><ExecutionChart /></Panel><Panel title="Execution Success Rate" action={<button className="range-button">Last 7 Days <ChevronDown /></button>}><div className="success-panel"><Donut/><div className="rate-list"><div><span><i className="success-dot"/>Success</span><b>17 <small>94.4%</small></b></div><div><span><i className="danger-dot"/>Failed</span><b>1 <small>5.6%</small></b></div><div><span><i className="blue-dot"/>Running</span><b>0 <small>0.0%</small></b></div><div><span><i className="muted-dot"/>Pending</span><b>0 <small>0.0%</small></b></div></div></div></Panel><Panel title="Project Status"><div className="project-status"><div><i className="success-dot"/><span>Running</span><b>2</b></div><div><i className="amber-dot"/><span>Paused</span><b>1</b></div><div><i className="muted-dot"/><span>Disabled</span><b>0</b></div><div><i className="cyan-dot"/><span>Healthy</span><b>4</b></div></div></Panel><Panel title="Quick Actions"><div className="quick-actions"><Button size="sm"><Plus/>New Project</Button><Button size="sm" variant="violet"><Plus/>Create Schedule</Button><Button size="sm" variant="secondary"><Upload/>Import / Export</Button><Button size="sm" variant="secondary"><BookOpen/>API Documentation</Button></div></Panel></section>
    <section className="workspace-grid"><Panel title="AI Projects & Schedules" className="projects-panel" action={<div className="table-tools"><label className="table-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search projects..." aria-label="Search projects"/></label><select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Filter by status"><option>All Status</option><option>Active</option><option>Paused</option></select><div className="view-toggle"><Button variant={view === "grid" ? "default" : "ghost"} size="icon" onClick={()=>setView("grid")} aria-label="Grid view"><Grid2X2/></Button><Button variant={view === "list" ? "default" : "ghost"} size="icon" onClick={()=>setView("list")} aria-label="List view"><List/></Button></div></div>}><p className="panel-subtitle">Manage your automation projects and their schedules</p><ProjectTable query={query} status={status}/></Panel><Panel title="Recent Executions" action={<button className="text-action">View All <ArrowUpRight/></button>}><div className="execution-list">{projects.map((p,i)=><div key={p.name}><span className={`project-icon ${p.tone}`}><p.icon/></span><div><strong>{p.name}</strong><small>{i === 3 ? "Failed · 34s" : `Today ${10-i}:0${i} · ${24+i*6}s`}</small></div>{i === 3 ? <X className="result-fail"/> : <Check className="result-ok"/>}</div>)}</div><div className="insight-strip"><Activity/><div><strong>All system executions</strong><span>89% successful in the last 7 days</span></div></div></Panel></section>
    <section className="bottom-grid"><Panel title="Upcoming Schedules" action={<button className="text-action">View All <ArrowUpRight/></button>}><div className="schedule-list">{projects.map((p,i)=><div key={p.name}><time>{["08:30","09:00","09:30","11:00","16:00"][i]}</time><span className={`project-icon ${p.tone}`}><p.icon/></span><strong>{p.name}</strong><small>{i<2 ? "Mon – Fri" : i===2 ? "Daily" : "Weekly"}</small><button className="toggle on" aria-label={`Disable ${p.name}`}><i/></button></div>)}</div></Panel><Panel title="Recent Activity" action={<button className="text-action">View All <ArrowUpRight/></button>}><div className="activity-list">{activities.map(a=><div key={a.name} className={a.ok?"ok":"fail"}><i/><span className="activity-icon">{a.ok?<Check/>:<AlertTriangle/>}</span><div><strong>{a.name}</strong><small>{a.detail}</small></div><time>{a.time}</time></div>)}</div></Panel><Panel title="System Health" action={<button className="text-action">View Details <ArrowUpRight/></button>}><div className="health-list">{[["Scheduler Service","99.9%"],["Worker Service","98.5%"],["Redis (Queue)","99.7%"],["PostgreSQL Database","99.9%"],["AI/LLM Services","98.8%"]].map(([name,val],i)=><div key={name}><span className={`health-icon h${i}`}><RadioTower/></span><strong>{name}</strong><span className="healthy"><Check/>Healthy</span><b>{val}</b><span className="signal">▂▄▆█</span></div>)}</div><div className="scale-strip"><Zap/><div><strong>AI Automation at Scale</strong><span>Automate today. Build a smarter tomorrow.</span></div><ArrowUpRight/></div></Panel></section>
  </div></DashboardLayout>;
}
