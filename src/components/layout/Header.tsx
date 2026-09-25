import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Bell, ChevronDown, LogOut, Search, Check, RefreshCw, Sparkles, User, Shield, Award, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../services/dataService";
import { AppNotification } from "../../types";

export const Header: React.FC = () => {
  const { currentUser, currentRole, loginAsDemoUser, logout } = useAuth();
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    projects: any[];
    requirements: any[];
    tasks: any[];
    evidence: any[];
  }>({ projects: [], requirements: [], tasks: [], evidence: [] });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => dataService.getNotifications(currentUser?.id));

  const createRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const firstName = currentUser?.fullName?.split(" ")[0] || "User";

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node)) setShowCreate(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setSearchResults(dataService.globalSearch(q));
    } else {
      setSearchResults({ projects: [], requirements: [], tasks: [], evidence: [] });
    }
  };

  const handleMarkAllRead = () => {
    dataService.markAllNotificationsRead(currentUser?.id);
    setNotifications(dataService.getNotifications(currentUser?.id));
  };

  const handleNotificationClick = (n: AppNotification) => {
    dataService.markNotificationRead(n.id);
    setNotifications(dataService.getNotifications(currentUser?.id));
    setShowNotifications(false);
    if (n.link) navigate(n.link);
  };

  const handleResetData = () => {
    dataService.resetDemoData();
    setShowProfile(false);
    window.location.reload();
  };

  return (
    <header className="top-header">
      {/* Left: Institution info & Search bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: 1 }}>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          Apex Institute of Technology
          <span style={{ color: "var(--border-highlight)" }}>·</span>
          AY 2026–2027
          <span style={{ marginLeft: '0.5rem', background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em' }}>DEMO MODE</span>
        </div>

        {/* Global Search Input */}
        <div style={{ position: "relative", maxWidth: 320, width: "100%" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-muted)" }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "2rem", height: 34, fontSize: "0.8125rem", borderRadius: "var(--radius-sm)" }}
            placeholder="Search projects, tasks, evidence..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSearchModal(true)}
          />

          {/* Search Dropdown Results */}
          {showSearchModal && searchQuery.trim().length >= 2 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: "0.75rem", zIndex: 300, maxHeight: 360, overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Search Results</span>
                <button className="btn-icon" style={{ width: 20, height: 20 }} onClick={() => setShowSearchModal(false)}>✕</button>
              </div>

              {searchResults.projects.length === 0 && searchResults.requirements.length === 0 && searchResults.tasks.length === 0 && searchResults.evidence.length === 0 ? (
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", padding: "0.5rem" }}>No matching records found</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {searchResults.requirements.map(r => (
                    <div key={r.id} onClick={() => { navigate("/requirements"); setShowSearchModal(false); }} style={{ padding: "0.4rem 0.6rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-xs)", cursor: "pointer", fontSize: "0.8125rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--info)", fontWeight: 700 }}>REQ · </span>
                      <strong style={{ color: "var(--text-primary)" }}>{r.title}</strong>
                    </div>
                  ))}
                  {searchResults.tasks.map(t => (
                    <div key={t.id} onClick={() => { navigate("/tasks"); setShowSearchModal(false); }} style={{ padding: "0.4rem 0.6rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-xs)", cursor: "pointer", fontSize: "0.8125rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--warning)", fontWeight: 700 }}>TASK · </span>
                      <strong style={{ color: "var(--text-primary)" }}>{t.title}</strong>
                    </div>
                  ))}
                  {searchResults.evidence.map(e => (
                    <div key={e.id} onClick={() => { navigate("/evidence"); setShowSearchModal(false); }} style={{ padding: "0.4rem 0.6rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-xs)", cursor: "pointer", fontSize: "0.8125rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--success)", fontWeight: 700 }}>EVIDENCE · </span>
                      <strong style={{ color: "var(--text-primary)" }}>{e.title}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* + Create Action Menu */}
        <div style={{ position: "relative" }} ref={createRef}>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate((v) => !v)} style={{ gap: "0.35rem", paddingRight: "0.6rem" }}>
            <Plus size={13} strokeWidth={2.5} /> Create <ChevronDown size={11} style={{ opacity: 0.7 }} />
          </button>
          {showCreate && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: "0.375rem", width: 200, zIndex: 200 }}>
              {[
                { label: "New Requirement", path: "/requirements" },
                { label: "New Task", path: "/tasks" },
                { label: "Upload Evidence", path: "/evidence" },
                { label: "Propose Idea", path: "/ideas" },
                { label: "Invite Teammate", path: "/team" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setShowCreate(false);
                    navigate(item.path);
                  }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", fontSize: "0.8375rem", color: "var(--text-primary)", background: "transparent", border: "none", borderRadius: "var(--radius-xs)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            className="btn btn-icon btn-ghost"
            aria-label="Notifications"
            onClick={() => setShowNotifications((v) => !v)}
            style={{ position: "relative" }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: "var(--danger)", borderRadius: "50%", border: "1.5px solid var(--bg-surface)" }} />
            )}
          </button>

          {showNotifications && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", width: 340, zIndex: 250, overflow: "hidden" }}>
              <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>Notifications ({unreadCount} new)</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "var(--info)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8125rem" }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border-subtle)", background: n.isRead ? "transparent" : "var(--bg-surface-elevated)", cursor: "pointer", transition: "background 100ms ease" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-elevated)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = n.isRead ? "transparent" : "var(--bg-surface-elevated)")}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.2rem" }}>
                        <span style={{ fontWeight: n.isRead ? 600 : 700, fontSize: "0.8125rem", color: "var(--text-primary)" }}>{n.title}</span>
                        {!n.isRead && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--info)", display: "inline-block" }} />}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4, margin: 0 }}>{n.message}</p>
                      <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "inline-block" }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Switcher */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid transparent" }}
            onClick={() => setShowProfile((v) => !v)}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
          >
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
              {firstName[0]}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 650, color: "var(--text-primary)" }}>{firstName}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{(currentRole || "").replace("_", " ")}</div>
            </div>
            <ChevronDown size={14} style={{ opacity: 0.6, marginLeft: "0.2rem" }} />
          </div>

          {showProfile && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: "0.5rem", width: 230, zIndex: 200 }}>
              <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border-subtle)", marginBottom: "0.35rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>{currentUser?.fullName}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{currentUser?.email}</div>
              </div>

              {/* Demo Switchers */}
              <div style={{ padding: "0.25rem 0.5rem", fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                Quick Demo Persona:
              </div>
              {[
                { role: "student" as const, label: "Student: Belgin C." },
                { role: "mentor" as const, label: "Mentor: Dr. Meena" },
                { role: "evaluator" as const, label: "Evaluator: Prof. Rajesh" },
                { role: "admin" as const, label: "Admin: Dr. Sunita" },
              ].map((p) => (
                <button
                  key={p.role}
                  onClick={() => {
                    loginAsDemoUser(p.role);
                    setShowProfile(false);
                    navigate("/");
                  }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0.4rem 0.75rem", fontSize: "0.8125rem", color: "var(--text-secondary)", background: "transparent", border: "none", borderRadius: "var(--radius-xs)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>{p.label}</span>
                  {(currentRole === p.role || (p.role === 'admin' && currentRole === 'institution_admin')) && <Check size={13} style={{ color: "var(--success)" }} />}
                </button>
              ))}

              <div style={{ height: 1, background: "var(--border-subtle)", margin: "0.35rem 0" }} />

              <button
                onClick={handleResetData}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.45rem 0.75rem", fontSize: "0.8125rem", color: "var(--text-primary)", background: "transparent", border: "none", borderRadius: "var(--radius-xs)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-surface-elevated)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <RefreshCw size={13} /> Reset Demo Data
              </button>

              <button
                onClick={() => {
                  setShowProfile(false);
                  logout();
                }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.45rem 0.75rem", fontSize: "0.8125rem", color: "var(--danger)", background: "transparent", border: "none", borderRadius: "var(--radius-xs)", cursor: "pointer", fontFamily: "var(--font-sans)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--danger-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};