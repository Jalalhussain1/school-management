import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  UserCheck,
  Shield,
  Edit,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { AppModal } from '../../components/common/AppModal';
import { AppButton } from '../../components/common/AppButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Student } from '../../types';
import { formatDate, formatCurrency } from '../../utils/formatters';

export interface StudentDetailModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  open,
  onClose,
  student,
  onEdit,
}) => {
  if (!student) return null;

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Student Profile Dossier"
      subtitle={`Admission ID: ${student.admissionNo}`}
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
              onEdit(student);
            }}
          >
            Edit Student
          </AppButton>
        </>
      }
    >
      {/* Header Profile Summary */}
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
          src={student.avatar}
          sx={{
            width: 84,
            height: 84,
            bgcolor: 'primary.main',
            fontSize: '2rem',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
          }}
        >
          {student.firstName[0]}
        </Avatar>

        <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {student.fullName}
            </Typography>
            <StatusBadge status={student.status} />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {student.className} • Section {student.section} • Roll Number: <strong>{student.rollNo}</strong>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
            <Chip
              icon={<TrendingUp size={14} style={{ marginLeft: 6 }} />}
              label={`Attendance: ${student.attendanceRate ?? 96.5}%`}
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<DollarSign size={14} style={{ marginLeft: 6 }} />}
              label={`Fee Balance: ${formatCurrency(student.totalFeeDue ?? 0)}`}
              size="small"
              color={student.totalFeeDue && student.totalFeeDue > 0 ? 'warning' : 'default'}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<Calendar size={14} style={{ marginLeft: 6 }} />}
              label={`Enrolled: ${formatDate(student.admissionDate)}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      {/* Grid of Details */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Personal Details */}
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <UserCheck size={18} /> Personal Information
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1.5, fontSize: '0.875rem' }}>
            <Typography color="text.secondary">Gender:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{student.gender}</Typography>

            <Typography color="text.secondary">Date of Birth:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{formatDate(student.dateOfBirth)}</Typography>

            <Typography color="text.secondary">Blood Group:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{student.bloodGroup}</Typography>

            <Typography color="text.secondary">Email:</Typography>
            <Typography sx={{ fontWeight: 500 }}>{student.email || 'N/A'}</Typography>

            <Typography color="text.secondary">Phone:</Typography>
            <Typography sx={{ fontWeight: 500 }}>{student.phone || 'N/A'}</Typography>

            <Typography color="text.secondary">Address:</Typography>
            <Typography sx={{ fontWeight: 500 }}>{student.address || 'Not specified'}</Typography>
          </Box>
        </Paper>

        {/* Parent & Emergency Contacts */}
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
            <Shield size={18} /> Parent & Guardian Record
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1.5, fontSize: '0.875rem' }}>
            <Typography color="text.secondary">Guardian:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{student.parentName}</Typography>

            <Typography color="text.secondary">Relationship:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{student.parentRelation}</Typography>

            <Typography color="text.secondary">Guardian Phone:</Typography>
            <Typography sx={{ fontWeight: 600 }}>{student.parentPhone}</Typography>

            <Typography color="text.secondary">Guardian Email:</Typography>
            <Typography sx={{ fontWeight: 500 }}>{student.parentEmail || 'N/A'}</Typography>

            <Typography color="text.secondary">Emergency Call:</Typography>
            <Typography sx={{ fontWeight: 600, color: 'error.main' }}>
              {student.emergencyContact || student.parentPhone}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </AppModal>
  );
};
