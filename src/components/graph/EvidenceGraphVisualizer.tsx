import React, { useState, useMemo } from 'react';
import { Requirement, Task, Evidence, Review, ChangeRequest, Evaluation } from '../../types';
import {
  FileText,
  CheckSquare,
  ShieldCheck,
  MessageSquare,
  Award,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  User,
  GitPullRequest,
  AlertTriangle,
} from 'lucide-react';

interface EvidenceGraphVisualizerProps {
  requirements: Requirement[];
  tasks: Task[];
  evidence: Evidence[];
  reviews: Review[];
  changeRequests: ChangeRequest[];
  evaluations: Evaluation[];
  onSelectNode: (type: string, item: any) => void;
}

export const EvidenceGraphVisualizer: React.FC<EvidenceGraphVisualizerProps> = ({
  requirements,
  tasks,
  evidence,
  reviews,
  changeRequests,
  evaluations,
  onSelectNode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const query = searchQuery.toLowerCase().trim();

  // Filter items based on search query
  const filteredRequirements = useMemo(() => {
    if (!query) return requirements;
    return requirements.filter(
      (r) => r.id.toLowerCase().includes(query) || r.title.toLowerCase().includes(query) || r.description?.toLowerCase().includes(query)
    );
  }, [requirements, query]);

  const filteredTasks = useMemo(() => {
    if (!query) return tasks;
    return tasks.filter(
      (t) => t.id.toLowerCase().includes(query) || t.title.toLowerCase().includes(query) || t.assigneeName?.toLowerCase().includes(query)
    );
  }, [tasks, query]);

  const filteredEvidence = useMemo(() => {
    if (!query) return evidence;
    return evidence.filter(
      (e) => e.id.toLowerCase().includes(query) || e.title.toLowerCase().includes(query) || e.type.toLowerCase().includes(query)
    );
  }, [evidence, query]);

  const filteredReviews = useMemo(() => {
    if (!query) return reviews;
    return reviews.filter(
      (r) => r.id.toLowerCase().includes(query) || r.reviewerName.toLowerCase().includes(query) || r.comments.toLowerCase().includes(query)
    );
  }, [reviews, query]);

  const filteredCRs = useMemo(() => {
    if (!query) return changeRequests;
    return changeRequests.filter(
      (c) => c.id.toLowerCase().includes(query) || c.title.toLowerCase().includes(query) || c.status.toLowerCase().includes(query)
    );
  }, [changeRequests, query]);

  const filteredEvaluations = useMemo(() => {
    if (!query) return evaluations;
    return evaluations.filter(
      (e) => e.id.toLowerCase().includes(query) || e.evaluatorName.toLowerCase().includes(query)
    );
  }, [evaluations, query]);

  const handleCardClick = (type: string, item: any) => {
    setSelectedNodeId(item.id);
    onSelectNode(type, item);
  };

  const totalNodes =
    requirements.length + tasks.length + evidence.length + reviews.length + changeRequests.length + evaluations.length;

  const showColumn = (colCategory: string) => {
    return selectedCategory === 'all' || selectedCategory === colCategory;
  };

  return (
    <div className="graph-container" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Top Header & Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: '#111827',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
                Interactive Project Evidence Graph
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '2px 0 0' }}>
                Traceable academic lineage connecting Requirements ➔ Execution ➔ Evidence ➔ Reviews ➔ Evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Search & Quick Counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.1rem',
                fontSize: '0.8125rem',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                outline: 'none',
                background: '#F9FAFB',
                color: '#111827',
              }}
            />
          </div>

          <div
            style={{
              padding: '0.4rem 0.75rem',
              background: '#F3F4F6',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Layers size={14} className="text-gray-500" />
            <span>{totalNodes} Total Graph Nodes</span>
          </div>
        </div>
      </div>

      {/* Pipeline Navigation / Stage Filter Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.75rem',
          background: '#F9FAFB',
          padding: '0.6rem 0.85rem',
          borderRadius: '12px',
          border: '1px solid #F3F4F6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', marginRight: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={13} /> Filter Stage:
          </span>
          {[
            { id: 'all', label: 'All Stages', count: totalNodes },
            { id: 'requirements', label: '1. Requirements', count: requirements.length },
            { id: 'tasks', label: '2. Tasks', count: tasks.length },
            { id: 'evidence', label: '3. Evidence', count: evidence.length },
            { id: 'reviews', label: '4. Reviews & CRs', count: reviews.length + changeRequests.length },
            { id: 'evaluations', label: '5. Evaluations', count: evaluations.length },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: selectedCategory === cat.id ? 700 : 500,
                borderRadius: '9999px',
                border: selectedCategory === cat.id ? '1px solid #111827' : '1px solid #E5E7EB',
                background: selectedCategory === cat.id ? '#111827' : '#FFFFFF',
                color: selectedCategory === cat.id ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: '0.675rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '9999px',
                  background: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                  color: selectedCategory === cat.id ? '#FFFFFF' : '#6B7280',
                }}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              fontSize: '0.75rem',
              color: '#EF4444',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* 5-Column Visual Directed Pipeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            selectedCategory === 'all'
              ? 'repeat(5, minmax(230px, 1fr))'
              : 'minmax(320px, 600px)',
          gap: '1.25rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          alignItems: 'start',
        }}
      >
        {/* Column 1: Requirements */}
        {showColumn('requirements') && (
          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '480px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #0284C7',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369A1', fontWeight: 700, fontSize: '0.8125rem' }}>
                <FileText size={16} /> 1. REQUIREMENTS
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369A1', background: '#E0F2FE', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                {filteredRequirements.length}
              </span>
            </div>

            {filteredRequirements.map((req) => {
              const isSelected = selectedNodeId === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => handleCardClick('requirement', req)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #0284C7' : '1px solid #E5E7EB',
                    borderLeft: '4px solid #0284C7',
                    borderRadius: '8px',
                    padding: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.675rem', fontFamily: 'monospace', fontWeight: 700, color: '#6B7280', background: '#F3F4F6', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                      {req.id}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: req.status === 'verified' ? '#047857' : '#B45309',
                        background: req.status === 'verified' ? '#D1FAE5' : '#FEF3C7',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {req.status === 'verified' ? '✓ Verified' : req.status}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827', margin: '0.25rem 0 0.5rem', lineHeight: 1.35 }}>
                    {req.title}
                  </h5>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                      Priority: <strong style={{ color: '#1F2937' }}>{req.priority.toUpperCase()}</strong>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#0284C7', fontSize: '0.7rem', fontWeight: 600 }}>
                      Inspect <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Column 2: Execution Tasks */}
        {showColumn('tasks') && (
          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '480px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #7C3AED',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6D28D9', fontWeight: 700, fontSize: '0.8125rem' }}>
                <CheckSquare size={16} /> 2. TASKS
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6D28D9', background: '#EDE9FE', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                {filteredTasks.length}
              </span>
            </div>

            {filteredTasks.map((task) => {
              const isSelected = selectedNodeId === task.id;
              const isDone = task.status === 'done';
              return (
                <div
                  key={task.id}
                  onClick={() => handleCardClick('task', task)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #7C3AED' : '1px solid #E5E7EB',
                    borderLeft: '4px solid #7C3AED',
                    borderRadius: '8px',
                    padding: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(124, 58, 237, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(124, 58, 237, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.675rem', fontFamily: 'monospace', fontWeight: 700, color: '#6B7280', background: '#F3F4F6', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                      {task.id}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isDone ? '#047857' : '#1D4ED8',
                        background: isDone ? '#D1FAE5' : '#DBEAFE',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827', margin: '0.25rem 0 0.5rem', lineHeight: 1.35 }}>
                    {task.title}
                  </h5>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={12} /> {task.assigneeName?.split(' ')[0] || 'Unassigned'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#7C3AED', fontSize: '0.7rem', fontWeight: 600 }}>
                      Inspect <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Column 3: Evidence Artifacts */}
        {showColumn('evidence') && (
          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '480px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #059669',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: 700, fontSize: '0.8125rem' }}>
                <ShieldCheck size={16} /> 3. EVIDENCE
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#047857', background: '#D1FAE5', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                {filteredEvidence.length}
              </span>
            </div>

            {filteredEvidence.map((ev) => {
              const isSelected = selectedNodeId === ev.id;
              const isVerified = ev.verificationStatus === 'mentor_verified' || ev.verificationStatus === 'evaluator_verified';
              return (
                <div
                  key={ev.id}
                  onClick={() => handleCardClick('evidence', ev)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #059669' : '1px solid #E5E7EB',
                    borderLeft: `4px solid ${isVerified ? '#059669' : '#0284C7'}`,
                    borderRadius: '8px',
                    padding: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(5, 150, 105, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.675rem', fontFamily: 'monospace', fontWeight: 700, color: '#6B7280', background: '#F3F4F6', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                      {ev.id}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: ev.type === 'github_pr' ? '#18181B' : '#0369A1',
                        background: ev.type === 'github_pr' ? '#F4F4F5' : '#E0F2FE',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}
                    >
                      {ev.type === 'github_pr' && <GitPullRequest size={10} />}
                      {ev.type.replace('_', ' ')}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827', margin: '0.25rem 0 0.5rem', lineHeight: 1.35 }}>
                    {ev.title}
                  </h5>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: isVerified ? '#047857' : '#D97706',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {isVerified ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {isVerified ? 'Verified by Mentor' : 'Pending Review'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#059669', fontSize: '0.7rem', fontWeight: 600 }}>
                      Inspect <ExternalLink size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Column 4: Feedback & Change Requests */}
        {showColumn('reviews') && (
          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '480px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #D97706',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#B45309', fontWeight: 700, fontSize: '0.8125rem' }}>
                <MessageSquare size={16} /> 4. REVIEWS & CRs
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                {filteredReviews.length + filteredCRs.length}
              </span>
            </div>

            {/* Mentor Reviews */}
            {filteredReviews.map((rev) => {
              const isSelected = selectedNodeId === rev.id;
              return (
                <div
                  key={rev.id}
                  onClick={() => handleCardClick('review', rev)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #D97706' : '1px solid #E5E7EB',
                    borderLeft: '4px solid #D97706',
                    borderRadius: '8px',
                    padding: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(217, 119, 6, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(217, 119, 6, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.675rem', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      MENTOR REVIEW
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500 }}>
                      {rev.reviewerName}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#374151', margin: '0.4rem 0', lineHeight: 1.45, fontStyle: 'italic' }}>
                    "{rev.comments}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 600 }}>
                      ✓ Actionable
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#D97706', fontSize: '0.7rem', fontWeight: 600 }}>
                      Inspect <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Change Requests */}
            {filteredCRs.map((cr) => {
              const isSelected = selectedNodeId === cr.id;
              return (
                <div
                  key={cr.id}
                  onClick={() => handleCardClick('change_request', cr)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #E11D48' : '1px solid #E5E7EB',
                    borderLeft: '4px solid #E11D48',
                    borderRadius: '8px',
                    padding: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(225, 29, 72, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(225, 29, 72, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#BE123C', background: '#FFE4E6', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      CHANGE REQUEST
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#047857', background: '#D1FAE5', padding: '0.1rem 0.35rem', borderRadius: '9999px' }}>
                      {cr.status.toUpperCase()}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#111827', margin: '0.25rem 0 0.5rem', lineHeight: 1.35 }}>
                    {cr.title}
                  </h5>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                      Assignee: <strong style={{ color: '#1F2937' }}>{cr.assigneeName}</strong>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#E11D48', fontSize: '0.7rem', fontWeight: 600 }}>
                      Inspect <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Column 5: Evaluation & Viva Marks */}
        {showColumn('evaluations') && (
          <div
            style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '480px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #4338CA',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#3730A3', fontWeight: 700, fontSize: '0.8125rem' }}>
                <Award size={16} /> 5. EVALUATION
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3730A3', background: '#E0E7FF', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                {filteredEvaluations.length}
              </span>
            </div>

            {filteredEvaluations.map((evl) => {
              const isSelected = selectedNodeId === evl.id;
              const percentage = Math.round((evl.overallScore / evl.maxTotalScore) * 100);
              return (
                <div
                  key={evl.id}
                  onClick={() => handleCardClick('evaluation', evl)}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #4338CA' : '1px solid #E5E7EB',
                    borderLeft: '4px solid #4338CA',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(67, 56, 202, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(67, 56, 202, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.675rem', fontWeight: 700, color: '#4338CA', background: '#EEF2FF', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      FORMAL VIVA
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#047857', background: '#D1FAE5', padding: '0.1rem 0.35rem', borderRadius: '9999px' }}>
                      FINAL
                    </span>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: '#4B5563', display: 'block' }}>
                    Evaluator: <strong style={{ color: '#111827' }}>{evl.evaluatorName}</strong>
                  </span>

                  {/* Score Highlight Display */}
                  <div
                    style={{
                      margin: '0.75rem 0',
                      padding: '0.75rem',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>
                      {evl.overallScore} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748B' }}>/ {evl.maxTotalScore}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginTop: '0.35rem' }}>
                      Grade: A ({percentage}%)
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', borderTop: '1px solid #F3F4F6', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle2 size={12} /> Evidence Grounded
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#4338CA', fontSize: '0.7rem', fontWeight: 600 }}>
                      Inspect <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Pipeline Footer Legend */}
      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.75rem',
          color: '#6B7280',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: '#374151' }}>Pipeline Lineage:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284C7' }} /> Requirements
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }} /> Tasks
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} /> Evidence
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} /> Reviews
          </span>
          <ChevronRight size={12} className="text-gray-400" />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4338CA' }} /> Viva Evaluation
          </span>
        </div>

        <span style={{ color: '#9CA3AF' }}>Click any card to inspect entity metadata</span>
      </div>
    </div>
  );
};
