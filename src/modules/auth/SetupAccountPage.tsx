import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Lock, Eye, EyeOff, User, Mail, Shield, Camera, X, CheckCircle, ArrowRight } from 'lucide-react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { api } from '../../services/api';
import { useSchool } from '../../context/SchoolContext';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { AuthLayout } from './AuthLayout';

export const SetupAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useSchool();

  const token = searchParams.get('token') || '';

  const [verifying, setVerifying] = useState(true);
  const [invitationData, setInvitationData] = useState<{
    email: string;
    name: string;
    role: string;
    token: string;
  } | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setErrorMsg('No invitation token found in the URL. Please check the invitation email link.');
      return;
    }

    api.auth
      .verifyInvite(token)
      .then((res) => {
        if (res.success && res.invitation) {
          setInvitationData(res.invitation);
        } else {
          setErrorMsg(res.message || 'Invalid or expired invitation link');
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Failed to verify invitation link');
      })
      .finally(() => {
        setVerifying(false);
      });
  }, [token]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.setupAccount({
        token,
        password,
        avatar: avatar || undefined,
      });

      if (res.success) {
        showToast('Account successfully activated! Please log in with your new credentials.', 'success');
        navigate('/login');
      } else {
        setErrorMsg(res.message || 'Failed to activate account');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete account setup');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <AuthLayout title="Verifying Invitation" subtitle="Please wait while we validate your security token...">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Verifying your school invitation link...
          </Typography>
        </Box>
      </AuthLayout>
    );
  }

  if (errorMsg && !invitationData) {
    return (
      <AuthLayout title="Invitation Invalid" subtitle="Unable to activate this account">
        <Card sx={{ maxWidth: 480, mx: 'auto', borderRadius: 3, p: 2 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The invitation link may have expired or already been activated. Please contact your school administrator.
            </Typography>
            <AppButton variant="contained" onClick={() => navigate('/login')}>
              Return to Login
            </AppButton>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set Up Your Account"
      subtitle="Welcome to EduManage! Set your password to activate your portal access."
    >
      <Card
        sx={{
          maxWidth: 500,
          mx: 'auto',
          borderRadius: 3.5,
          border: 1,
          borderColor: 'divider',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0, 0, 0, 0.4)'
              : '0 12px 36px rgba(37, 99, 235, 0.08)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Account Activation
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set your personal password to access your role portal
            </Typography>
          </Box>

          {/* Invitation Details Banner */}
          <Box
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2.5,
              bgcolor: 'action.hover',
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {invitationData?.name}
              </Typography>
              <Chip
                label={`${invitationData?.role} Role`}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Verified Email: <strong>{invitationData?.email}</strong>
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* Profile Photo Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={avatar}
                  sx={{
                    width: 76,
                    height: 76,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0'),
                    color: 'primary.main',
                    border: '3px solid',
                    borderColor: 'primary.main',
                    cursor: avatar ? 'default' : 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.04)' },
                  }}
                  onClick={() => {
                    if (!avatar) fileInputRef.current?.click();
                  }}
                >
                  {invitationData?.name ? invitationData.name.charAt(0).toUpperCase() : <Camera size={32} />}
                </Avatar>

                {avatar ? (
                  <Tooltip title="Delete photo">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAvatar();
                      }}
                      sx={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        bgcolor: 'error.main',
                        color: '#fff',
                        width: 28,
                        height: 28,
                        '&:hover': { bgcolor: 'error.dark' },
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                      }}
                    >
                      <X size={16} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Upload photo">
                    <IconButton
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        bgcolor: 'primary.main',
                        color: '#fff',
                        width: 28,
                        height: 28,
                        '&:hover': { bgcolor: 'primary.dark' },
                        boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
                      }}
                    >
                      <Camera size={14} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
                {avatar ? 'Click delete icon to remove' : 'Upload Profile Photo (Optional)'}
              </Typography>
            </Box>

            {/* Password */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Set Password
              </Typography>
              <AppInput
                id="setup-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Confirm Password */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Confirm Password
              </Typography>
              <AppInput
                id="setup-confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <AppButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              loading={loading}
              endIcon={<ArrowRight size={18} />}
              sx={{ py: 1.4, fontWeight: 700 }}
            >
              Activate Account & Continue
            </AppButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an activated account?{' '}
              <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                <Typography component="span" variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                  Log In Here
                </Typography>
              </RouterLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};
