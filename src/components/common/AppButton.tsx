import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

export interface AppButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  to?: string;
}


export const AppButton: React.FC<AppButtonProps> = ({
  children,
  loading = false,
  icon,
  startIcon,
  disabled,
  sx,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : (startIcon || icon)}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        textTransform: 'none',
        px: 2,
        py: 1,
        transition: 'all 0.2s ease',
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};
