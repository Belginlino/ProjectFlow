import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, ShieldCheck, Inbox, GraduationCap, Award, BookOpen, 
  FileText, CheckSquare, Share2, Activity, History, GitMerge, Lightbulb, 
  Users, Settings, Building2, BarChart3, Database, FileSpreadsheet 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../types";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentRole } = useAuth();
  
  const roleNavigations: Record<UserRole | 'student', Array<{ label: string; items: Array<{ to: string; label: string; icon: React.ReactNode }> }>> = {
    student: [
      { label: "Main", items: [
          { to: "/",             label: "Dashboard",        icon: <LayoutDashboard size={15} /> },
          { to: "/",             label: "My Projects",      icon: <Building2 size={15} /> },
          { to: "/tasks",        label: "My Tasks",         icon: <CheckSquare size={15} /> },
          { to: "/evidence",     label: "Evidence",         icon: <ShieldCheck size={15} /> },
          { to: "/github",       label: "GitHub",           icon: <GitMerge size={15} /> },
          { to: "/mentor",       label: "Mentor",           icon: <Users size={15} /> },
          { to: "/contribution", label: "Contribution",     icon: <Award size={15} /> },
          { to: "/evaluation",   label: "Evaluation",       icon: <FileText size={15} /> },
          { to: "/portfolio",    label: "Portfolio",        icon: <GraduationCap size={15} /> },
      ]}
    ],
    mentor: [
      { label: "Main", items: [
          { to: "/",             label: "Dashboard",             icon: <LayoutDashboard size={15} /> },
          { to: "/",             label: "Evidence Reviews", icon: <ShieldCheck size={15} /> },
          { to: "/reviews",      label: "Change Requests",  icon: <FileText size={15} /> },
          { to: "/health",       label: "Project Health",   icon: <Activity size={15} /> },
      ]}
    ],
    evaluator: [
      { label: "Main", items: [
          { to: "/",             label: "Dashboard",             icon: <LayoutDashboard size={15} /> },
          { to: "/evidence",     label: "Evidence",         icon: <ShieldCheck size={15} /> },
          { to: "/contribution", label: "Contribution",     icon: <Award size={15} /> },
          { to: "/evaluation",   label: "Viva",             icon: <Users size={15} /> },
          { to: "/evaluation",   label: "Evaluation",       icon: <FileText size={15} /> },
      ]}
    ],
    institution_admin: [
      { label: "Overview", items: [
          { to: "/",             label: "Institution Analytics", icon: <LayoutDashboard size={15} /> },
      ]},
      { label: "Academic Operations", items: [
          { to: "/admin",        label: "Projects & Teams", icon: <Building2 size={15} /> },
      ]},
      { label: "Governance", items: [
          { to: "/requirements", label: "Requirements",     icon: <FileText size={15} /> },
          { to: "/evaluation",   label: "Evaluation Framework", icon: <Award size={15} /> },
          { to: "/outcomes",     label: "CO / PO Mapping",  icon: <BookOpen size={15} /> },
      ]},
      { label: "Monitoring", items: [
          { to: "/health",       label: "Project Health",   icon: <Activity size={15} /> },
          { to: "/evidence",     label: "Evidence Verification", icon: <ShieldCheck size={15} /> },
      ]},
      { label: "Reporting", items: [
          { to: "/audit",        label: "Audit Logs",       icon: <History size={15} /> },
      ]}
    ],
    dept_admin: [
      { label: "Overview", items: [
          { to: "/",             label: "Department Analytics", icon: <LayoutDashboard size={15} /> },
      ]},
      { label: "Academic Operations", items: [
          { to: "/admin",        label: "Projects & Teams", icon: <Building2 size={15} /> },
      ]},
      { label: "Governance", items: [
          { to: "/outcomes",     label: "CO / PO Mapping",  icon: <BookOpen size={15} /> },
      ]},
      { label: "Monitoring", items: [
          { to: "/health",       label: "Project Health",   icon: <Activity size={15} /> },
      ]}
    ]
  };

  const nav = roleNavigations[currentRole || 'student'] || roleNavigations['student'];

  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><GitMerge size={16} color="white" strokeWidth={2.5} /></div>
          <div>
            <div className="sidebar-logo-text">ProjectFlow</div>
            <span className="sidebar-logo-sub">
              {currentRole === 'mentor' ? 'Mentor Workspace' : 
               currentRole === 'evaluator' ? 'Evaluation Workspace' : 
               currentRole === 'institution_admin' ? 'Institutional Admin' : 
               'Student Workspace'}
            </span>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        {nav.map((group) => (
          <div key={group.label}>
            <div className="nav-section-label">{group.label}</div>
            {group.items.map((item) => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                end={item.to === "/"} 
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={onClose}
              >
                {item.icon}<span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">v1.0.0 Evidence-Centered Academic Platform</div>
    </aside>
  );
};