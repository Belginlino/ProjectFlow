import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Requirement, RequirementPriority } from '../types';
import { Plus, CheckCircle, Clock, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const RequirementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const project = dataService.getProjects()[0];
  const [requirements, setRequirements] = useState<Requirement[]>(() => dataService.getRequirements(project.id));
  const tasks = dataService.getTasks(project.id);
  const evidence = dataService.getEvidence(project.id);
  const evidenceLinks = dataService.getEvidenceLinks(project.id);

  // New requirement modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<RequirementPriority>('high');
  const [criteriaInput, setCriteriaInput] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const criteriaList = criteriaInput
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const newReq = dataService.createRequirement(
      {
        projectId: project.id,
        title,
        description,
        priority,
        status: 'draft',
        acceptanceCriteria: criteriaList.length > 0 ? criteriaList : ['Acceptance criteria pending definition'],
      },
      currentUser?.id || 'anon',
      currentUser?.fullName || 'User'
    );

    setRequirements(dataService.getRequirements(project.id));
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setCriteriaInput('');
  };

  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSuggest = () => {
    setIsAiLoading(true);
    const suggestions = dataService.aiSuggestRequirements(project.title, project.description);
    if (suggestions.length > 0) {
      const s = suggestions[0];
      setTitle(s.title);
      setDescription(s.description);
      setPriority(s.priority);
      setCriteriaInput(s.acceptanceCriteria.join('\n'));
      setIsModalOpen(true);
    }
    setIsAiLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Requirements & Acceptance Criteria
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Traceable academic specifications linked to execution tasks and verifiable evidence
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button 
            variant="secondary" 
            leftIcon={<Sparkles size={16} />} 
            onClick={handleAiSuggest}
            style={{ border: '1px dashed var(--info)', color: 'var(--info)', background: 'var(--info-bg)' }}
          >
            AI Suggestion
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            New Requirement
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {requirements.map((req) => {
          const linkedTasks = tasks.filter((t) => t.requirementId === req.id);
          const linkedEvLinks = evidenceLinks.filter((l) => l.entityType === 'requirement' && l.entityId === req.id);
          const hasVerifiedEvidence = linkedEvLinks.some((l) => {
            const ev = evidence.find((e) => e.id === l.evidenceId);
            return ev && ev.verificationStatus === 'mentor_verified';
          });

          return (
            <Card key={req.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {req.id}
                    </span>
                    <Badge status={req.priority} />
                    <Badge status={req.status} />
                    {hasVerifiedEvidence ? (
                      <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ShieldCheck size={14} /> Evidence Verified
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <AlertTriangle size={14} /> Verification Pending
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {req.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    {req.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Tasks: <strong style={{ color: 'var(--text-primary)' }}>{linkedTasks.length}</strong>
                  </div>
                  <div
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Evidence Links: <strong style={{ color: 'var(--text-primary)' }}>{linkedEvLinks.length}</strong>
                  </div>
                </div>
              </div>

              {/* Acceptance Criteria Box */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <h5 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Formal Acceptance Criteria
                </h5>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {req.acceptanceCriteria.map((crit, idx) => (
                    <li key={idx}>{crit}</li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Requirement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Academic Project Requirement"
        subtitle="Define verifiable requirements with acceptance thresholds"
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Requirement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. REQ-05: Real-Time Encryption of Student Biometrics"
            required
          />

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as RequirementPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Requirement Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the scope and technical target..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Acceptance Criteria (one per line)</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={criteriaInput}
              onChange={(e) => setCriteriaInput(e.target.value)}
              placeholder="e.g. Encryption standard AES-GCM-256&#10;Key rotation interval <= 24 hours"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Requirement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
