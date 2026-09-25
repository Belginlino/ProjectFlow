import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { VivaQuestion, Evidence } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  FileText,
  GitPullRequest,
  Sparkles,
  MessageSquare,
  Award,
} from 'lucide-react';

export const ContributionPage: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const projects = dataService.getProjects();
  const project = projects[0];

  if (!project || !project.team?.members?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No active project investigators found.</p>
      </div>
    );
  }

  // Selected student for multi-factor contribution view
  const [selectedStudentId, setSelectedStudentId] = useState<string>(project.team.members[0].uid);
  const selectedStudent = project.team.members.find((m) => m.uid === selectedStudentId) || project.team.members[0];

  const contributionData = dataService.getContributionSnapshot(project.id, selectedStudentId);
  const [vivaQuestions, setVivaQuestions] = useState<VivaQuestion[]>(() =>
    dataService.getVivaQuestions(project.id).filter((q) => q.studentId === selectedStudentId)
  );

  // Viva answering / grading modal
  const [activeQuestion, setActiveQuestion] = useState<VivaQuestion | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluatorNotes, setEvaluatorNotes] = useState('');
  const [vivaScore, setVivaScore] = useState<number>(9);

  const handleGenerateViva = () => {
    dataService.generateEvidenceGroundedViva(project.id, selectedStudentId);
    setVivaQuestions(dataService.getVivaQuestions(project.id).filter((q) => q.studentId === selectedStudentId));
  };

  const handleOpenAnswerModal = (q: VivaQuestion) => {
    setActiveQuestion(q);
    setStudentAnswer(q.studentAnswer || '');
    setEvaluatorNotes(q.evaluatorNotes || '');
    setVivaScore(q.score || 9);
  };

  const handleSaveVivaAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion) return;

    dataService.saveVivaAnswer(
      activeQuestion.id,
      studentAnswer,
      evaluatorNotes,
      vivaScore,
      currentUser?.id || 'eval-01',
      currentUser?.fullName || 'Evaluator'
    );

    setVivaQuestions(dataService.getVivaQuestions(project.id).filter((q) => q.studentId === selectedStudentId));
    setActiveQuestion(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Multi-Factor Contribution & Viva Voce
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Traceable contribution profiles grounded in verified artifacts and evidence-backed technical examination
        </p>
      </div>

      {/* Student Selector Toolbar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          SELECT STUDENT PROFILE:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {project.team.members.map((m) => (
            <button
              key={m.uid}
              type="button"
              onClick={() => {
                setSelectedStudentId(m.uid);
                setVivaQuestions(dataService.getVivaQuestions(project.id).filter((q) => q.studentId === m.uid));
              }}
              className={`demo-pill-btn ${selectedStudentId === m.uid ? 'active' : ''}`}
            >
              {m.fullName} ({m.projectRole})
            </button>
          ))}
        </div>
      </div>

      {/* Contribution Profile Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.fullName}`}
              alt={selectedStudent.fullName}
              style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #38bdf8' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                  {selectedStudent.fullName}
                </h2>
                <Badge variant="verified">{selectedStudent.projectRole.toUpperCase()}</Badge>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {selectedStudent.email} &bull; Computer Science & Engineering
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>
              ACADEMIC INTEGRITY POLICY
            </span>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              No raw commit vanity metrics &bull; Traceable to verified artifacts
            </p>
          </div>
        </div>

        {/* Explainable Multi-Factor Metric Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFIED TASKS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              8
            </div>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>VERIFIED EVIDENCE</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>
              6
            </div>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>MENTOR CONFIRMATIONS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>
              2
            </div>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>PEER SIGNALS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
              4
            </div>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>VIVA EVIDENCE</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>
              1
            </div>
          </div>
        </div>

        {/* Explainable Qualitative Breakdown */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Contribution Evidence
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>
            Contribution is supported by multiple evidence sources.
          </p>
        </div>
      </div>

      {/* Evidence-Grounded Viva Voce Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={22} className="text-sky-400" />
              Evidence-Grounded Viva Voce Examination
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Defense questions formulated strictly from {selectedStudent.fullName}'s verified artifacts
            </p>
          </div>

          <Button 
            variant="secondary" 
            leftIcon={<Sparkles size={16} />} 
            onClick={handleGenerateViva}
            style={{ border: '1px dashed var(--info)', color: 'var(--info)', background: 'var(--info-bg)' }}
          >
            AI Suggestion: Generate Questions
          </Button>
        </div>

        {vivaQuestions.length === 0 ? (
          <Card>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No viva questions generated yet. Click "AI Suggestion: Generate Questions" to formulate defense prompts from verified artifacts.
            </p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {vivaQuestions.map((q, idx) => (
              <Card key={q.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                        QUESTION #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        ({q.contextSummary})
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                      "{q.questionText}"
                    </h4>

                    {q.studentAnswer && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #38bdf8' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Student Defense:</span>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                          {q.studentAnswer}
                        </p>
                      </div>
                    )}

                    {q.evaluatorNotes && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#34d399' }}>
                        <strong>Evaluator Notes:</strong> {q.evaluatorNotes} &bull; Score: <strong>{q.score} / 10</strong>
                      </div>
                    )}
                  </div>

                  <div>
                    <Button size="sm" onClick={() => handleOpenAnswerModal(q)}>
                      Record Response & Notes
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Answer / Evaluation Modal */}
      {activeQuestion && (
        <Modal
          isOpen={Boolean(activeQuestion)}
          onClose={() => setActiveQuestion(null)}
          title="Viva Voce Defense & Grading"
          subtitle={activeQuestion.questionText}
        >
          <form onSubmit={handleSaveVivaAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Student Verbal Answer / Transcription</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Transcribe student explanation and technical response..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Evaluator Defense Notes & Observations</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={evaluatorNotes}
                onChange={(e) => setEvaluatorNotes(e.target.value)}
                placeholder="Assess depth of understanding, edge-case familiarity..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Viva Question Score (out of 10)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                className="form-input"
                value={vivaScore}
                onChange={(e) => setVivaScore(parseFloat(e.target.value))}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="outline" type="button" onClick={() => setActiveQuestion(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Viva Evaluation</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
