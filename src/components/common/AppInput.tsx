import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export interface AppInputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

export const AppInput: React.FC<AppInputProps> = ({
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
  sx,
  ...props
}) => {
  return (
    <TextField
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          transition: 'all 0.2s ease',
        },
        ...sx,
      }}
      {...props}
    />
  );
};
