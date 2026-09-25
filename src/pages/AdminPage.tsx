import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Settings, Users, FolderGit2, CheckCircle2, AlertTriangle, RefreshCw, Download, FileSpreadsheet, ShieldAlert } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState(() => dataService.getProjects());
  const [auditLogs, setAuditLogs] = useState(() => dataService.getAuditLogs());
  const [resetMessage, setResetMessage] = useState('');

  const project = projects[0];
  const allEvidence = project ? dataService.getEvidence(project.id) : [];
  const pendingReviews = allEvidence.filter((e) => e.verificationStatus === 'submitted').length;
  const verifiedEvidence = allEvidence.filter((e) => e.verificationStatus === 'mentor_verified' || e.verificationStatus === 'evaluator_verified').length;
  const healthAlerts = project ? dataService.getHealthAlerts(project.id) : [];

  const handleReset = () => {
    dataService.resetDemoData();
    setProjects(dataService.getProjects());
    setAuditLogs(dataService.getAuditLogs());
    setResetMessage('Demo data reset to factory initial state.');
    setTimeout(() => setResetMessage(''), 3000);
  };

  const handleExportAudit = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Timestamp,User,Action,EntityType,EntityId'].join(',') +
      '\n' +
      auditLogs.map((l) => `${l.timestamp},${l.userName},${l.action},${l.entityType},${l.entityId || ''}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'projectflow_audit_trail.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Institutional Administration & Audit Cockpit
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Apex Institute of Technology • Department of Computer Science & Engineering
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-md" onClick={handleExportAudit} style={{ gap: '0.4rem' }}>
            <Download size={15} /> Export Audit CSV
          </button>
          <button className="btn btn-secondary btn-md" onClick={handleReset} style={{ gap: '0.4rem' }}>
            <RefreshCw size={15} /> Reset Demo Data
          </button>
        </div>
      </div>

      {resetMessage && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontSize: '0.875rem' }}>
          {resetMessage}
        </div>
      )}

      {/* KPI Top Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Projects</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{projects.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>AY 2026–2027 Cohort</span>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Investigators</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {project?.team.members.length || 4}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Undergraduate Capstone</span>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verified Evidence Items</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{verifiedEvidence}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evidence-backed compliance</span>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: pendingReviews > 0 ? 'var(--warning)' : 'var(--text-primary)', marginTop: '0.25rem' }}>
            {pendingReviews}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Faculty mentor queue</span>
        </div>
      </div>

      {/* Department Oversight and Workload */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Accreditation & Outcome Coverage Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { label: 'PO-01: Engineering Knowledge', coverage: 100, evidence: 6 },
              { label: 'PO-02: Problem Analysis & Validation', coverage: 85, evidence: 5 },
              { label: 'PO-03: Scalable Architecture Design', coverage: 90, evidence: 5 },
              { label: 'PO-05: Modern Tooling & CI/CD', coverage: 95, evidence: 4 },
              { label: 'PO-09: Multidisciplinary Teamwork', coverage: 100, evidence: 4 },
            ].map((po) => (
              <div key={po.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{po.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{po.evidence} verified items ({po.coverage}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${po.coverage}%`, background: 'var(--text-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Faculty Mentor Workload
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Dr. Meena Swaminathan</strong>
                <Badge status="verified">Active</Badge>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Assigned: Smart Campus Energy Platform
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                ✓ 6 Evidence Approved • 1 Change Request Issued • 0 Overdue
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Prof. Rajesh Nair</strong>
                <Badge status="verified">Evaluator</Badge>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Evaluation Committee Member • Oral Viva Chair
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                ✓ 3 Viva Questions Examined • Rubric Scorecard Drafted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immutable Institutional Audit Trail */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Immutable Compliance Audit Trail ({auditLogs.length} Records)
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tamper-evident logs of all artifact uploads, reviews, change requests, and rubric scores
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Timestamp</th>
                <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>User</th>
                <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action</th>
                <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Entity Type</th>
                <th style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Entity ID</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {log.userName}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: 'var(--bg-surface-elevated)', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                    {log.entityType}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {log.entityId || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
