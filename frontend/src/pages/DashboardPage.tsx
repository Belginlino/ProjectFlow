import React, { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { dataService } from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import { Evidence, UserProfile } from "../types";
import { ArrowRight, AlertTriangle, Shield, CheckSquare2, Users, FileText, ChevronRight, Clock, Plus, Inbox } from "lucide-react";
import { Modal } from "../components/common/Modal";
import { Button } from "../components/common/Button";
import { userService } from "../services/userService";

export const DashboardPage: React.FC = () => {
  const { onOpenEvidence } = useOutletContext<{ onOpenEvidence: (ev: Evidence) => void }>();
  const { currentUser, currentRole } = useAuth();
  
  const projects = dataService.getProjects();
  // Simplified for demo: assume the first project is the active one if any
  const project = projects.find(p => p.status !== 'archived') || projects[0];
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
    window.location.reload();
  };

  const pendingRequests = currentRole === 'mentor' ? dataService.getMentorRequestsForMentor(currentUser!.id) : [];

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
    if (currentRole !== 'mentor' || pendingRequests.length === 0) return null;
    return (
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Mentor Requests ({pendingRequests.length})</div>
          <Inbox size={16} style={{ color: "var(--warning)" }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {pendingRequests.map(req => {
            const proj = projects.find(p => p.id === req.projectId);
            return (
              <div key={req.id} style={{ padding: "1rem", background: "var(--bg-surface-elevated)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "0.25rem", color: 'var(--text-primary)' }}>{proj?.title || "Project"}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1rem" }}>{req.requestMessage || 'No message provided'}</div>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Welcome, {firstName}!
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {currentRole === 'mentor' ? "You haven't been assigned to any projects yet." : "You haven't created any projects yet."}
          </p>
          {currentRole === 'student' && (
            <Button size="lg" leftIcon={<CheckSquare2 size={18} />} onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Project
            </Button>
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
              <label className="form-label">Problem Statement</label>
              <textarea
                className="form-input"
                placeholder="Briefly describe what problem this solves..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                rows={3}
                required
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

  // Derived Data
  const tasks = dataService.getTasks(project.id);
  const evidence = dataService.getEvidence(project.id);
  const alerts = dataService.getHealthAlerts(project.id);
  const reviews = dataService.getReviews(project.id);
  const changeRequests = dataService.getChangeRequests(project.id);

  const doneTasks = tasks.filter(t => t.status === "done").length;
  
  // Define "Current Stage" logically
  let currentStage = "Project Initialization";
  if (project.status === 'draft') currentStage = "Drafting Proposal";
  if (project.status === 'mentor_pending') currentStage = "Waiting for Mentor Approval";
  if (project.status === 'mentor_approved' || project.status === 'active') currentStage = "Active Development";
  if (evidence.some(e => e.verificationStatus === 'submitted')) currentStage = "Evidence Verification";
  if (changeRequests.some(c => c.status === 'pending')) currentStage = "Revisions Required";
  if (project.status === 'evaluation') currentStage = "Final Evaluation";
  
  // Next Action logic per role
  let nextAction = "";
  if (currentRole === 'student') {
    if (project.status === 'draft') nextAction = "Assign a mentor to proceed.";
    else if (project.status === 'mentor_pending') nextAction = "Wait for mentor approval.";
    else if (tasks.filter(t => t.status === 'done' && !evidence.find(e => e.id === t.id)).length > 0) nextAction = "Submit evidence for completed tasks.";
    else if (changeRequests.some(c => c.status === 'pending')) nextAction = "Resolve pending change requests.";
    else nextAction = "Continue executing tasks in your backlog.";
  } else if (currentRole === 'mentor') {
    const pendingEv = evidence.filter(e => e.verificationStatus === 'submitted').length;
    if (pendingEv > 0) nextAction = `Review ${pendingEv} pending evidence submissions.`;
    else nextAction = "Monitor project health and guide students.";
  } else if (currentRole === 'evaluator') {
    nextAction = "Inspect verified evidence and conduct viva.";
  } else {
    nextAction = "Monitor institutional project metrics.";
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
      
      {/* Project Control Center Header */}
      <div className="card-dark" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Project Control Center
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {project.title}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={14} /> Lead: {project.team.members.find(m => m.projectRole === 'lead')?.fullName}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Shield size={14} /> Mentor: {project.mentorName || 'Unassigned'}</span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Status: {project.status.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
          
          {(currentRole === 'student' && !project.mentorId && project.status === 'draft') && (
            <Button variant="outline" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} onClick={() => setIsMentorModalOpen(true)}>
              Assign Mentor
            </Button>
          )}
        </div>

        {/* Current Stage & Next Action */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>Current Stage</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>{currentStage}</div>
          </div>
          <div style={{ background: 'var(--primary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ArrowRight size={24} color="white" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>Next Action</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>{nextAction}</div>
            </div>
          </div>
        </div>
      </div>

      {renderPendingRequests()}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Attention Center */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--warning)' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Needs Attention</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.length === 0 && changeRequests.length === 0 && evidence.filter(e => e.verificationStatus === 'submitted').length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Everything is on track. No immediate actions required.
              </div>
            )}
            
            {/* Health Alerts */}
            {alerts.map(alert => (
              <div key={alert.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--danger-border)' }}>
                <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)' }}>{alert.reason}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>Action: {alert.recommendedAction}</div>
                </div>
              </div>
            ))}

            {/* Change Requests */}
            {changeRequests.filter(cr => cr.status === 'pending').map(cr => (
              <div key={cr.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--warning-border)' }}>
                <FileText size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Change Requested: {cr.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Due: {new Date(cr.dueDate).toLocaleDateString()}</div>
                </div>
              </div>
            ))}

            {/* Pending Verifications for Mentors */}
            {currentRole === 'mentor' && evidence.filter(e => e.verificationStatus === 'submitted').map(ev => (
              <div key={ev.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'var(--info-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--info-border)' }}>
                <Shield size={16} style={{ color: 'var(--info)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Verification Pending: {ev.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Submitted by {ev.ownerName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Passport Quick View */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Evidence Passports</h2>
            </div>
            <Link to="/evidence" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>View All</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {evidence.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No evidence passports created yet.
              </div>
            ) : (
              evidence.slice(0, 4).map(ev => (
                <div key={ev.id} onClick={() => onOpenEvidence(ev)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{ev.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{ev.type.replace('_', ' ')} · {ev.ownerName}</div>
                  </div>
                  <span className={`badge badge-${ev.verificationStatus === 'mentor_verified' ? 'verified' : ev.verificationStatus === 'submitted' ? 'pending' : 'draft'}`}>
                    {ev.verificationStatus.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      
      {/* Mentor Assignment Modal */}
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

    </div>
  );
};