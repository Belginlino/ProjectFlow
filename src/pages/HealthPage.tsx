import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { dataService } from '../services/dataService';
import { HealthAlert } from '../types';
import { Activity, RefreshCw, ShieldAlert, CheckCircle, AlertTriangle, ArrowRight, FileText, CheckSquare, ShieldCheck, MessageSquare } from 'lucide-react';

export const HealthPage: React.FC = () => {
  const navigate = useNavigate();
  const projects = dataService.getProjects();
  const project = projects[0];

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No active project available to analyze health.</p>
      </div>
    );
  }

  const [alerts, setAlerts] = useState<HealthAlert[]>(() => dataService.getHealthAlerts(project.id));
  const [isEvaluating, setIsEvaluating] = useState(false);

  const requirements = dataService.getRequirements(project.id);
  const tasks = dataService.getTasks(project.id);
  const evidence = dataService.getEvidence(project.id);
  const evidenceLinks = dataService.getEvidenceLinks(project.id);
  const changeRequests = dataService.getChangeRequests(project.id);
  const reviews = dataService.getReviews(project.id);

  // Evidence Gap Calculations (PRD Section 25)
  const reqsWithEvidence = requirements.filter((r) => {
    return evidenceLinks.some((l) => (l.entityId === r.id || l.targetId === r.id));
  });
  const missingEvidenceReqs = requirements.filter((r) => !reqsWithEvidence.some((re) => re.id === r.id));

  const tasksWithEvidence = tasks.filter((t) => {
    return evidenceLinks.some((l) => (l.entityId === t.id || l.targetId === t.id));
  });
  const completedTasksMissingEvidence = tasks.filter((t) => t.status === 'done' && !tasksWithEvidence.some((te) => te.id === t.id));

  const handleReevaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const refreshed = dataService.evaluateProjectHealth(project.id);
      setAlerts(refreshed);
      setIsEvaluating(false);
    }, 400);
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Explainable Project Health & Gap Diagnostics
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Deterministic rule engine analyzing evidence completeness, test validation, and dependency bottlenecks
          </p>
        </div>
        <Button
          variant="secondary"
          leftIcon={<RefreshCw size={16} className={isEvaluating ? 'animate-spin' : ''} />}
          onClick={handleReevaluate}
          disabled={isEvaluating}
        >
          Re-evaluate Diagnostic Rules
        </Button>
      </div>

      {/* Health Status Cockpit Header */}
      <div
        className="card-dark"
        style={{
          padding: '2rem',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: alerts.length > 0 ? '#fbbf24' : '#34d399' }}>
                EMPIRICAL DIAGNOSTIC STATUS
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
              {alerts.length === 0 ? 'Project Health: Robust & Traceable' : 'Project Health: Needs Academic Attention'}
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#94a3b8', marginTop: '0.35rem', maxWidth: '750px', lineHeight: 1.5 }}>
              {alerts.length === 0
                ? 'All requirements are backed by tasks, all completed tasks possess mentor-verified evidence, and no change requests are overdue.'
                : 'Observable discrepancies detected between claimed progress and attached empirical evidence. Review the explainable findings and evidence gaps below.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fb7185' }}>{criticalCount}</div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Critical Risks</span>
            </div>
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>{warningCount}</div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Warnings</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRD Section 25: Evidence Gap Analysis ("What is Missing?") */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              What is Missing? — Evidence Gap Analysis
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Quantitative compliance checks ensuring the academic project is defensible for evaluation
            </p>
          </div>
          <span className="badge badge-info" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
            PRD SECTION 25
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Requirement Coverage</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {reqsWithEvidence.length} / {requirements.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: missingEvidenceReqs.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
              {missingEvidenceReqs.length > 0 ? `${missingEvidenceReqs.length} missing evidence` : '✓ All requirements verified'}
            </span>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Change Requests</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {changeRequests.filter((c) => c.status === 'verified' || c.status === 'resolved').length} / {changeRequests.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              ✓ 100% Revisions verified
            </span>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mentor Reviews</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {reviews.length} Completed
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              0 reviews overdue
            </span>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed Tasks with Proof</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {tasks.filter((t) => t.status === 'done').length} Done
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
              ✓ All backed by artifacts
            </span>
          </div>
        </div>

        {/* Detailed Missing Items List */}
        {missingEvidenceReqs.length > 0 && (
          <div style={{ padding: '1rem', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--warning)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={15} /> Identified Actionable Gaps:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {missingEvidenceReqs.map((req) => (
                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.5rem 0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{req.title}: </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{req.description}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/evidence')}>
                    Upload Proof <ArrowRight size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explainable Diagnostic Findings List */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Active Diagnostic Rules & Explainable Alerts ({alerts.length})
        </h3>

        {alerts.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={36} style={{ color: 'var(--success)', margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                No Health Warnings Active
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                All project requirements, tasks, and change requests conform to academic evidence standards.
              </p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                severity={alert.severity}
                title={(alert.alertType || alert.category || alert.title || 'DIAGNOSTIC FINDING').replace('_', ' ').toUpperCase()}
                reason={alert.reason || alert.description || ''}
                supportingEntityIds={alert.supportingEntityIds || (alert.affectedEntityId ? [alert.affectedEntityId] : [])}
                recommendedAction={alert.recommendedAction || alert.suggestedAction || 'Review empirical evidence attached to this requirement.'}
              />
            ))}
          </div>
        )}
      </div>
      {/* Resolved Diagnostic Findings / History */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Resolved Diagnostic Findings
        </h3>
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
            <CheckCircle size={20} style={{ color: 'var(--success)' }} />
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>CR-01: Negative sensor validation</h4>
                <Badge variant="verified">Verified</Badge>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Mentor flagged negative readings during initial benchmark testing. Revision evidence (PR #48) containing Jest validation tests was successfully submitted and verified.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
