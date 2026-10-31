import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { ShieldCheck, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackToHome?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackToHome = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useAppTheme();
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? '#070d19' : '#f8fafc',
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(124, 58, 237, 0.12) 0px, transparent 50%)'
            : 'radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.7) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(243, 232, 255, 0.7) 0px, transparent 50%)',
        position: 'relative',
        py: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Top Header Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1100,
          width: '100%',
          mx: 'auto',
          mb: 3,
        }}
      >
        {/* Brand */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          >
            <ShieldCheck size={24} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EduManage
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
              ENTERPRISE SCHOOL SUITE
            </Typography>
          </Box>
        </Box>

        {/* Right Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isAuthenticated && currentUser && (
            <Chip
              label={`Logged in: ${currentUser.role}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700, display: { xs: 'none', sm: 'inline-flex' } }}
            />
          )}

          {showBackToHome && (
            <IconButton
              onClick={() => navigate('/')}
              size="small"
              sx={{
                p: 1,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
              }}
              title="Go to Dashboard"
            >
              <ArrowLeft size={18} />
            </IconButton>
          )}

          {/* Theme switcher */}
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{
              p: 1,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#ffffff',
            }}
          >
            {mode === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#64748b" />}
          </IconButton>
        </Box>
      </Box>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ my: 'auto', px: { xs: 0, sm: 2 } }}>
        {/* Title & Subtitle */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.1rem' },
              letterSpacing: '-0.02em',
              mb: 0.75,
            }}
          >
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto', fontSize: '0.95rem' }}>
            {subtitle}
          </Typography>
        </Box>

        {/* Content & Form */}
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          {children}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          maxWidth: 700,
          mx: 'auto',
          px: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem', mb: 0.5 }}>
          EduManage v2.4.0 • Enterprise Academic & Administrative Portal • 100% Client-Side Mock Session
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
          Role-Based Access Control Active: Administrator, Faculty, Student, and Parent Portals.
        </Typography>
      </Box>
    </Box>
  );
};
