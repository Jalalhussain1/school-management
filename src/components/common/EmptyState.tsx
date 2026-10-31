import React from 'react';
import { Box, Typography } from '@mui/material';
import { Inbox } from 'lucide-react';
import { AppButton } from './AppButton';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search query or filter options to see results.',
  icon,
  actionText,
  onAction,
}) => {
  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          mb: 2,
        }}
      >
        {icon || <Inbox size={30} />}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: actionText ? 2.5 : 0 }}>
        {description}
      </Typography>

      {actionText && onAction && (
        <AppButton variant="contained" color="primary" onClick={onAction}>
          {actionText}
        </AppButton>
      )}
    </Box>
  );
};
