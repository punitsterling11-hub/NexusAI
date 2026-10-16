import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight, Bell, Bot, Braces, CalendarDays, ChevronDown, CircleGauge,
  FolderKanban, KeyRound, LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen,
  Play, Search, Settings, Sparkles, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardPath = "/dashboard" | "/projects" | "/schedules";
type NavItem = { label: string; icon: typeof LayoutDashboard; to?: DashboardPath; badge?: string; live?: boolean };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Projects", icon: FolderKanban, to: "/projects", badge: "5" },
  { label: "Schedules", icon: CalendarDays, to: "/schedules", badge: "12" },
  { label: "Executions", icon: Play, badge: "48" },
  { label: "Monitoring", icon: CircleGauge, live: true },
  { label: "AI Assistant", icon: Sparkles },
  { label: "API Configuration", icon: Braces },
  { label: "Credentials", icon: KeyRound },
  { label: "Users & Roles", icon: Users },
  { label: "Settings", icon: Settings },
];

function Logo() {
  return <div className="brand-mark"><span>AI</span></div>;
}

function Sidebar({
  collapsed,
  mobileOpen,
  closeMobile,
  setCollapsed,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  closeMobile: () => void;
  setCollapsed: (value: boolean) => void;
}) {
  const { pathname } = useLocation();
  const activePath = pathname === "/" ? "/dashboard" : pathname;

  return <>
    {mobileOpen && <button aria-label="Close navigation overlay" className="sidebar-overlay" onClick={closeMobile} />}
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
      <div className="brand-row">
        <Logo />
        {!collapsed && <div className="brand-copy"><strong>Nexus AI</strong><span>Automation Orchestrator</span></div>}
        <Button aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} variant="ghost" size="icon" className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>
      <nav className="nav-list" aria-label="Main navigation">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.to === activePath;
          const contents = <><Icon /><span className="nav-label">{item.label}</span>{item.badge && <span className="nav-badge">{item.badge}</span>}{item.live && <span className="live-badge">Live</span>}</>;
          return item.to ? (
            <Link key={item.label} to={item.to} title={item.label} aria-current={isActive ? "page" : undefined} className={`nav-item ${isActive ? "active" : ""}`} onClick={closeMobile}>
              {contents}
            </Link>
          ) : (
            <div key={item.label} title={`${item.label} page coming soon`} aria-disabled="true" className="nav-item nav-item-disabled">
              {contents}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-spacer" />
      {!collapsed && <div className="ai-card"><div className="ai-orb"><Bot /></div><strong>AI Powered <Sparkles /></strong><p>Smarter automation. Greater productivity. Powered by Generative AI.</p><Button size="sm" className="w-full">Explore AI Insights <ArrowUpRight /></Button></div>}
      <div className="control-status"><Bot /><div className="nav-label"><span>Control Center</span><small><i /> Online · v1.6.3</small></div></div>
    </aside>
  </>;
}

function Header({ openMobile }: { openMobile: () => void }) {
  return <header className="topbar">
    <Button variant="ghost" size="icon" className="mobile-menu" aria-label="Open navigation" onClick={openMobile}><Menu /></Button>
    <div className="command-search"><Search /><input aria-label="Global search" placeholder="Search projects, schedules, executions..." /><kbd>Ctrl K</kbd></div>
    <div className="top-actions"><Button variant="ghost" size="icon" aria-label="Notifications" className="notification"><Bell /><span>3</span></Button><div className="avatar">PK</div><div className="user-copy"><strong>Punit Kumar</strong><span>Administrator</span></div><ChevronDown /></div>
  </header>;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return <div className="app-shell">
    <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} setCollapsed={setCollapsed} />
    <main className={`main ${collapsed ? "main-expanded" : ""}`}>
      <Header openMobile={() => setMobileOpen(true)} />
      {children}
    </main>
  </div>;
}
