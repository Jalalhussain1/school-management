import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Award,
  Calendar,
  FileText,
  Library,
  Truck,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { hasRolePermission } from '../../types/auth';

export interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface SidebarMenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface SidebarSection {
  title: string;
  items: SidebarMenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { students, teachers, feeVouchers } = useSchool();
  const { currentUser } = useAuth();

  const currentRole = currentUser?.role || 'Admin';
  const overdueFeeCount = feeVouchers.filter((v) => v.status === 'Overdue').length;

  const rawMenuSections: SidebarSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
      ],
    },
    {
      title: 'ACADEMICS',
      items: [
        { label: 'Students', path: '/students', icon: <Users size={20} />, badge: `${students.length}` },
        { label: 'Teachers & Staff', path: '/teachers', icon: <GraduationCap size={20} />, badge: `${teachers.length}` },
        { label: 'Classes & Sections', path: '/classes', icon: <Layers size={20} /> },
        { label: 'Subjects', path: '/subjects', icon: <BookOpen size={20} /> },
        { label: 'Timetable', path: '/timetable', icon: <Calendar size={20} /> },
        { label: 'Homework', path: '/homework', icon: <FileText size={20} /> },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Attendance', path: '/attendance', icon: <CalendarCheck size={20} /> },
        {
          label: 'Fee Management',
          path: '/fees',
          icon: <CreditCard size={20} />,
          badge: overdueFeeCount > 0 ? `${overdueFeeCount} Due` : undefined,
          badgeColor: 'error',
        },
        { label: 'Examinations', path: '/examinations', icon: <Award size={20} /> },
      ],
    },
    {
      title: 'CAMPUS & SERVICES',
      items: [
        { label: 'Library', path: '/library', icon: <Library size={20} /> },
        { label: 'Transport', path: '/transport', icon: <Truck size={20} /> },
        { label: 'Announcements', path: '/announcements', icon: <Megaphone size={20} /> },
      ],
    },
    {
      title: 'ANALYTICS & SETTINGS',
      items: [
        { label: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
        { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
      ],
    },
  ];

  // Filter sections and items strictly based on the logged-in role
  const menuSections = rawMenuSections
    .map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => hasRolePermission(currentRole, item.path)),
    }))
    .filter((sec) => sec.items.length > 0);


  const handleNav = (path: string) => {
    navigate(path);
    if (isMobile) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#0e1626' : '#ffffff',
        borderRight: 1,
        borderColor: 'divider',
        userSelect: 'none',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2.5 : 1,
          py: 2.2,
          minHeight: 64,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box
          onClick={() => handleNav('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </Box>
          {open && (
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)'
                      : 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                EduManage
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', fontWeight: 600 }}>
                ACADEMIC SUITE
              </Typography>
            </Box>
          )}
        </Box>

        {!isMobile && open && (
          <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
            <ChevronLeft size={18} />
          </IconButton>
        )}
      </Box>

      {/* Nav List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: open ? 1.5 : 1, py: 2 }}>
        {menuSections.map((sec, idx) => (
          <Box key={sec.title} sx={{ mb: 2 }}>
            {open && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                  px: 1.5,
                  mb: 0.75,
                  display: 'block',
                  fontSize: '0.675rem',
                  letterSpacing: '0.06em',
                }}
              >
                {sec.title}
              </Typography>
            )}

            <List dense disablePadding>
              {sec.items.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                const button = (
                  <ListItemButton
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      py: 0.9,
                      px: open ? 1.5 : 1.25,
                      justifyContent: open ? 'flex-start' : 'center',
                      backgroundColor: isActive
                        ? (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(37, 99, 235, 0.2)'
                              : 'rgba(37, 99, 235, 0.08)'
                        : 'transparent',
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: isActive ? 600 : 500,
                      borderLeft: isActive ? '3px solid' : '3px solid transparent',
                      borderColor: isActive ? 'primary.main' : 'transparent',
                      '&:hover': {
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.03)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: open ? 32 : 'auto',
                        color: isActive ? 'primary.main' : 'text.secondary',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {open && (
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: '0.85rem',
                              fontWeight: isActive ? 700 : 500,
                            },
                          },
                        }}
                      />
                    )}

                    {open && item.badge && (
                      <Chip
                        label={item.badge}
                        size="small"
                        color={item.badgeColor || 'default'}
                        sx={{
                          height: 18,
                          fontSize: '0.675rem',
                          fontWeight: 700,
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                );

                return !open ? (
                  <Tooltip key={item.path} title={item.label} placement="right" arrow>
                    {button}
                  </Tooltip>
                ) : (
                  button
                );
              })}
            </List>

            {idx < menuSections.length - 1 && open && (
              <Divider sx={{ my: 1.5, opacity: 0.6 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* Collapse Toggle for Compact Mode */}
      {!isMobile && !open && (
        <Box sx={{ p: 1, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
          <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
            <ChevronRight size={18} />
          </IconButton>
        </Box>
      )}

      {/* Footer User Info snippet in full mode */}
      {open && currentUser && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {currentUser.avatar ? (
              <Box
                component="img"
                src={currentUser.avatar}
                alt={currentUser.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'EM'
            )}
          </Box>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
              {currentUser.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.72rem' }}>
              {currentUser.designation || currentUser.role}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 270, boxSizing: 'border-box' },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        width: open ? 260 : 72,
        flexShrink: 0,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: open ? 260 : 72,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        {sidebarContent}
      </Box>
    </Box>
  );
};
