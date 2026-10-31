import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { AuthLayout } from './AuthLayout';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useSchool();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);

      if (res.success) {
        showToast(`Welcome back! Signed in successfully`, 'success');
        navigate('/');
      } else {
        setErrorMsg(res.message || 'Invalid credentials');
      }
    } catch {
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to EduManage"
      subtitle="Sign in to your account to access the school management portal."
    >
      {/* Main Login Form Card */}
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
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              Account Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email and password to access your portal
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* Email field using common AppInput */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Email Address
              </Typography>
              <AppInput
                id="login-email-input"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
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

            {/* Password field using common AppInput */}
            <Box sx={{ mb: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  Password
                </Typography>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="caption"
                  underline="hover"
                  sx={{ fontWeight: 700, color: 'primary.main' }}
                >
                  Forgot Password?
                </Link>
              </Box>
              <AppInput
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
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
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Remember Me */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                    Remember me for 30 days
                  </Typography>
                }
              />
            </Box>

            {/* Submit button using common AppButton */}
            <AppButton
              id="login-submit-button"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              loading={loading}
              icon={<LogIn size={18} />}
              sx={{ py: 1.25, fontSize: '0.95rem' }}
            >
              Sign In
            </AppButton>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
              NEW TO EDUMANAGE?
            </Typography>
          </Divider>

          {/* Create Account Link using common AppButton */}
          <AppButton
            component={RouterLink}
            to="/register"
            variant="outlined"
            fullWidth
            icon={<UserPlus size={16} />}
            sx={{ py: 1 }}
          >
            Create New Account
          </AppButton>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};
