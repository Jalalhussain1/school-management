import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface DashboardChartProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  height?: number | string;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  subtitle,
  action,
  children,
  height = 320,
}) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>

        <Box sx={{ width: '100%', height, position: 'relative' }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};
