import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
  variant?: ChipProps['variant'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'small',
  variant = 'filled',
}) => {
  const normalized = status.toLowerCase();

  let bg = 'rgba(100, 116, 139, 0.12)';
  let color = '#475569';
  let border = 'transparent';

  // Green statuses
  if (['active', 'paid', 'present', 'passed', 'completed', 'returned', 'published', 'low'].includes(normalized)) {
    bg = 'rgba(16, 185, 129, 0.12)';
    color = '#10b981';
    border = 'rgba(16, 185, 129, 0.2)';
  }
  // Red / Danger statuses
  else if (['absent', 'overdue', 'failed', 'resigned', 'emergency', 'danger', 'high'].includes(normalized)) {
    bg = 'rgba(239, 68, 68, 0.12)';
    color = '#ef4444';
    border = 'rgba(239, 68, 68, 0.2)';
  }
  // Amber / Warning statuses
  else if (['late', 'unpaid', 'on leave', 'maintenance', 'medium', 'warning', 'partial'].includes(normalized)) {
    bg = 'rgba(245, 158, 11, 0.12)';
    color = '#f59e0b';
    border = 'rgba(245, 158, 11, 0.2)';
  }
  // Blue / Info statuses
  else if (['ongoing', 'borrowed', 'upcoming', 'info', 'leave'].includes(normalized)) {
    bg = 'rgba(59, 130, 246, 0.12)';
    color = '#3b82f6';
    border = 'rgba(59, 130, 246, 0.2)';
  }
  // Purple / Graduated
  else if (['graduated', 'closed', 'core'].includes(normalized)) {
    bg = 'rgba(99, 102, 241, 0.12)';
    color = '#6366f1';
    border = 'rgba(99, 102, 241, 0.2)';
  }

  return (
    <Chip
      label={status}
      size={size}
      variant={variant}
      sx={{
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.725rem' : '0.8rem',
        height: size === 'small' ? 22 : 28,
        borderRadius: 1.5,
        textTransform: 'capitalize',
      }}
    />
  );
};
