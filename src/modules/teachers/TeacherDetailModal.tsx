import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  GraduationCap,
  Calendar,
  Briefcase,
  DollarSign,
  Edit,
  BookOpen,
} from 'lucide-react';
import { AppModal } from '../../components/common/AppModal';
import { AppButton } from '../../components/common/AppButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Teacher } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';

export interface TeacherDetailModalProps {
  open: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onEdit: (teacher: Teacher) => void;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  open,
  onClose,
  teacher,
  onEdit,
}) => {
  if (!teacher) return null;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Faculty Member Dossier"
      subtitle={`Employee ID: ${teacher.employeeId}`}
      maxWidth="md"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Close
          </AppButton>
          <AppButton
            variant="contained"
            color="primary"
            icon={<Edit size={16} />}
            onClick={() => {
              onClose();
              onEdit(teacher);
            }}
          >
            Edit Record
          </AppButton>
        </>
      }
    >
      {/* Header Profile */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 3,
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'action.hover',
          mb: 3,
        }}
      >
        <Avatar
          src={teacher.avatar}
          sx={{
            width: 84,
            height: 84,
            bgcolor: 'secondary.main',
            fontSize: '2rem',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}
        >
          {teacher.firstName[0]}
        </Avatar>

        <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {teacher.fullName}
            </Typography>
            <StatusBadge status={teacher.status} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {teacher.designation} • Department of {teacher.department}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Chip
              icon={<Calendar size={14} style={{ marginLeft: 6 }} />}
              label={`Joined: ${formatDate(teacher.joiningDate)}`}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<DollarSign size={14} style={{ marginLeft: 6 }} />}
              label={`Annual: ${formatCurrency(teacher.salary)}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Details Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <Briefcase size={18} /> Professional Details
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1.5, fontSize: '0.875rem' }}>
            <Typography color="text.secondary">Designation:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{teacher.designation}</Typography>

            <Typography color="text.secondary">Department:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{teacher.department}</Typography>

            <Typography color="text.secondary">Qualification:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{teacher.qualification}</Typography>

            <Typography color="text.secondary">Email:</Typography>
            <Typography sx={{ fontWeight: 500 }}>{teacher.email}</Typography>

            <Typography color="text.secondary">Phone:</Typography>
            <Typography sx={{ fontWeight: 500 }}>{teacher.phone}</Typography>

            <Typography color="text.secondary">Address:</Typography>
            <Typography sx={{ fontWeight: 500 }}>{teacher.address || 'Campus Staff Quarters'}</Typography>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
            <BookOpen size={18} /> Assigned Academic Subjects
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {teacher.subjects.map((sub, i) => (
              <Chip key={i} label={sub} color="primary" variant="filled" sx={{ fontWeight: 600 }} />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Faculty member has active teaching schedules across high school semesters.
          </Typography>
        </Paper>
      </Box>
    </AppModal>
  );
};
