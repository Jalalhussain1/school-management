import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  FormHelperText,
} from '@mui/material';

export interface DropdownOption {
  value: string | number;
  label: string;
}

export interface AppDropdownProps extends Omit<SelectProps, 'label'> {
  label: string;
  options: DropdownOption[];
  helperText?: string;
  error?: boolean;
}

export const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  size = 'small',
  fullWidth = true,
  helperText,
  error,
  disabled,
  sx,
  ...props
}) => {
  const labelId = `dropdown-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <FormControl fullWidth={fullWidth} size={size} error={error} disabled={disabled} sx={{ minWidth: 140, ...sx }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={onChange}
        sx={{ borderRadius: 2 }}
        {...props}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
