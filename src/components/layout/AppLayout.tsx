import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EvidenceDrawer } from '../evidence/EvidenceDrawer';
import { Evidence, Review, EvidenceLink } from '../../types';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare2, Plus, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const AppLayout: React.FC = () => {
  const [activeEvidence, setActiveEvidence] = useState<Evidence | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newYear, setNewYear] = useState('2026-2027');
  const [newSemester, setNewSemester] = useState('Semester 7 - Capstone Phase I');
  const { currentUser } = useAuth();
  
  const [projectList, setProjectList] = useState(dataService.getProjects());
  const hasProject = projectList.length > 0;
  const firstName = currentUser?.fullName?.split(" ")[0] || "User";

  const handleOpenEvidence = (ev: Evidence) => {
    setActiveEvidence(ev);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setActiveEvidence(null);
  };

  // Get linked reviews & links for drawer
  const reviews: Review[] = activeEvidence
    ? dataService.getReviews(activeEvidence.projectId).filter((r) => r.evidenceId === activeEvidence.id)
    : [];

  const links: EvidenceLink[] = activeEvidence
    ? dataService.getEvidenceLinks(activeEvidence.projectId).filter((l) => l.evidenceId === activeEvidence.id)
    : [];

  const handleVerify = (status: Evidence['verificationStatus']) => {
    if (activeEvidence) {
      const updated = dataService.verifyEvidence(activeEvidence.id, status, currentUser?.id || 'usr-mentor', currentUser?.fullName || 'Mentor');
      setActiveEvidence({ ...updated });
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    dataService.createProject(
      {
        institutionId: 'inst-ait-01',
        title: newTitle,
        description: newDesc || 'Academic Capstone Project on ProjectFlow',
        status: 'active',
        academicYear: newYear,
        semester: newSemester,
        team: {
          members: [
            {
              uid: currentUser?.id || 'usr-1',
              fullName: currentUser?.fullName || 'Project Lead',
              email: currentUser?.email || 'lead@university.edu',
              projectRole: 'lead',
              joinedAt: new Date().toISOString(),
            },
          ],
        },
        createdBy: currentUser?.id || 'usr-1',
      },
      currentUser?.id || 'usr-1',
      currentUser?.fullName || 'User'
    );

    setProjectList(dataService.getProjects());
    setIsCreateModalOpen(false);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="content-body" id="main-content">
          {hasProject ? (
            <Outlet context={{ onOpenEvidence: handleOpenEvidence }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '16px', background: 'var(--bg-glass-heavy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
                <CheckSquare2 size={32} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Welcome, {firstName}!
              </h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 420 }}>
                You don't have any active projects in your workspace yet. Create your first project to start tracking evidence and requirements.
              </p>
              <button className="btn btn-primary btn-lg" style={{ gap: '0.5rem' }} onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={18} /> Create Your First Project
              </button>
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        maxWidth="520px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="primary" form="create-project-form">
              Create Project
            </Button>
          </>
        }
      >
        <form id="create-project-form" onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Project Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Smart Campus IoT Energy Optimization"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief objective and scope of the academic project..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Academic Year</label>
              <input
                type="text"
                className="form-input"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Semester / Term</label>
              <input
                type="text"
                className="form-input"
                value={newSemester}
                onChange={(e) => setNewSemester(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>

      <EvidenceDrawer
        evidence={activeEvidence}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onVerify={handleVerify}
        reviews={reviews}
        links={links}
      />
    </div>
  );
};
