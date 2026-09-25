import React, { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { dataService } from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import { Evidence } from "../types";
import { ArrowRight, AlertTriangle, Activity, Shield, CheckSquare2, TrendingUp, ChevronRight, Clock, Plus } from "lucide-react";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import { userService } from "../services/userService";
import { UserProfile } from "../types";

const C = ({ value, size = 96, stroke = 8, color = "#111111" }: { value: number; size?: number; stroke?: number; color?: string }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - value / 100);
  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EBEBEB" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition:"stroke-dashoffset 800ms ease" }} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:"1.125rem", fontWeight:800, color:"#111" }}>{value}%</span>
      </div>
    </div>
  );
};

const SparkLine = ({
  data,
  color = "#111",
  h = 56,
  fillGradient = false,
  fillColor,
}: {
  data: number[];
  color?: string;
  h?: number;
  fillGradient?: boolean;
  fillColor?: string;
}) => {
  if (data.length < 2) return null;
  const W = 300;
  const padX = 8;
  const padY = 8;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const usableH = h - padY * 2;
  const usableW = W - padX * 2;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * usableW;
    const y = padY + (1 - (v - min) / range) * usableH;
    return { x, y };
  });

  const polylinePts = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const polygonPts = `${polylinePts} ${points[points.length - 1].x.toFixed(1)},${h} ${points[0].x.toFixed(1)},${h}`;
  const gradId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}-${h}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${h}`}
      preserveAspectRatio="none"
      style={{ display: "block", overflow: "hidden" }}
    >
      {fillGradient && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor || color} stopOpacity={0.12} />
            <stop offset="100%" stopColor={fillColor || color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
      )}
      {fillGradient && <polygon points={polygonPts} fill={`url(#${gradId})`} />}
      <polyline
        points={polylinePts}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PR = ({ label, value }: { label: string; value: number }) => {
  const c = value >= 75 ? "var(--success)" : value >= 50 ? "var(--warning)" : "var(--danger)";
  return (
    <div style={{ marginBottom:"0.625rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
        <span style={{ fontSize:"0.8125rem", color:"var(--text-secondary)", fontWeight:500 }}>{label}</span>
        <span style={{ fontSize:"0.8125rem", fontWeight:700, color:"var(--text-primary)" }}>{value}%</span>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width:`${value}%`, background:c }} /></div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { onOpenEvidence } = useOutletContext<{ onOpenEvidence: (ev: Evidence) => void }>();
  const { currentUser } = useAuth();
  
  const projects = dataService.getProjects();
  const project = projects[0];
  const firstName = currentUser?.fullName?.split(" ")[0] || "User";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [availableMentors, setAvailableMentors] = useState<UserProfile[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string>("");
  const [mentorRequestMessage, setMentorRequestMessage] = useState("");

  React.useEffect(() => {
    if (isMentorModalOpen && currentUser?.institutionId) {
      userService.getMentorsByInstitution(currentUser.institutionId).then(setAvailableMentors);
    }
  }, [isMentorModalOpen, currentUser]);

  const handleAssignMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !project) return;
    try {
      dataService.createMentorRequest(
        project.id,
        selectedMentor,
        currentUser?.id || "anon",
        currentUser?.institutionId || "inst",
        mentorRequestMessage
      );
      setIsMentorModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to send mentor request");
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    
    dataService.createProject(
      {
        title: newProjectTitle,
        description: newProjectDesc,
        status: 'draft',
        institutionId: currentUser?.institutionId || 'inst-default',
        academicYear: '2026-2027',
        semester: 'Fall',
        createdBy: currentUser?.id || "anon",
        team: {
          members: [{ uid: currentUser?.id || "anon", fullName: currentUser?.fullName || "User", email: '', projectRole: 'lead', joinedAt: new Date().toISOString() }],
        }
      },
      currentUser?.id || "anon",
      currentUser?.fullName || "User"
    );
    
    setIsCreateModalOpen(false);
    setIsCreateModalOpen(false);
    window.location.reload();
  };

  const pendingRequests = currentUser?.role === 'mentor' ? dataService.getMentorRequestsForMentor(currentUser.id) : [];

  const handleAcceptMentor = (reqId: string) => {
    dataService.respondToMentorRequest(reqId, 'accepted', currentUser!.id, currentUser!.fullName);
    window.location.reload();
  };

  const handleRejectMentor = (reqId: string) => {
    const reason = prompt("Optional rejection reason:");
    dataService.respondToMentorRequest(reqId, 'rejected', currentUser!.id, currentUser!.fullName, reason || undefined);
    window.location.reload();
  };

  const renderPendingRequests = () => {
    if (currentUser?.role !== 'mentor' || pendingRequests.length === 0) return null;
    return (
      <div className="card" style={{ marginBottom: "1.25rem", width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Mentor Requests ({pendingRequests.length})</div>
          <AlertTriangle size={16} style={{ color: "var(--warning)" }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {pendingRequests.map(req => {
            const proj = projects.find(p => p.id === req.projectId);
            return (
              <div key={req.id} style={{ padding: "1rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", textAlign: 'left' }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.25rem", color: 'var(--text-primary)' }}>{proj?.title || "Project"}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Message: {req.requestMessage || 'No message'}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button size="sm" style={{ flex: 1 }} onClick={() => handleAcceptMentor(req.id)}>Accept</Button>
                  <Button size="sm" variant="outline" style={{ flex: 1 }} onClick={() => handleRejectMentor(req.id)}>Reject</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!project) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: pendingRequests.length > 0 ? 'auto' : '60vh', textAlign: 'center', marginBottom: pendingRequests.length > 0 ? '2rem' : '0' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Welcome, {currentUser?.role === 'mentor' ? 'Mentor ' : ''}{firstName}!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {currentUser?.role === 'mentor' ? "You don't have any active projects to mentor yet." : "You don't have any active projects yet."}
          </p>
          {currentUser?.role !== 'mentor' && currentUser?.role !== 'evaluator' && (
            <button className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }} onClick={() => setIsCreateModalOpen(true)}>
              <CheckSquare2 size={18} /> Create Your First Project
            </button>
          )}
        </div>
        
        {renderPendingRequests()}
        
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Project"
          subtitle="Set up your workspace to start tracking tasks and evidence."
        >
          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                className="form-input"
                placeholder="e.g. Smart Campus Energy Monitoring"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-input"
                placeholder="Briefly describe the project goals..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                rows={3}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button type="submit" leftIcon={<Plus size={16} />}>Create Project</Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  const requirements = dataService.getRequirements(project.id);
  const tasks = dataService.getTasks(project.id);
  const evidence = dataService.getEvidence(project.id);
  const alerts = dataService.getHealthAlerts(project.id);

  const done = tasks.filter(t => t.status === "done").length;
  const inProg = tasks.filter(t => t.status === "in_progress").length;
  const verified = evidence.filter(e => ["mentor_verified","evaluator_verified"].includes(e.verificationStatus)).length;
  const evPct = Math.round((evidence.filter(e => ["mentor_verified","evaluator_verified","submitted"].includes(e.verificationStatus)).length / Math.max(evidence.length,1)) * 100);
  const taskPct = Math.round(done / Math.max(tasks.length,1) * 100);
  const reqPct = Math.round(requirements.filter(r => r.status === "verified").length / Math.max(requirements.length,1) * 100);
  const healthPct = Math.max(10, 100 - alerts.length * 15);
  const weekTasks = [3,5,4,7,6,8, Math.max(1,(done % 8)+2)];
  const weekEv = [1,2,2,4,3,5, Math.max(1,(verified % 5)+1)];

  const STATUS_COLOR: Record<string,string> = { done:"var(--success)", in_progress:"var(--info)", review:"var(--warning)", testing:"var(--purple-500)", backlog:"var(--text-muted)", todo:"var(--text-muted)" };

  const getKPIsByRole = () => {
    if (currentUser?.role === 'mentor') {
      return [
        { v:1, l:"Assigned Projects", s:"monitoring active" },
        { v:evidence.filter(e => e.verificationStatus === 'submitted').length, l:"Pending Evidence", s:"needs verification" },
        { v:0, l:"Change Requests", s:"open for review" },
        { v:alerts.length > 0 ? 1 : 0, l:"Projects At Risk", s:"health issues" }
      ];
    } else if (currentUser?.role === 'evaluator') {
      return [
        { v:1, l:"Projects Awaiting Evaluation", s:"ready for review" },
        { v:1, l:"Viva Sessions", s:"scheduled oral defense" },
        { v:1, l:"Pending Scorecards", s:"to be filled" },
        { v:0, l:"Completed Evaluations", s:"this semester" }
      ];
    } else if (currentUser?.role === 'institution_admin' || currentUser?.role === 'dept_admin') {
      return [
        { v:1, l:"Active Projects", s:"institution wide" },
        { v:4, l:"Students", s:"enrolled" },
        { v:2, l:"Mentors", s:"assigned" },
        { v:evidence.filter(e => e.verificationStatus === 'submitted').length, l:"Pending Reviews", s:"bottleneck identified" },
        { v:alerts.length > 0 ? 1 : 0, l:"At-Risk Projects", s:"requires intervention" },
        { v:0, l:"Completed Evaluations", s:"this semester" }
      ];
    } else {
      return [
        { v:1, l:"Active Projects", s:"1 project tracked" },
        { v:evidence.filter(e => e.verificationStatus === 'submitted').length, l:"Pending Evidence", s:"needs verification" },
        { v:evidence.filter(e => e.verificationStatus === 'mentor_verified').length, l:"Mentor Reviews", s:"completed sign-offs" },
        { v:tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date()).length, l:"Overdue Tasks", s:"attention needed" },
      ];
    }
  };

  const roleKPIs = getKPIsByRole();

  const roleSubtitle = 
    currentUser?.role === 'mentor' ? 'Mentor Workspace • Review evidence, guide revisions, and monitor project progress.' :
    currentUser?.role === 'evaluator' ? 'Evaluation Workspace • Evaluate projects using verified evidence and structured assessment.' :
    (currentUser?.role === 'institution_admin' || currentUser?.role === 'dept_admin') ? 'Institutional Administration • Monitor project activity, academic outcomes, evidence, and evaluation across the institution.' :
    'Student Workspace • Track your project work and turn it into verified evidence.';

  const roleTitle = 
    currentUser?.role === 'mentor' ? 'Mentor Workspace' :
    currentUser?.role === 'evaluator' ? 'Evaluation Workspace' :
    (currentUser?.role === 'institution_admin' || currentUser?.role === 'dept_admin') ? 'Institutional Administration' :
    `Welcome back, ${firstName}`;

  const isAdmin = currentUser?.role === 'institution_admin' || currentUser?.role === 'dept_admin';



  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <h1 style={{ fontSize:"1.875rem", fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.03em" }}>
              {roleTitle}
            </h1>
            {!isAdmin && (
              <span className="badge badge-verified" style={{ textTransform: 'capitalize' }}>
                {(currentUser?.role || 'student').replace('_', ' ')}
              </span>
            )}
          </div>
          <p style={{ fontSize:"0.9375rem", color:"var(--text-muted)", maxWidth: 650 }}>{roleSubtitle}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentUser?.role === 'mentor' ? (
            <>
              <Link to="/reviews" className="btn btn-primary btn-sm">Review Evidence</Link>
              <Link to="/graph" className="btn btn-outline btn-sm">Create Feedback</Link>
            </>
          ) : currentUser?.role === 'evaluator' ? (
            <>
              <Link to="/evaluation" className="btn btn-primary btn-sm">Evaluate Project</Link>
              <Link to="/contribution" className="btn btn-outline btn-sm">Start Viva</Link>
            </>
          ) : isAdmin ? (
            <>
              <Link to="/admin" className="btn btn-primary btn-sm">Institution Settings</Link>
              <Link to="/audit" className="btn btn-outline btn-sm">Export Reports</Link>
            </>
          ) : (
            <>
              <Link to="/evidence" className="btn btn-primary btn-sm">Upload Evidence</Link>
              <Link to="/requirements" className="btn btn-outline btn-sm">Add Requirement</Link>
            </>
          )}
        </div>
      </div>

      {/* Row 1: Overall Info */}
      <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
        <div className="card-dark" style={{ padding:"1.75rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" }}>
            <div>
              <div style={{ fontSize:"0.65rem", fontWeight:700, color:"rgba(255,255,255,0.4)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"0.4rem" }}>Overall Information</div>
              <div style={{ fontSize:"2.5rem", fontWeight:900, color:"white", letterSpacing:"-0.04em", lineHeight:1 }}>
                {isAdmin ? "4" : "1"}
                <span style={{ fontSize:"1rem", fontWeight:400, color:"rgba(255,255,255,0.45)", marginLeft:"0.5rem" }}>projects tracked</span>
              </div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: `repeat(${roleKPIs.length > 4 ? 6 : 4},1fr)`, gap:"0.75rem" }}>
            {roleKPIs.map(({ v, l, s }) => (
              <div key={l} style={{ background:"rgba(255,255,255,0.07)", borderRadius:"14px", padding:"0.875rem" }}>
                <div style={{ fontSize:"1.625rem", fontWeight:900, color:"white", letterSpacing:"-0.03em", lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.6)", fontWeight:500, marginTop:"0.2rem" }}>{l}</div>
                <div style={{ fontSize:"0.6875rem", color:"rgba(255,255,255,0.35)", marginTop:"0.1rem" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isAdmin && currentUser?.role !== 'evaluator' ? (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr", gap:"1.25rem" }}>
            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.875rem" }}>
                <div>
                  <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Weekly Progress</div>
                  <div style={{ fontSize:"0.9375rem", fontWeight:700, color:"var(--text-primary)", marginTop:"0.2rem" }}>Tasks & Evidence</div>
                </div>
                <TrendingUp size={17} style={{ color:"var(--text-muted)" }} />
              </div>
              <div style={{ display:"flex", gap:"1rem", marginBottom:"0.75rem" }}>
                {[["Tasks","#111"],["Evidence","#CCC"]].map(([l,c]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:"0.3rem", fontSize:"0.75rem", color:"var(--text-muted)" }}>
                    <span style={{ width:20, height:2, background:c, borderRadius:2, display:"inline-block" }} />{l}
                  </div>
                ))}
              </div>
              <div style={{ position:"relative", height:"80px", overflow:"hidden", borderRadius:"8px" }}>
                <SparkLine data={weekTasks} color="#111111" h={80} fillGradient fillColor="#111111" />
                <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:0.7 }}>
                  <SparkLine data={weekEv} color="#9CA3AF" h={80} fillGradient fillColor="#9CA3AF" />
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.75rem", paddingTop:"0.625rem", borderTop:"1px solid var(--border-subtle)" }}>
                {["M","T","W","T","F","S","S"].map((d,i) => (
                  <span key={i} style={{ fontSize:"0.6875rem", color: i===6?"var(--text-primary)":"var(--text-muted)", fontWeight: i===6?700:400 }}>{d}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"0.875rem" }}>
              <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase", alignSelf:"flex-start" }}>Project Progress</div>
              <C value={taskPct || 0} size={100} />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:"0.8125rem", color:"var(--success)", fontWeight:700 }}>+12% vs last month</div>
                <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:"0.2rem" }}>{project.title.slice(0,22)}{project.title.length > 22 ? "…" : ""}</div>
              </div>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1.25rem" }}>
            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
                <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Evidence Completeness</div>
                <Shield size={16} style={{ color:"var(--text-muted)" }} />
              </div>
              <PR label="Requirements" value={reqPct} />
              <PR label="Tasks" value={taskPct} />
              <PR label="Evidence" value={evPct} />
              <PR label="Testing" value={54} />
              <PR label="Mentor Verification" value={Math.round(verified/Math.max(evidence.length,1)*100)} />
              <Link to="/evidence" className="btn btn-outline btn-sm" style={{ width:"100%", justifyContent:"center", marginTop:"0.875rem" }}>
                View Missing Evidence <ArrowRight size={13} />
              </Link>
            </div>

            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Mentor Assignment</div>
                <Shield size={16} style={{ color: project.status === 'active' ? "var(--success)" : "var(--warning)" }} />
              </div>
              
              <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"1.125rem" }}>
                {project.status === 'active' || project.mentorId ? (
                  <div style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Mentor:</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>{project.mentorName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--success)", fontWeight: 700, marginTop: "0.25rem" }}>✓ Approved</div>
                  </div>
                ) : project.status === 'mentor_pending' ? (
                  <div style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Mentor Request:</div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>⏳ Awaiting Approval</div>
                  </div>
                ) : project.status === 'mentor_rejected' ? (
                  <div style={{ padding: "0.75rem", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--danger-border)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--danger)" }}>Mentor Request: Rejected</div>
                    <Button variant="outline" size="sm" style={{ marginTop: "0.5rem", width: "100%" }} onClick={() => setIsMentorModalOpen(true)}>Select Another Mentor</Button>
                  </div>
                ) : (
                  <div style={{ padding: "0.75rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Mentor: Not Assigned</div>
                    <Button variant="outline" size="sm" style={{ marginTop: "0.5rem", width: "100%" }} onClick={() => setIsMentorModalOpen(true)}>Assign Mentor</Button>
                  </div>
                )}
              </div>
            </div>

            <Modal isOpen={isMentorModalOpen} onClose={() => setIsMentorModalOpen(false)} title="Assign Mentor" subtitle="Select a mentor from your institution to guide your project.">
              <form onSubmit={handleAssignMentor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Mentor</label>
                  <select className="form-input" value={selectedMentor} onChange={(e) => setSelectedMentor(e.target.value)} required>
                    <option value="" disabled>Select an available mentor...</option>
                    {availableMentors.map(m => (
                      <option key={m.id} value={m.id}>{m.fullName} - {m.department}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Request Message (Optional)</label>
                  <textarea className="form-input" rows={3} placeholder="Briefly introduce your project..." value={mentorRequestMessage} onChange={(e) => setMentorRequestMessage(e.target.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Button variant="outline" type="button" onClick={() => setIsMentorModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Send Request</Button>
                </div>
              </form>
            </Modal>

            <div className="card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>My Work</div>
                <Link to="/tasks" style={{ fontSize:"0.8rem", color:"var(--text-muted)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.2rem" }}>All <ChevronRight size={13} /></Link>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                {tasks.length === 0 && <div style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8125rem" }}>No tasks assigned</div>}
                {tasks.slice(0,4).map(task => (
                  <div key={task.id} style={{ padding:"0.625rem 0.75rem", background:"var(--bg-surface-elevated)", borderRadius:"var(--radius-sm)", border:"1px solid var(--border-subtle)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem" }}>
                      <span style={{ fontSize:"0.8125rem", fontWeight:600, color:"var(--text-primary)", lineHeight:1.3, flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{task.title}</span>
                      <span style={{ fontSize:"0.625rem", color: STATUS_COLOR[task.status] || "var(--text-muted)", fontWeight:700, flexShrink:0, textTransform:"uppercase", letterSpacing:"0.04em" }}>{task.status.replace("_"," ")}</span>
                    </div>
                    {task.dueDate && (
                      <div style={{ display:"flex", alignItems:"center", gap:"0.3rem", marginTop:"0.3rem", fontSize:"0.6875rem", color:"var(--text-muted)" }}>
                        <Clock size={10} /> Due {new Date(task.dueDate).toLocaleDateString("en",{month:"short",day:"numeric"})}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem" }}>
          <div className="card">
             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Project Status</div>
             </div>
             <PR label="Active Projects" value={80} />
             <PR label="In Review" value={15} />
             <PR label="At Risk" value={5} />
             <PR label="Completed" value={35} />
          </div>
          <div className="card">
             <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Accreditation & Outcome Coverage</div>
             </div>
             <PR label="PO-01 (Engineering Knowledge)" value={95} />
             <PR label="PO-02 (Problem Analysis)" value={88} />
             <PR label="PO-03 (Design/Development)" value={76} />
             <PR label="PO-05 (Modern Tool Usage)" value={92} />
             <PR label="PO-09 (Individual & Team Work)" value={85} />
          </div>
        </div>
      )}
      
      {renderPendingRequests()}

      {/* Row 3: Projects + Recent Evidence */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:"1.25rem" }}>
        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
            <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Active Projects</div>
            <button className="btn btn-outline btn-sm">View All</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem" }}>
            <div style={{ padding:"1.25rem", background:"var(--bg-dark)", borderRadius:"var(--radius-md)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.75rem" }}>
                <span style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:700 }}>In Progress</span>
                <ArrowRight size={13} style={{ color:"rgba(255,255,255,0.35)" }} />
              </div>
              <div style={{ fontSize:"0.9375rem", fontWeight:700, color:"white", marginBottom:"0.75rem", letterSpacing:"-0.01em" }}>{project.title}</div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", color:"rgba(255,255,255,0.45)" }}>
                <span>{evidence.length} evidence</span><span>{done}/{tasks.length} tasks</span>
              </div>
              <div style={{ marginTop:"0.75rem", height:"3px", background:"rgba(255,255,255,0.1)", borderRadius:"99px" }}>
                <div style={{ height:"100%", width:`${taskPct}%`, background:"white", borderRadius:"99px" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
            <div style={{ fontSize:"0.6rem", fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Recent Evidence</div>
            <Link to="/evidence" style={{ fontSize:"0.8rem", color:"var(--text-muted)", textDecoration:"none", display:"flex", alignItems:"center", gap:"0.2rem" }}>All ({evidence.length}) <ChevronRight size={13} /></Link>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.45rem" }}>
            {evidence.length === 0 && <div style={{ textAlign: "center", padding: "1rem", color: "var(--text-muted)", fontSize: "0.8125rem" }}>No evidence uploaded</div>}
            {evidence.slice(0,5).map(ev => {
              const sc = ev.verificationStatus === "mentor_verified" || ev.verificationStatus === "evaluator_verified" ? "var(--success)" : ev.verificationStatus === "submitted" ? "var(--info)" : "var(--text-muted)";
              const sl = ev.verificationStatus === "mentor_verified" ? "Verified" : ev.verificationStatus === "submitted" ? "Submitted" : "Draft";
              return (
                <button key={ev.id} onClick={() => onOpenEvidence(ev)} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.5625rem 0.75rem", background:"var(--bg-surface-elevated)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-sm)", cursor:"pointer", textAlign:"left", width:"100%", transition:"border-color var(--transition-fast)" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-default)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-subtle)"}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:"0.8125rem", fontWeight:600, color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ev.title}</div>
                    <div style={{ fontSize:"0.6875rem", color:"var(--text-muted)", marginTop:"0.1rem" }}>{ev.ownerName} · {ev.type.replace("_"," ")}</div>
                  </div>
                  <span style={{ fontSize:"0.6875rem", fontWeight:700, color:sc, flexShrink:0, marginLeft:"0.5rem" }}>{sl}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};