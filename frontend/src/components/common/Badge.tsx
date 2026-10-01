import React from 'react';
import { VerificationStatus, TaskStatus, RequirementPriority } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

interface BadgeProps {
  status?: VerificationStatus | TaskStatus | RequirementPriority | string;
  variant?: 'verified' | 'submitted' | 'warning' | 'critical' | 'neutral';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ status, variant, children }) => {
  let badgeVariant = variant || 'neutral';
  let icon: React.ReactNode = null;
  let label = children || status;

  if (status === 'mentor_verified' || status === 'evaluator_verified' || status === 'done' || status === 'verified') {
    badgeVariant = 'verified';
    icon = <ShieldCheck size={12} />;
    label = status === 'mentor_verified' ? 'Mentor Verified' : status === 'evaluator_verified' ? 'Evaluator Verified' : label;
  } else if (status === 'submitted' || status === 'review' || status === 'testing') {
    badgeVariant = 'submitted';
    icon = <Clock size={12} />;
  } else if (status === 'warning' || status === 'medium' || status === 'in_progress') {
    badgeVariant = 'warning';
    icon = <AlertTriangle size={12} />;
  } else if (status === 'critical' || status === 'high' || status === 'rejected') {
    badgeVariant = 'critical';
    icon = <XCircle size={12} />;
  } else if (status === 'unverified' || status === 'backlog' || status === 'todo') {
    badgeVariant = 'neutral';
  }

  return (
    <span className={`badge badge-${badgeVariant}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};
