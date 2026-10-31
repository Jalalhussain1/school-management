import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  footerText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  footerText,
}) => {
  const colorMap = {
    primary: { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563eb' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
    info: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
    secondary: { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366f1' },
  };

  const selectedColor = colorMap[color];

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0, 0, 0, 0.5)'
              : '0 8px 20px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, letterSpacing: '-0.02em' }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2.5,
              backgroundColor: selectedColor.bg,
              color: selectedColor.text,
            }}
          >
            {icon}
          </Box>
        </Box>

        {(trend || footerText) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {trend && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: trend.isPositive !== false ? 'success.main' : 'error.main',
                }}
              >
                {trend.isPositive !== false ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{trend.value}</span>
              </Box>
            )}
            <Typography variant="caption" color="text.secondary">
              {trend?.label || footerText}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
