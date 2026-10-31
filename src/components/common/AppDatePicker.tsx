import React from 'react';
import { Box, TextField, Typography } from '@mui/material';

export interface AppDatePickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  minDate?: string;
  maxDate?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  size = 'small',
  fullWidth = true,
}) => {
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <TextField
        type="date"
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth={fullWidth}
        slotProps={{
          htmlInput: {
            min: minDate,
            max: maxDate,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
          },
        }}
      />
    </Box>
  );
};
