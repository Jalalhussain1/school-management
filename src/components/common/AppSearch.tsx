import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, X } from 'lucide-react';

export interface AppSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  size?: 'small' | 'medium';
  width?: string | number | Record<string, string | number>;
}

export const AppSearch: React.FC<AppSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search records...',
  size = 'small',
  width = 280,
}) => {
  return (
    <TextField
      size={size}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        width,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: 'background.paper',
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} style={{ opacity: 0.6 }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => onChange('')} edge="end">
                <X size={15} />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
};
