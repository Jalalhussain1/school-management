import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  InputBase,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Calendar,
  Layers,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchool } from '../../context/SchoolContext';

export interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { students, teachers, classes, subjects, vehicles } = useSchool();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matches: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      icon: React.ReactNode;
      path: string;
    }> = [];

    // Search students
    students.forEach((s) => {
      if (
        s.fullName.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q)
      ) {
        matches.push({
          id: s.id,
          title: s.fullName,
          subtitle: `${s.className} (${s.section}) • Roll: ${s.rollNo}`,
          category: 'Student',
          icon: <Users size={18} color="#2563eb" />,
          path: '/students',
        });
      }
    });

    // Search teachers
    teachers.forEach((t) => {
      if (
        t.fullName.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.designation.toLowerCase().includes(q)
      ) {
        matches.push({
          id: t.id,
          title: t.fullName,
          subtitle: `${t.designation} • ${t.department}`,
          category: 'Faculty',
          icon: <GraduationCap size={18} color="#10b981" />,
          path: '/teachers',
        });
      }
    });

    // Search classes
    classes.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.classTeacherName.toLowerCase().includes(q)) {
        matches.push({
          id: c.id,
          title: c.name,
          subtitle: `Teacher: ${c.classTeacherName} • ${c.studentCount} Students`,
          category: 'Class',
          icon: <Layers size={18} color="#8b5cf6" />,
          path: '/classes',
        });
      }
    });

    // Search subjects
    subjects.forEach((sub) => {
      if (sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q)) {
        matches.push({
          id: sub.id,
          title: sub.name,
          subtitle: `Code: ${sub.code} • ${sub.department}`,
          category: 'Subject',
          icon: <BookOpen size={18} color="#f59e0b" />,
          path: '/subjects',
        });
      }
    });

    // Search transport
    vehicles.forEach((v) => {
      if (v.vehicleNumber.toLowerCase().includes(q) || v.routeName.toLowerCase().includes(q)) {
        matches.push({
          id: v.id,
          title: v.vehicleNumber,
          subtitle: `${v.routeName} • Driver: ${v.driverName}`,
          category: 'Transport',
          icon: <Truck size={18} color="#06b6d4" />,
          path: '/transport',
        });
      }
    });

    return matches.slice(0, 8);
  }, [query, students, teachers, classes, subjects, vehicles]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  const quickNavItems = [
    { label: 'Student Directory', path: '/students', icon: <Users size={16} /> },
    { label: 'Daily Attendance', path: '/attendance', icon: <Calendar size={16} /> },
    { label: 'Fee Management', path: '/fees', icon: <DollarSign size={16} /> },
    { label: 'Examinations', path: '/examinations', icon: <GraduationCap size={16} /> },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          overflow: 'hidden',
          top: '-15%',
        },
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2.5,
            py: 1.75,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Search size={20} style={{ opacity: 0.6, marginRight: 12 }} />
          <InputBase
            autoFocus
            placeholder="Search students, faculty, classes, subjects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            sx={{ fontSize: '1rem', fontWeight: 500 }}
          />
          <Typography
            variant="caption"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              color: 'text.secondary',
              fontSize: '0.7rem',
            }}
          >
            ESC
          </Typography>
        </Box>

        {query.trim() === '' ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, px: 1, mb: 1, display: 'block' }}>
              QUICK ACCESS MODULES
            </Typography>
            <List dense sx={{ py: 0 }}>
              {quickNavItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { sx: { fontSize: '0.875rem', fontWeight: 500 } } }}
                  />
                  <ArrowRight size={14} style={{ opacity: 0.5 }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        ) : results.length > 0 ? (
          <List sx={{ py: 1, maxHeight: 380, overflowY: 'auto' }}>
            {results.map((res) => (
              <ListItemButton
                key={res.id}
                onClick={() => handleSelect(res.path)}
                sx={{ px: 2.5, py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {res.icon}
                </ListItemIcon>
                <ListItemText
                  primary={res.title}
                  secondary={res.subtitle}
                  slotProps={{
                    primary: { sx: { fontSize: '0.9rem', fontWeight: 600 } },
                    secondary: { sx: { fontSize: '0.775rem' } },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: 'action.hover',
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {res.category}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No results found for "<strong>{query}</strong>"
            </Typography>
          </Box>
        )}

        <Divider />
        <Box sx={{ p: 1.5, px: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Use global search to jump directly to any student record or system tool
          </Typography>
          <Typography variant="caption" color="text.secondary">
            EduManage v2.4
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
