import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

export interface LoadingSkeletonProps {
  type?: 'table' | 'cards' | 'dashboard';
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'table',
  rows = 5,
}) => {
  if (type === 'cards') {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2.5 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="90%" height={18} sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 2, borderRadius: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1.5, mb: 1.5 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={52} sx={{ borderRadius: 1.5, mb: 1 }} />
      ))}
    </Box>
  );
};
