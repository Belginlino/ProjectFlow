import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Evidence, EvidenceType, Task, Requirement } from '../types';
import {
  Upload,
  Plus,
  GitPullRequest,
  CheckCircle,
  FileText,
  Image,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

export const EvidencePage: React.FC = () => {
  const { onOpenEvidence } = useOutletContext<{ onOpenEvidence: (ev: Evidence) => void }>();
  const { currentUser } = useAuth();
  const project = dataService.getProjects()[0];
  const [evidenceList, setEvidenceList] = useState<Evidence[]>(() => dataService.getEvidence(project.id));
  const tasks = dataService.getTasks(project.id);
  const requirements = dataService.getRequirements(project.id);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Upload modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EvidenceType>('code_pr');
  const [sourceType, setSourceType] = useState<'upload' | 'github' | 'url'>('github');
  const [sourceUrl, setSourceUrl] = useState('');
  const [linkedTaskId, setLinkedTaskId] = useState<string>(tasks[0]?.id || '');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    dataService.createEvidence(
      {
        projectId: project.id,
        ownerId: currentUser?.id || 'anon',
        ownerName: currentUser?.fullName || 'User',
        type,
        title,
        description,
        sourceType,
        sourceUrl: sourceUrl || undefined,
        fileName: sourceType === 'upload' ? `${title.toLowerCase().replace(/\s+/g, '_')}.pdf` : undefined,
      },
      linkedTaskId,
      'task',
      type === 'test_result' ? 'tests' : 'implements',
      currentUser?.id || 'anon',
      currentUser?.fullName || 'User'
    );

    setEvidenceList(dataService.getEvidence(project.id));
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setSourceUrl('');
  };

  const filteredEvidence = evidenceList.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || ev.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || ev.verificationStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (evType: EvidenceType) => {
    switch (evType) {
      case 'code_pr':
        return <GitPullRequest size={18} className="text-purple-400" />;
      case 'test_result':
        return <CheckCircle size={18} className="text-emerald-400" />;
      case 'screenshot':
        return <Image size={18} className="text-sky-400" />;
      default:
        return <FileText size={18} className="text-amber-400" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Evidence Explorer & Repository
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Verifiable academic artifacts: Code PRs, test suites, architecture documents and benchmark reports
          </p>
        </div>
        <Button leftIcon={<Upload size={16} />} onClick={() => setIsModalOpen(true)}>
          Submit Verifiable Evidence
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.25rem', width: '100%' }}
            placeholder="Search evidence artifacts by title or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Evidence Types</option>
          <option value="code_pr">Code / GitHub PR</option>
          <option value="test_result">Test Benchmark / Results</option>
          <option value="document">Documentation / Report</option>
          <option value="design">Architecture / Design</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Verification States</option>
          <option value="mentor_verified">Mentor Verified</option>
          <option value="submitted">Submitted (Pending)</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Evidence Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredEvidence.map((ev) => (
          <Card
            key={ev.id}
            onClick={() => onOpenEvidence(ev)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getTypeIcon(ev.type)}
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {ev.id}
                  </span>
                </div>
                <Badge status={ev.verificationStatus} />
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {ev.title}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ev.description}
              </p>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Author: <strong style={{ color: 'var(--text-primary)' }}>{ev.ownerName}</strong>
              </span>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                Inspect &rarr;
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Evidence Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Verifiable Project Evidence"
        subtitle="Artifacts enter the verification lifecycle and link to project tasks"
      >
        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Artifact Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. PR #22: Liveness Face Anti-Spoofing Benchmark"
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Evidence Type</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value as EvidenceType)}>
                <option value="code_pr">Code / GitHub Pull Request</option>
                <option value="test_result">Test Benchmark / Results</option>
                <option value="document">Technical Document / Report</option>
                <option value="screenshot">Screenshot / Video Demo</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Source Format</label>
              <select
                className="form-select"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as any)}
              >
                <option value="github">GitHub PR URL</option>
                <option value="upload">PDF / File Upload</option>
                <option value="url">External Link</option>
              </select>
            </div>
          </div>

          {sourceType === 'github' || sourceType === 'url' ? (
            <Input
              label="Source URL"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://github.com/org/repo/pull/18"
            />
          ) : (
            <div className="form-group">
              <label className="form-label">Evidence File</label>
              <input type="file" className="form-input" />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Link to Task</label>
            <select className="form-select" value={linkedTaskId} onChange={(e) => setLinkedTaskId(e.target.value)}>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id}: {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Context & Detailed Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain how this artifact verifies the task and fulfills requirements..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Evidence</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
