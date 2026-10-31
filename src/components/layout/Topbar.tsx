import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  User,
  Settings,
  RotateCcw,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  UserPlus,
  Camera,
  Trash2,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../../context/ThemeContext';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole, DEMO_CREDENTIALS } from '../../types/auth';
import { AppButton } from '../common/AppButton';

export interface TopbarProps {
  onMobileToggle: () => void;
  onOpenSearch: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileToggle, onOpenSearch }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useAppTheme();
  const { notifications, markNotificationRead, clearAllNotifications, resetAllData, settings, showToast } = useSchool();
  const { currentUser, updateProfile, logout, switchRole } = useAuth();

  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [quickAnchor, setQuickAnchor] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);


  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenNotif = (e: React.MouseEvent<HTMLElement>) => setNotifAnchor(e.currentTarget);
  const handleCloseNotif = () => setNotifAnchor(null);

  const handleOpenProfile = (e: React.MouseEvent<HTMLElement>) => setProfileAnchor(e.currentTarget);
  const handleCloseProfile = () => setProfileAnchor(null);

  const handleOpenQuick = (e: React.MouseEvent<HTMLElement>) => setQuickAnchor(e.currentTarget);
  const handleCloseQuick = () => setQuickAnchor(null);

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#0e1626' : '#ffffff',
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3 }, gap: 1.5 }}>
          {/* Mobile hamburger */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onMobileToggle}
            sx={{ display: { md: 'none' }, mr: 0.5 }}
          >
            <MenuIcon size={20} />
          </IconButton>

          {/* Mobile brand text */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mr: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              EduManage
            </Typography>
          </Box>

          {/* Academic Session Chip */}
          <Chip
            icon={<Calendar size={13} style={{ marginLeft: 6 }} />}
            label={`Session ${settings.currentAcademicYear}`}
            size="small"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              backgroundColor: 'action.hover',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />

          {/* Global Search Bar (Spotlight Trigger) */}
          <Button
            onClick={onOpenSearch}
            sx={{
              flexGrow: { xs: 1, sm: 0 },
              minWidth: { xs: 'auto', sm: 260, md: 320 },
              maxWidth: 420,
              justifyContent: 'space-between',
              px: 1.75,
              py: 0.8,
              borderRadius: 2.5,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
              color: 'text.secondary',
              border: 1,
              borderColor: 'transparent',
              '&:hover': {
                borderColor: 'divider',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Search size={16} />
              <Typography variant="body2" sx={{ fontSize: '0.85rem' }} noWrap>
                Search anything...
              </Typography>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                px: 0.75,
                py: 0.2,
                borderRadius: 1,
                backgroundColor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                fontSize: '0.675rem',
                fontWeight: 600,
              }}
            >
              ⌘K
            </Box>
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {/* Quick Action Button */}
          <AppButton
            variant="contained"
            color="primary"
            size="small"
            icon={<Plus size={16} />}
            onClick={handleOpenQuick}
            sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          >
            Quick Action
          </AppButton>

          {/* Quick Action Menu */}
          <Menu
            anchorEl={quickAnchor}
            open={Boolean(quickAnchor)}
            onClose={handleCloseQuick}
            slotProps={{ paper: { sx: { width: 220, borderRadius: 2.5, mt: 1 } } }}
          >
            <MenuItem onClick={() => { handleCloseQuick(); navigate('/students'); }}>
              <ListItemIcon><UserPlus size={18} color="#2563eb" /></ListItemIcon>
              <ListItemText primary="New Student" secondary="Enroll new candidate" />
            </MenuItem>
            <MenuItem onClick={() => { handleCloseQuick(); navigate('/fees'); }}>
              <ListItemIcon><DollarSign size={18} color="#10b981" /></ListItemIcon>
              <ListItemText primary="Record Fee" secondary="Issue or collect voucher" />
            </MenuItem>
            <MenuItem onClick={() => { handleCloseQuick(); navigate('/attendance'); }}>
              <ListItemIcon><Calendar size={18} color="#f59e0b" /></ListItemIcon>
              <ListItemText primary="Mark Attendance" secondary="Record daily presence" />
            </MenuItem>
            <MenuItem onClick={() => { handleCloseQuick(); navigate('/announcements'); }}>
              <ListItemIcon><Bell size={18} color="#8b5cf6" /></ListItemIcon>
              <ListItemText primary="Announce Notice" secondary="Post circular to portal" />
            </MenuItem>
          </Menu>

          {/* Dark / Light Mode Toggle */}
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            size="small"
            sx={{
              p: 1,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            {mode === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#64748b" />}
          </IconButton>

          {/* Notifications Dropdown */}
          <IconButton
            onClick={handleOpenNotif}
            color="inherit"
            size="small"
            sx={{
              p: 1,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Bell size={18} />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={handleCloseNotif}
            slotProps={{ paper: { sx: { width: 340, maxHeight: 440, borderRadius: 3, mt: 1 } } }}
          >
            <Box sx={{ p: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Notifications ({unreadCount} new)
              </Typography>
              {unreadCount > 0 && (
                <Button size="small" onClick={clearAllNotifications} sx={{ fontSize: '0.75rem', p: 0.5 }}>
                  Mark all read
                </Button>
              )}
            </Box>
            <Divider />

            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            ) : (
              notifications.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => {
                    markNotificationRead(item.id);
                    if (item.link) navigate(item.link);
                    handleCloseNotif();
                  }}
                  sx={{
                    px: 2,
                    py: 1.25,
                    backgroundColor: item.read ? 'transparent' : 'action.hover',
                    borderLeft: item.read ? 'none' : '3px solid #2563eb',
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: item.read ? 500 : 700 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                        {item.time}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {item.message}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          {/* User Profile Menu */}
          <Box
            onClick={handleOpenProfile}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              cursor: 'pointer',
              p: 0.5,
              pl: 1,
              borderRadius: 2.5,
              border: 1,
              borderColor: 'transparent',
              '&:hover': {
                borderColor: 'divider',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Avatar
              src={currentUser?.avatar}
              sx={{
                width: 34,
                height: 34,
                bgcolor:
                  currentUser?.role === 'Admin'
                    ? 'primary.main'
                    : currentUser?.role === 'Teacher'
                    ? '#7c3aed'
                    : currentUser?.role === 'Student'
                    ? '#0284c7'
                    : '#d97706',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'SJ'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {currentUser?.name || 'Dr. Sarah Jenkins'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                {currentUser?.designation || currentUser?.role || 'Administrator'}
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={profileAnchor}
            open={Boolean(profileAnchor)}
            onClose={handleCloseProfile}
            slotProps={{ paper: { sx: { width: 280, borderRadius: 2.5, mt: 1 } } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                  {currentUser?.name || 'Dr. Sarah Jenkins'}
                </Typography>
                <Chip
                  label={currentUser?.role || 'Admin'}
                  size="small"
                  color={
                    currentUser?.role === 'Admin'
                      ? 'primary'
                      : currentUser?.role === 'Teacher'
                      ? 'secondary'
                      : currentUser?.role === 'Student'
                      ? 'info'
                      : 'warning'
                  }
                  sx={{ height: 20, fontSize: '0.675rem', fontWeight: 700 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                {currentUser?.email || 'admin@edumanage.org'}
              </Typography>
            </Box>

            <Divider />

            {/* Quick Role Switcher for Testing */}
            <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.68rem', display: 'block', mb: 0.5 }}>
                SWITCH ROLE (DEMO VIEW)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(['Admin', 'Teacher', 'Student', 'Parent'] as UserRole[]).map((r) => (
                  <Chip
                    key={r}
                    label={r}
                    size="small"
                    clickable
                    color={currentUser?.role === r ? 'primary' : 'default'}
                    variant={currentUser?.role === r ? 'filled' : 'outlined'}
                    onClick={() => {
                      switchRole(r);
                      showToast(`Switched active view to ${r} role`, 'info');
                      handleCloseProfile();
                      navigate('/');
                    }}
                    sx={{ fontSize: '0.7rem', height: 22, fontWeight: 600 }}
                  />
                ))}
              </Box>
            </Box>

            <Divider />

            <MenuItem onClick={() => { handleCloseProfile(); setProfileModalOpen(true); }}>
              <ListItemIcon><User size={18} /></ListItemIcon>
              <ListItemText primary="View My Profile" />
            </MenuItem>

            {currentUser?.role === 'Admin' && (
              <MenuItem onClick={() => { handleCloseProfile(); navigate('/settings'); }}>
                <ListItemIcon><Settings size={18} /></ListItemIcon>
                <ListItemText primary="System Settings" />
              </MenuItem>
            )}

            <MenuItem onClick={() => { handleCloseProfile(); resetAllData(); }}>
              <ListItemIcon><RotateCcw size={18} color="#f59e0b" /></ListItemIcon>
              <ListItemText primary="Reset Dummy Data" secondary="Restore default seed" />
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                handleCloseProfile();
                logout();
                showToast('Signed out successfully', 'info');
                navigate('/login');
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon><LogOut size={18} color="inherit" /></ListItemIcon>
              <ListItemText primary="Sign Out" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* User Profile Modal */}
      <Dialog
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        maxWidth="xs"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>User Profile & Role Scope</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <input
              id="topbar-avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!file.type.startsWith('image/')) {
                  showToast('Please select a valid image file', 'error');
                  return;
                }
                const reader = new FileReader();
                reader.onload = async () => {
                  if (typeof reader.result === 'string') {
                    const res = await updateProfile({ avatar: reader.result });
                    if (res.success) {
                      showToast('Profile image updated successfully!', 'success');
                    } else {
                      showToast('Failed to update image', 'error');
                    }
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={currentUser?.avatar}
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor:
                    currentUser?.role === 'Admin'
                      ? 'primary.main'
                      : currentUser?.role === 'Teacher'
                      ? '#7c3aed'
                      : currentUser?.role === 'Student'
                      ? '#0284c7'
                      : '#d97706',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  mx: 'auto',
                  border: '3px solid',
                  borderColor: 'primary.main',
                  cursor: currentUser?.avatar ? 'default' : 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                onClick={() => {
                  if (!currentUser?.avatar) {
                    document.getElementById('topbar-avatar-upload')?.click();
                  }
                }}
              >
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'U'}
              </Avatar>

              {currentUser?.avatar ? (
                <IconButton
                  size="small"
                  title="Delete Profile Photo"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const res = await updateProfile({ avatar: '' });
                    if (res.success) {
                      showToast('Profile image deleted successfully', 'success');
                    } else {
                      showToast('Failed to delete image', 'error');
                    }
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
                  <Trash2 size={15} />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  title="Upload Photo"
                  onClick={() => document.getElementById('topbar-avatar-upload')?.click()}
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    bgcolor: 'primary.main',
                    color: '#fff',
                    width: 28,
                    height: 28,
                    '&:hover': { bgcolor: 'primary.dark' },
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
                  }}
                >
                  <Camera size={14} />
                </IconButton>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontWeight: 500 }}>
              {currentUser?.avatar ? 'Click delete icon to remove photo' : 'Click camera to upload profile photo'}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {currentUser?.name || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {currentUser?.designation || currentUser?.role || 'Administrator'}
          </Typography>
          <Chip
            label={`${currentUser?.role || 'Admin'} Scope Active`}
            color="success"
            size="small"
            sx={{ mt: 1, mb: 2, fontWeight: 700 }}
          />

          <Box sx={{ textAlign: 'left', mt: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Institution: {settings.schoolName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Official Email: {currentUser?.email || settings.email}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              Active Session: {settings.currentAcademicYear}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
              Assigned Permissions: {currentUser?.role === 'Admin' ? 'All 15 Modules' : `${currentUser?.role} Curated View`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <AppButton variant="contained" onClick={() => setProfileModalOpen(false)}>
            Close
          </AppButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
