import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { WhyThisScoreModal } from '../components/evaluation/WhyThisScoreModal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Evaluation, Rubric, CriterionScore, Evidence } from '../types';
import { Award, ShieldCheck, HelpCircle, CheckCircle, Save, Sparkles, FileText } from 'lucide-react';

export const EvaluationPage: React.FC = () => {
  const { onOpenEvidence } = useOutletContext<{ onOpenEvidence: (ev: Evidence) => void }>();
  const { currentUser } = useAuth();
  const projects = dataService.getProjects();
  const rubrics = dataService.getRubrics();
  const project = projects[0];
  const rubric = rubrics[0];

  if (!project || !rubric) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No project or evaluation rubric available.</p>
      </div>
    );
  }

  const evidenceList = dataService.getEvidence(project.id);

  const [evaluation, setEvaluation] = useState<Evaluation>(() => {
    const existing = dataService.getEvaluations(project.id)[0];
    if (existing) return existing;
    return {
      id: `eval-${Date.now()}`,
      projectId: project.id,
      rubricId: rubric.id,
      rubricTitle: rubric.title,
      evaluatorId: currentUser?.id || 'eval-01',
      evaluatorName: currentUser?.fullName || 'Faculty Evaluator',
      overallScore: 0,
      maxTotalScore: rubric.criteria.reduce((sum, c) => sum + c.maxScore, 0),
      feedback: '',
      status: 'draft',
      scores: rubric.criteria.map((c) => ({
        criterionId: c.id,
        criterionName: c.name,
        score: c.maxScore * 0.9,
        maxScore: c.maxScore,
        comment: '',
        evidenceIds: [],
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // "Why This Score?" modal state
  const [whyThisScoreData, setWhyThisScoreData] = useState<any | null>(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);

  const handleOpenWhyModal = (criterionId: string) => {
    const traversalResult = dataService.traverseWhyThisScore(project.id, criterionId);
    if (traversalResult) {
      setWhyThisScoreData(traversalResult);
      setIsWhyModalOpen(true);
    }
  };

  const handleScoreChange = (criterionId: string, val: number) => {
    const updatedScores = evaluation.scores.map((s) => (s.criterionId === criterionId ? { ...s, score: val } : s));
    const total = updatedScores.reduce((sum, s) => sum + s.score, 0);
    setEvaluation({ ...evaluation, scores: updatedScores, overallScore: total });
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    const updatedScores = evaluation.scores.map((s) => (s.criterionId === criterionId ? { ...s, comment } : s));
    setEvaluation({ ...evaluation, scores: updatedScores });
  };

  const handleEvidenceToggle = (criterionId: string, evId: string) => {
    const updatedScores = evaluation.scores.map((s) => {
      if (s.criterionId === criterionId) {
        const has = s.evidenceIds.includes(evId);
        return {
          ...s,
          evidenceIds: has ? s.evidenceIds.filter((id) => id !== evId) : [...s.evidenceIds, evId],
        };
      }
      return s;
    });
    setEvaluation({ ...evaluation, scores: updatedScores });
  };

  const handleSaveEvaluation = (status: 'draft' | 'finalized') => {
    const updated: Evaluation = {
      ...evaluation,
      status,
      updatedAt: new Date().toISOString(),
    };
    dataService.saveEvaluation(updated, currentUser?.id || 'eval-01', currentUser?.fullName || 'Faculty Evaluator');
    setEvaluation(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Academic Evaluation & Rubric Scorecard
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Formal defense marks linked directly to verified evidence with bidirectional "Why this score?" traversal
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={() => handleSaveEvaluation('draft')}>
            Save Draft
          </Button>
          <Button
            leftIcon={<ShieldCheck size={16} />}
            onClick={() => handleSaveEvaluation('finalized')}
          >
            Finalize Evaluation
          </Button>
        </div>
      </div>

      {/* Rubric Score Summary Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Badge variant="verified">INSTITUTIONAL RUBRIC v{rubric.version}</Badge>
              <Badge status={evaluation.status} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{rubric.title}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Evaluator of Record: <strong>{evaluation.evaluatorName}</strong> &bull; Project: {project.title}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>
              COMPOSITE EVALUATION SCORE
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1.1 }}>
              {evaluation.overallScore.toFixed(1)}{' '}
              <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/ {evaluation.maxTotalScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          Evaluation Rubric Criteria & Evidence Grounding ({evaluation.scores.length})
        </h3>

        {evaluation.scores.map((scoreItem) => {
          const criterionMeta = rubric.criteria.find((c) => c.id === scoreItem.criterionId);

          return (
            <Card key={scoreItem.criterionId}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {scoreItem.criterionId}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                      Weight: {((criterionMeta?.weight || 0.25) * 100).toFixed(0)}%
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {scoreItem.criterionName}
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {criterionMeta?.description}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={scoreItem.maxScore}
                      className="form-input"
                      style={{ width: '85px', fontSize: '1.25rem', fontWeight: 700, textAlign: 'center' }}
                      value={scoreItem.score}
                      onChange={(e) => handleScoreChange(scoreItem.criterionId, parseFloat(e.target.value) || 0)}
                    />
                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      / {scoreItem.maxScore}
                    </span>
                  </div>

                  {/* "Why this score?" Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<HelpCircle size={16} className="text-sky-400" />}
                    onClick={() => handleOpenWhyModal(scoreItem.criterionId)}
                  >
                    Why this score?
                  </Button>
                </div>
              </div>

              {/* Justification Comment */}
              <div style={{ marginTop: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Evaluator Justification Comment
                </label>
                <input
                  className="form-input"
                  style={{ width: '100%' }}
                  value={scoreItem.comment}
                  onChange={(e) => handleCommentChange(scoreItem.criterionId, e.target.value)}
                  placeholder="State evidence-based rationale for this mark..."
                />
              </div>

              {/* Supporting Evidence Attachments */}
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Attach Supporting Verifiable Evidence ({scoreItem.evidenceIds.length} attached)
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {evidenceList.map((ev) => {
                    const isAttached = scoreItem.evidenceIds.includes(ev.id);
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => handleEvidenceToggle(scoreItem.criterionId, ev.id)}
                        className={`demo-pill-btn ${isAttached ? 'active' : ''}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {isAttached ? '✓' : '+'} {ev.title} ({ev.id})
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* "Why This Score?" Traversal Modal */}
      <WhyThisScoreModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        data={whyThisScoreData}
        onSelectEvidence={onOpenEvidence}
      />
    </div>
  );
};
