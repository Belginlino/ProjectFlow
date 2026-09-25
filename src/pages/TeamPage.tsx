import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Users, UserPlus, Shield, Trash2, Mail, Check, AlertTriangle } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { currentUser } = useAuth();
  const projects = dataService.getProjects();
  const [project, setProject] = useState(projects[0]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'lead' | 'member'>('member');

  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No active project available to manage teams.</p>
      </div>
    );
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    dataService.addProjectMember(
      project.id,
      {
        fullName: inviteName,
        email: inviteEmail,
        projectRole: inviteRole,
      },
      currentUser?.id || 'usr-1',
      currentUser?.fullName || 'User'
    );

    setProject(dataService.getProject(project.id)!);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleRemove = () => {
    if (!memberToRemove) return;

    dataService.removeProjectMember(
      project.id,
      memberToRemove,
      currentUser?.id || 'usr-1',
      currentUser?.fullName || 'User'
    );

    setProject(dataService.getProject(project.id)!);
    setMemberToRemove(null);
  };

  const handleRoleToggle = (memberUid: string, currentRole: 'lead' | 'member') => {
    const newRole = currentRole === 'lead' ? 'member' : 'lead';
    dataService.updateProjectMemberRole(
      project.id,
      memberUid,
      newRole,
      currentUser?.id || 'usr-1',
      currentUser?.fullName || 'User'
    );
    setProject(dataService.getProject(project.id)!);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Project Team & Contribution Governance
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Manage student investigators, role assignments, technical responsibilities, and team composition for <strong>{project.title}</strong>
          </p>
        </div>
        <Button variant="primary" leftIcon={<UserPlus size={16} />} onClick={() => setIsInviteModalOpen(true)}>
          Invite Teammate
        </Button>
      </div>

      {/* Team Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Members</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{project.team.members.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered investigators</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Faculty Mentor</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{project.mentorName || 'Not Assigned'}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.status === 'mentor_pending' ? 'Request pending' : 'Academic supervisor'}</span>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cohort / Term</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{project.semester}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.academicYear}</span>
        </div>
      </div>

      {/* Members Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Investigator Roster & Assigned Responsibilities ({project.team.members.length})
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Member Name</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Institutional Email</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Project Role</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Joined Date</th>
                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.team.members.map((m) => (
                <tr key={m.uid} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8125rem' }}>
                        {m.fullName[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 650, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{m.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UID: {m.uid}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>{m.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span className={`badge ${m.projectRole === 'lead' ? 'badge-verified' : 'badge-draft'}`} style={{ textTransform: 'capitalize' }}>
                      {m.projectRole === 'lead' ? '★ Project Lead' : 'Team Member'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRoleToggle(m.uid, m.projectRole)}
                        title="Toggle Project Lead status"
                      >
                        {m.projectRole === 'lead' ? 'Set as Member' : 'Make Lead'}
                      </button>
                      {project.team.members.length > 1 && (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                          onClick={() => setMemberToRemove(m.uid)}
                          title="Remove member"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <Modal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          title="Invite Teammate to Project"
          subtitle="Add a student investigator to collaborate on requirements, tasks, and evidence"
        >
          <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Maya Deshmukh"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">University Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="maya@projectflow.edu"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Initial Project Role</label>
              <select
                className="form-input"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as 'lead' | 'member')}
              >
                <option value="member">Team Member</option>
                <option value="lead">Co-Lead</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Invitation
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Remove Member Confirmation Modal */}
      {memberToRemove && (
        <Modal
          isOpen={Boolean(memberToRemove)}
          onClose={() => setMemberToRemove(null)}
          title="Remove Team Member?"
          subtitle="This action will disassociate the student from future task assignments"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)' }}>
              <AlertTriangle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.875rem', color: 'var(--danger)' }}>
                Previously verified evidence created by this member will remain preserved in the Project Evidence Graph to ensure institutional auditability.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button variant="secondary" onClick={() => setMemberToRemove(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleRemove}>
                Confirm Removal
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
