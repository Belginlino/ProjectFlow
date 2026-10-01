import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, ChevronRight } from 'lucide-react';

interface AlertProps {
  severity?: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  reason?: string;
  recommendedAction?: string;
  supportingEntityIds?: string[];
  onActionClick?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  title,
  reason,
  recommendedAction,
  supportingEntityIds,
  onActionClick,
  className = '',
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={20} className="text-rose-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-400" />;
      case 'success':
        return <CheckCircle size={20} className="text-emerald-400" />;
      default:
        return <Info size={20} className="text-sky-400" />;
    }
  };

  const getVariantStyles = () => {
    switch (severity) {
      case 'critical':
        return { background: 'var(--rose-bg)', border: '1px solid var(--rose-border)', color: '#fda4af' };
      case 'warning':
        return { background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', color: '#fcd34d' };
      case 'success':
        return { background: 'var(--emerald-bg)', border: '1px solid var(--emerald-border)', color: '#6ee7b7' };
      default:
        return { background: 'var(--cyan-bg)', border: '1px solid var(--cyan-border)', color: '#7dd3fc' };
    }
  };

  return (
    <div
      role="alert"
      className={`card ${className}`}
      style={{
        ...getVariantStyles(),
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
        <div style={{ marginTop: '0.15rem' }}>{getIcon()}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{title}</h4>
          {reason && (
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
              <strong>Reason:</strong> {reason}
            </p>
          )}

          {supportingEntityIds && supportingEntityIds.length > 0 && (
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', opacity: 0.75 }}>Linked Entities:</span>
              {supportingEntityIds.map((id) => (
                <span
                  key={id}
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.15rem 0.4rem',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {id}
                </span>
              ))}
            </div>
          )}

          {recommendedAction && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '0.5rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                💡 Action: {recommendedAction}
              </span>
              {onActionClick && (
                <button
                  type="button"
                  onClick={onActionClick}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}
                >
                  Resolve <ChevronRight size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
