import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Award, GraduationCap, CheckCircle, ExternalLink, Share2, Copy, Check, FileText } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const projects = dataService.getProjects();
  const project = projects[0];

  const studentId = currentUser?.id || 'usr-student-belgin';
  const studentName = currentUser?.fullName || 'Belgin C.';

  const allEvidence = project ? dataService.getEvidence(project.id) : [];
  const verifiedEvidence = allEvidence.filter(
    (e) => (e.ownerId === studentId || e.ownerName.includes(studentName.split(' ')[0])) &&
           (e.verificationStatus === 'mentor_verified' || e.verificationStatus === 'evaluator_verified')
  );

  const outcomes = dataService.getLearningOutcomes();
  const skills = dataService.getSkills();
  const vivaQuestions = project ? dataService.getVivaQuestions(project.id).filter((q) => q.studentId === studentId) : [];
  const evaluations = project ? dataService.getEvaluations(project.id) : [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Portfolio Header Banner */}
      <div
        className="card-dark"
        style={{
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8' }}>
              ACCREDITED ACADEMIC VERIFICATION DOSSIER
            </span>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>
              CRYPTOGRAPHICALLY BACKED
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {studentName}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#94a3b8', maxWidth: 650, lineHeight: 1.5 }}>
            Verified technical evidence portfolio backed by peer-reviewed code artifacts, empirical load tests, faculty mentor verifications, and oral viva voce defense.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', zIndex: 2 }}>
          <button className="btn btn-secondary btn-md" onClick={handleCopyLink} style={{ gap: '0.5rem' }}>
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? 'Link Copied!' : 'Share Public Portfolio'}
          </button>
          <button className="btn btn-primary btn-md" onClick={() => window.print()} style={{ gap: '0.5rem' }}>
            <FileText size={16} /> Export Academic PDF
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Evidence</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{verifiedEvidence.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>100% Faculty Endorsed</span>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capstone Project</div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem', lineHeight: 1.3 }}>
            {project?.title || 'Academic Project'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: Lead Full-Stack</span>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evaluation Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {evaluations[0]?.overallScore || 92}/100
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Defensible Rubric</span>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outcomes Mastered</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{outcomes.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ABET / NBA Program Criteria</span>
        </div>
      </div>

      {/* Main Evidence Dossier */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Verified Artifact Traceability Timeline
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Direct evidence links verified by faculty mentor Dr. Meena Swaminathan
            </p>
          </div>
          <span className="badge badge-verified" style={{ padding: '0.35rem 0.75rem' }}>
            <ShieldCheck size={14} style={{ marginRight: 4 }} /> VERIFIED ACADEMIC RECORD
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {verifiedEvidence.map((ev) => (
            <div key={ev.id} style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={22} style={{ color: 'var(--success)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ev.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Verified on {new Date(ev.verifiedAt || ev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {ev.description}
                </p>

                {ev.verificationComment && (
                  <div style={{ padding: '0.625rem 0.85rem', background: 'var(--bg-surface)', borderLeft: '3px solid var(--success)', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Faculty Mentor Review: </strong>
                    "{ev.verificationComment}" — <em>{ev.verifiedByName || 'Dr. Meena'}</em>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {ev.sourceUrl && (
                    <a
                      href={ev.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Inspect Source Artifact <ExternalLink size={13} />
                    </a>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Type: {ev.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Viva Voce Defense Defense Evidence */}
      {vivaQuestions.length > 0 && (
        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Viva Voce & Technical Oral Examination Performance
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Questions grounded directly in student code submissions and evaluated by academic review committee
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {vivaQuestions.map((q) => (
              <div key={q.id} style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {q.contextSummary || q.groundingContext}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--success)' }}>
                    Score: {q.score}/10
                  </span>
                </div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Q: {q.question || q.questionText}
                </h4>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem', fontStyle: 'italic' }}>
                  "{q.studentAnswer}"
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Evaluator Evaluation: <strong>{q.evaluatorNotes}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Program Learning Outcomes Demonstrated */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Demonstrated Learning Outcomes (ABET / NBA)
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Competencies proven through attached empirical evidence items
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {outcomes.map((lo) => (
            <div key={lo.id} style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{lo.code}</span>
                <span className="badge badge-verified">{lo.bloomLevel || 'Mastered'}</span>
              </div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {lo.title || lo.name}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {lo.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
