import React from 'react';
import { Box, Card, Typography, Chip } from '@mui/material';
import { ShieldAlert, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../../components/common/AppButton';

export interface AccessDeniedPageProps {
  requiredRole?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ requiredRole }) => {
  const navigate = useNavigate();
  const { currentUser, switchRole } = useAuth();

  return (
    <Box
      sx={{
        py: 8,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          textAlign: 'center',
          borderRadius: 3.5,
          border: 1,
          borderColor: 'divider',
          boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            bgcolor: 'error.lighter',
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5,
          }}
        >
          <ShieldAlert size={34} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Access Restricted
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You do not have permission to view this module. This section requires higher administrative privileges.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          <Chip
            label={`Current Role: ${currentUser?.role || 'Guest'}`}
            color="warning"
            size="small"
            sx={{ fontWeight: 700 }}
          />
          {requiredRole && (
            <Chip
              label={`Required: ${requiredRole}`}
              color="default"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <AppButton
            variant="contained"
            color="primary"
            fullWidth
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate('/')}
          >
            Return to Allowed Dashboard
          </AppButton>

          <AppButton
            variant="outlined"
            color="secondary"
            fullWidth
            icon={<RotateCcw size={16} />}
            onClick={() => {
              switchRole('Admin');
              navigate('/');
            }}
          >
            Switch to Administrator (Full Access)
          </AppButton>
        </Box>
      </Card>
    </Box>
  );
};
