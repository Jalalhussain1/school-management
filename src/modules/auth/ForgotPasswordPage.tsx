import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Mail, ArrowLeft, Send, CheckCircle2, KeyRound } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { AuthLayout } from './AuthLayout';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const { showToast } = useSchool();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);

      if (res.success) {
        setSentSuccess(true);
        showToast('Password reset instructions sent', 'success');
      } else {
        setErrorMsg(res.message || 'Could not send reset email');
      }
    } catch {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your registered email address to receive password recovery instructions."
      showBackToHome
    >
      {/* Main Form Card */}
      <Card
        sx={{
          maxWidth: 480,
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
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1.5,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              <KeyRound size={22} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Password Recovery
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your registered email to receive a password recovery link
            </Typography>
          </Box>

          {sentSuccess ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert
                icon={<CheckCircle2 size={22} />}
                severity="success"
                sx={{ mb: 3, borderRadius: 2.5, textAlign: 'left' }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Reset link sent!
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                  If an account exists for <strong>{email}</strong>, a password reset link has been dispatched to that address.
                </Typography>
              </Alert>

              <AppButton
                component={RouterLink}
                to="/login"
                variant="contained"
                fullWidth
                size="large"
                icon={<ArrowLeft size={18} />}
                sx={{ py: 1.25 }}
              >
                Back to Sign In
              </AppButton>
            </Box>
          ) : (
            <>
              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                    Email Address
                  </Typography>
                  <AppInput
                    id="forgot-email-input"
                    type="email"
                    placeholder="Enter your registered email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={18} color="#94a3b8" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>

                <AppButton
                  id="forgot-submit-button"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  loading={loading}
                  icon={<Send size={18} />}
                  sx={{ py: 1.25, fontSize: '0.95rem' }}
                >
                  Send Recovery Link
                </AppButton>
              </Box>

              <Divider sx={{ my: 3 }} />

              <AppButton
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                icon={<ArrowLeft size={16} />}
                sx={{ py: 1 }}
              >
                Back to Sign In
              </AppButton>
            </>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};
