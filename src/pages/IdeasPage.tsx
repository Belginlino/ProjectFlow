import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { ProjectIdea } from '../types';
import { Lightbulb, Plus, Search, Users, Sparkles, Send, Check } from 'lucide-react';

export const IdeasPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [ideas, setIdeas] = useState<ProjectIdea[]>(() => dataService.getIdeas());
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // New Idea modal state
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [domain, setDomain] = useState('IoT & Clean Energy');
  const [skillsInput, setSkillsInput] = useState('Python, FastAPI, React');

  // Join Request modal state
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const domains = ['all', 'IoT & Clean Energy', 'Computer Vision & Renewable Energy', 'Smart Grid & Distributed Systems', 'Speech AI & Embedded Systems'];

  const filteredIdeas = ideas.filter((idea) => {
    const matchesDomain = selectedDomain === 'all' || idea.domain.toLowerCase().includes(selectedDomain.toLowerCase());
    const matchesSearch =
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.problemStatement.toLowerCase().includes(search.toLowerCase()) ||
      idea.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const handleProposeIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problemStatement.trim()) return;

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    dataService.createIdea({
      title,
      problemStatement,
      domain,
      requiredSkills: skills.length > 0 ? skills : ['Software Engineering'],
      proposedBy: currentUser?.id || 'usr-student',
      proposedByName: currentUser?.fullName || 'Student',
      role: (currentUser?.role === 'mentor' ? 'mentor' : 'student') as 'mentor' | 'student',
      status: 'open',
    });

    setIdeas(dataService.getIdeas());
    setIsProposeModalOpen(false);
    setTitle('');
    setProblemStatement('');
  };

  const handleSendJoinRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdea || !joinMessage.trim()) return;

    dataService.requestJoinIdea(selectedIdea.id, {
      userId: currentUser?.id || 'usr-student',
      userName: currentUser?.fullName || 'Student',
      message: joinMessage,
    });

    setIdeas(dataService.getIdeas());
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setSelectedIdea(null);
      setJoinMessage('');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Academic Project Idea Marketplace
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Discover faculty research concepts, propose student problem statements, and form interdisciplinary project teams
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setIsProposeModalOpen(true)}>
          Propose Idea
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by keywords, technical skills, or problem statement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`demo-pill-btn ${selectedDomain === dom ? 'active' : ''}`}
            >
              {dom === 'all' ? 'ALL DOMAINS' : dom.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredIdeas.map((idea) => (
          <div key={idea.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem', position: 'relative' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {idea.domain}
                </span>
                <span className={`badge ${idea.status === 'open' ? 'badge-verified' : 'badge-draft'}`}>
                  {idea.status.toUpperCase()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {idea.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {idea.problemStatement}
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Target Technical Competencies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {idea.requiredSkills.map((sk) => (
                    <span key={sk} style={{ fontSize: '0.75rem', background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Proposed by <strong style={{ color: 'var(--text-primary)' }}>{idea.proposedByName}</strong> ({idea.role})
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Users size={14} />}
                onClick={() => setSelectedIdea(idea)}
              >
                Join Team {idea.joinRequests.length > 0 && `(${idea.joinRequests.length})`}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Propose Idea Modal */}
      {isProposeModalOpen && (
        <Modal
          isOpen={isProposeModalOpen}
          onClose={() => setIsProposeModalOpen(false)}
          title="Propose Academic Project Idea"
          subtitle="Submit a concept to invite collaborator interest and mentor sponsorship"
        >
          <form onSubmit={handleProposeIdea} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Distributed Battery Storage Optimization Platform"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Problem Statement</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe the research problem, institutional relevance, and proposed engineering approach..."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Domain</label>
              <input
                type="text"
                className="form-input"
                list="domain-suggestions"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
              <datalist id="domain-suggestions">
                <option value="Artificial Intelligence" />
                <option value="IoT & Clean Energy" />
                <option value="Cybersecurity" />
                <option value="Blockchain" />
                <option value="Data Science" />
                <option value="Web Development" />
                <option value="Mobile Computing" />
                <option value="Cloud Infrastructure" />
              </datalist>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Required Technical Skills (comma separated)</label>
              <input
                type="text"
                className="form-input"
                list="skill-suggestions"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
              <datalist id="skill-suggestions">
                <option value="Python, FastAPI, React" />
                <option value="TensorFlow, PyTorch, Python" />
                <option value="React, Node.js, MongoDB" />
                <option value="C++, Microcontrollers, IoT" />
                <option value="Solidity, Web3.js, React" />
                <option value="Java, Spring Boot, MySQL" />
              </datalist>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsProposeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Publish Project Idea
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Join Request Modal */}
      {selectedIdea && (
        <Modal
          isOpen={Boolean(selectedIdea)}
          onClose={() => setSelectedIdea(null)}
          title={`Request to Join: ${selectedIdea.title}`}
          subtitle={`Submitted to ${selectedIdea.proposedByName}`}
        >
          {requestSent ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Check size={24} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Request Submitted!
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Your join interest message was sent to {selectedIdea.proposedByName}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendJoinRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Your Experience & Desired Contribution</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Explain your technical background, skills, and which aspect of this project you would like to own..."
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <Button variant="secondary" onClick={() => setSelectedIdea(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" leftIcon={<Send size={14} />}>
                  Send Request
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
};
