import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Camera, X } from 'lucide-react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types/auth';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { AuthLayout } from './AuthLayout';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useSchool();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleOptions = [
    { value: 'Admin', label: 'Administrator / Principal' },
    { value: 'Teacher', label: 'Teacher / Faculty' },
    { value: 'Student', label: 'Student' },
    { value: 'Parent', label: 'Parent / Guardian' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP)');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service to proceed');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, role, avatar || undefined);

      if (res.success) {
        showToast('Registration successful! Please log in with your credentials.', 'success');
        navigate('/login');
      } else {
        setErrorMsg(res.message || 'Failed to create account');
      }
    } catch {
      setErrorMsg('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Register for a new EduManage account to get started."
    >

      {/* Main Registration Card */}
      <Card
        sx={{
          maxWidth: 520,
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
              Register Portal Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure your role and credential permissions
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* Profile Image Upload */}
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
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.04)',
                      boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                    },
                  }}
                  onClick={() => {
                    if (!avatar) fileInputRef.current?.click();
                  }}
                >
                  {name ? name.charAt(0).toUpperCase() : <Camera size={32} />}
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
                {avatar ? 'Click delete icon to remove' : 'Upload Profile Picture (Optional)'}
              </Typography>
            </Box>

            {/* Full Name field using common AppInput */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Full Name
              </Typography>
              <AppInput
                id="register-name-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            {/* Email field using common AppInput */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Official Email Address
              </Typography>
              <AppInput
                id="register-email-input"
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

            {/* Role dropdown using common AppDropdown */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Account Portal Role
              </Typography>
              <AppDropdown
                label="Select Role"
                options={roleOptions}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                helperText="Determines accessible modules and administrative permissions"
              />
            </Box>

            {/* Password field using common AppInput */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Password (min. 6 characters)
              </Typography>
              <AppInput
                id="register-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a secure password"
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

            {/* Confirm Password field using common AppInput */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.75, display: 'block' }}>
                Confirm Password
              </Typography>
              <AppInput
                id="register-confirm-password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
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

            {/* Agree Terms Checkbox */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.825rem' }}>
                    I agree to the EduManage Terms of Service and School Privacy Policy
                  </Typography>
                }
              />
            </Box>

            {/* Submit button using common AppButton */}
            <AppButton
              id="register-submit-button"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              loading={loading}
              icon={<UserPlus size={18} />}
              sx={{ py: 1.25, fontSize: '0.95rem' }}
            >
              Create {role} Account
            </AppButton>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 600 }}>
              ALREADY REGISTERED?
            </Typography>
          </Divider>

          {/* Back to Login using common AppButton */}
          <AppButton
            component={RouterLink}
            to="/login"
            variant="outlined"
            fullWidth
            icon={<LogIn size={16} />}
            sx={{ py: 1 }}
          >
            Sign In with Existing Account
          </AppButton>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};
