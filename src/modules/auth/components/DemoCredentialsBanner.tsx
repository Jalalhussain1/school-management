import React from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  Tooltip,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';

import {
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Users,
  Copy,
  Check,
  Zap,
  KeyRound,
} from 'lucide-react';
import { DEMO_CREDENTIALS, DemoCredential, UserRole } from '../../../types/auth';
import { AppButton } from '../../../components/common/AppButton';

export interface DemoCredentialsBannerProps {
  onSelectRole: (cred: DemoCredential) => void;
  activeRole?: UserRole;
  compact?: boolean;
}

export const DemoCredentialsBanner: React.FC<DemoCredentialsBannerProps> = ({
  onSelectRole,
  activeRole = 'Admin',
  compact = false,
}) => {
  const theme = useTheme();
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return <ShieldCheck size={18} />;
      case 'Teacher':
        return <GraduationCap size={18} />;
      case 'Student':
        return <UserCheck size={18} />;
      case 'Parent':
        return <Users size={18} />;
    }
  };

  const getRoleGradient = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
      case 'Teacher':
        return 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
      case 'Student':
        return 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
      case 'Parent':
        return 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        borderRadius: 3,
        border: 1,
        borderColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(37, 99, 235, 0.15)',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 10px 30px rgba(0, 0, 0, 0.35)'
            : '0 8px 24px rgba(37, 99, 235, 0.08)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KeyRound size={17} />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.925rem' }}>
              Demo Access Credentials (All Roles Available)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click any role card below to instantly auto-fill credentials into the form
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<Zap size={13} style={{ marginLeft: 6 }} />}
          label="1-Click Auto Fill"
          size="small"
          color="primary"
          variant="filled"
          sx={{ fontWeight: 700, fontSize: '0.72rem', height: 24 }}
        />
      </Box>

      {/* Role Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: compact ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {DEMO_CREDENTIALS.map((cred) => {
          const isSelected = activeRole === cred.role;
          return (
            <Card
              key={cred.role}
              onClick={() => onSelectRole(cred)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                borderRadius: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: 2,
                borderColor: isSelected
                  ? 'primary.main'
                  : theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.08)',
                backgroundColor: isSelected
                  ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.15 : 0.06)
                  : theme.palette.background.paper,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: 'primary.main',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.16)',
                },
              }}
            >
              {/* Top Badge & Role Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: 1.5,
                      background: getRoleGradient(cred.role),
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getRoleIcon(cred.role)}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {cred.label}
                  </Typography>
                </Box>

                {isSelected && (
                  <Chip
                    label="Active"
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                  />
                )}
              </Box>

              {/* Person Name & Description */}
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'block' }}>
                {cred.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block', mb: 1.25 }} noWrap>
                {cred.description}
              </Typography>

              {/* Email & Password snippet */}
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : '#f1f5f9',
                  border: 1,
                  borderColor: 'divider',
                  mb: 1.25,
                }}
              >
                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ minWidth: 0, pr: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', fontWeight: 600 }}>
                      EMAIL
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.72rem' }} noWrap>
                      {cred.email}
                    </Typography>
                  </Box>
                  <Tooltip title="Copy Email">
                    <IconButton
                      size="small"
                      onClick={(e) => handleCopy(cred.email, `${cred.role}-email`, e)}
                      sx={{ p: 0.4 }}
                    >
                      {copiedKey === `${cred.role}-email` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Password */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ minWidth: 0, pr: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', fontWeight: 600 }}>
                      PASSWORD
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'primary.main', fontSize: '0.75rem' }}>
                      {cred.password}
                    </Typography>
                  </Box>
                  <Tooltip title="Copy Password">
                    <IconButton
                      size="small"
                      onClick={(e) => handleCopy(cred.password, `${cred.role}-pwd`, e)}
                      sx={{ p: 0.4 }}
                    >
                      {copiedKey === `${cred.role}-pwd` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Auto fill Action button */}
              <AppButton
                size="small"
                variant={isSelected ? 'contained' : 'outlined'}
                color="primary"
                fullWidth
                icon={<Zap size={13} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRole(cred);
                }}
                sx={{ py: 0.5, fontSize: '0.72rem', height: 28 }}
              >
                {isSelected ? 'Selected' : 'Use Credential'}
              </AppButton>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};
