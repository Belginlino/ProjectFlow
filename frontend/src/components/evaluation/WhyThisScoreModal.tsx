import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { ShieldCheck, GitPullRequest, ArrowRight, CornerDownRight, CheckCircle, FileText } from 'lucide-react';
import { Evidence } from '../../types';

interface WhyThisScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    criterionName: string;
    score: number;
    maxScore: number;
    comment: string;
    evidenceChains: Array<{
      evidence: Evidence;
      requirements: Array<{ id: string; title: string }>;
      tasks: Array<{ id: string; title: string }>;
      changeRequests: Array<{ id: string; title: string; status: string }>;
      reviews: Array<{ id: string; reviewerName: string; comments: string; status: string }>;
    }>;
  } | null;
  onSelectEvidence?: (evidence: Evidence) => void;
}

export const WhyThisScoreModal: React.FC<WhyThisScoreModalProps> = ({
  isOpen,
  onClose,
  data,
  onSelectEvidence,
}) => {
  if (!data) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Traceable Score Justification"
      subtitle={`Traversing Evidence Graph for criterion: "${data.criterionName}"`}
      maxWidth="780px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Score Header Card */}
        <div
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>
              Academic Rubric Criterion
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
              {data.criterionName}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Evaluator Note: <em>"{data.comment}"</em>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>
              {data.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {data.maxScore}</span>
            </div>
            <Badge variant="verified">Evidence Verified</Badge>
          </div>
        </div>

        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Graph Traversal Path (Criterion ➔ Evidence ➔ Task ➔ Requirement)
        </h4>

        {/* Traversal Chains */}
        {data.evidenceChains.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No evidence artifacts directly attached to this score.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {data.evidenceChains.map((chain, idx) => (
              <div
                key={chain.evidence.id}
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {/* Evidence Artifact Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={20} className="text-emerald-400" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Supporting Artifact #{idx + 1} ({chain.evidence.id})
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {chain.evidence.title}
                      </h4>
                    </div>
                  </div>
                  {onSelectEvidence && (
                    <button
                      type="button"
                      onClick={() => onSelectEvidence(chain.evidence)}
                      className="btn btn-outline btn-sm"
                    >
                      Inspect Artifact
                    </button>
                  )}
                </div>

                {/* Graph Path Stepper */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '2px solid var(--border-default)' }}>
                  {/* Upstream Requirement */}
                  {chain.requirements.map((req) => (
                    <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <CornerDownRight size={14} className="text-sky-400" />
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Originating Requirement:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{req.title}</span>
                    </div>
                  ))}

                  {/* Execution Task */}
                  {chain.tasks.map((task) => (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <CornerDownRight size={14} className="text-purple-400" />
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Execution Task:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{task.title}</span>
                    </div>
                  ))}

                  {/* Feedback / Change Requests */}
                  {chain.changeRequests.map((cr) => (
                    <div key={cr.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                      <CornerDownRight size={14} className="text-amber-400" />
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Mentor Change Request:</span>
                      <span style={{ color: '#fbbf24', fontWeight: 600 }}>{cr.title}</span>
                      <Badge variant="verified">RESOLVED VIA REVISION</Badge>
                    </div>
                  ))}

                  {/* Mentor Verification Sign-off */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <CornerDownRight size={14} className="text-emerald-400" />
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Mentor Sign-off:</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>
                      Verified by {chain.evidence.verifiedByName || 'Faculty Guide'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
