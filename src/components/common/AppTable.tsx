import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  minWidth?: number | string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface AppTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  hover?: boolean;
}

export function AppTable<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your current filter criteria.',
  emptyActionText,
  onEmptyAction,
  hover = true,
}: AppTableProps<T>) {
  if (data.length === 0) {
    return (
      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionText={emptyActionText}
          onAction={onEmptyAction}
        />
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        border: 1,
        borderColor: 'divider',
        boxShadow: 'none',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
                sx={{
                  minWidth: col.minWidth,
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={keyExtractor(row, index)}
              hover={hover}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                transition: 'background-color 0.15s ease',
              }}
            >
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || 'left'}>
                  {col.render ? (
                    col.render(row, index)
                  ) : (
                    <Box sx={{ fontSize: '0.875rem' }}>
                      {String((row as Record<string, unknown>)[col.id] ?? '')}
                    </Box>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
