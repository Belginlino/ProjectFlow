import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { dataService } from '../services/dataService';
import { AuditLog } from '../types';
import { History, Shield, Lock, Search } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const [logs] = useState<AuditLog[]>(() => dataService.getAuditLogs());
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = logs.filter((log) => filterAction === 'all' || log.action === filterAction);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Governance & Immutable Audit Trail
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Tamper-evident logs of all project modifications, evidence verifications, reviews and evaluations
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontSize: '0.8125rem', fontWeight: 600 }}>
          <Lock size={16} /> Immutable Ledger Active
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
          FILTER BY ACTION:
        </span>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        >
          <option value="all">All Audit Actions</option>
          <option value="UPLOAD_EVIDENCE">Evidence Uploads</option>
          <option value="VERIFY_EVIDENCE">Mentor Verifications</option>
          <option value="SUBMIT_REVIEW">Reviews & Feedback</option>
          <option value="SAVE_EVALUATION">Evaluation Changes</option>
          <option value="CREATE_TASK">Task Creation</option>
          <option value="DEMO_ROLE_SWITCH">Persona Switches</option>
        </select>
      </div>

      {/* Logs Table / List */}
      <Card>
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No audit records matching filter criteria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {log.id}
                    </span>
                    <Badge variant="verified">{log.action}</Badge>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                      {log.entityType.toUpperCase()} {log.entityId && `(${log.entityId})`}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    Actor: <strong>{log.userName}</strong> &bull; User ID: {log.userId}
                  </div>
                  {log.details && (
                    <pre
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-secondary)',
                        overflowX: 'auto',
                      }}
                    >
                      {JSON.stringify(log.details)}
                    </pre>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
