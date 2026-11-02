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
  Mail,
  CheckCircle,
  Clock,
  Key,
  Send,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
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
  const { inviteTeacher } = useSchool();
  const [inviting, setInviting] = React.useState(false);

  if (!teacher) return null;

  const handleSendInvite = async () => {
    setInviting(true);
    try {
      await inviteTeacher(teacher.id);
    } finally {
      setInviting(false);
    }
  };

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

      {/* Staff Portal Account & Security Access */}
      <Paper
        variant="outlined"
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: 2.5,
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Key size={22} color="#7c3aed" />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Faculty Portal Account Access
              </Typography>
              {teacher.portalStatus === 'Active' ? (
                <Chip icon={<CheckCircle size={14} style={{ marginLeft: 6 }} />} label="Account Active" size="small" color="success" sx={{ fontWeight: 700 }} />
              ) : teacher.portalStatus === 'Pending' ? (
                <Chip icon={<Clock size={14} style={{ marginLeft: 6 }} />} label="Invitation Sent (Pending Setup)" size="small" color="warning" sx={{ fontWeight: 700 }} />
              ) : (
                <Chip label="Not Invited" size="small" sx={{ fontWeight: 600 }} />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Official faculty email: <strong>{teacher.email || 'None'}</strong> — Instructors use this account to mark attendance, assign homework, and post exam results.
            </Typography>
          </Box>
        </Box>

        {teacher.email && teacher.portalStatus !== 'Active' && (
          <AppButton
            variant="contained"
            color="secondary"
            size="small"
            loading={inviting}
            icon={<Send size={15} />}
            onClick={handleSendInvite}
          >
            {teacher.portalStatus === 'Pending' ? 'Resend Portal Invite' : 'Send Portal Invite Email'}
          </AppButton>
        )}
      </Paper>
    </AppModal>
  );
};
