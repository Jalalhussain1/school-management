import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Users,
  DoorOpen,
  UserCheck,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppButton } from '../../components/common/AppButton';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { ClassModal } from './ClassModal';
import { SchoolClass } from '../../types';

export const ClassesPage: React.FC = () => {
  const { classes, deleteClass, students } = useSchool();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SchoolClass | null>(null);

  // Roster modal
  const [rosterClass, setRosterClass] = useState<SchoolClass | null>(null);

  const handleOpenAdd = () => {
    setSelectedClass(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: SchoolClass) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (cls: SchoolClass) => {
    setDeleteTarget(cls);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteClass(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const rosterStudents = rosterClass
    ? students.filter((s) => s.classId === rosterClass.id || s.className === rosterClass.name)
    : [];

  return (
    <Box>
      <AppPageTitle
        title="Classes & Sections"
        subtitle={`Total active classes: ${classes.length} | Section allotments, classroom allocations, and class educators`}
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Classes' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Create New Class
          </AppButton>
        }
      />

      {/* Grid of Class Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2.5,
        }}
      >
        {classes.map((cls) => {
          // Dynamic student count based on enrolled students
          const matchingEnrolled = students.filter(
            (s) => s.classId === cls.id || s.className === cls.name
          ).length;
          const currentCount = cls.studentCount || matchingEnrolled || 25;
          const capacityPercent = Math.min(100, Math.round((currentCount / cls.capacity) * 100));

          return (
            <Card
              key={cls.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(0,0,0,0.4)'
                      : '0 8px 20px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {cls.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', mt: 0.5 }}>
                      <DoorOpen size={15} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {cls.roomNumber}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Class">
                      <IconButton size="small" onClick={() => handleOpenEdit(cls)}>
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Class">
                      <IconButton size="small" onClick={() => handleOpenDelete(cls)} sx={{ color: 'error.main' }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Class Teacher */}
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                    Class Incharge Teacher:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <UserCheck size={16} color="#2563eb" /> {cls.classTeacherName}
                  </Typography>
                </Box>

                {/* Sections */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                    Allocated Sections:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {cls.sections.map((sec) => (
                      <Chip
                        key={sec}
                        label={`Section ${sec}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.725rem' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Capacity Progress */}
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Enrolled: <strong>{currentCount} students</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: capacityPercent >= 90 ? 'warning.main' : 'text.primary' }}>
                      {capacityPercent}% capacity ({cls.capacity} max)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={capacityPercent}
                    sx={{
                      height: 7,
                      borderRadius: 4,
                      bgcolor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: capacityPercent >= 90 ? 'warning.main' : 'primary.main',
                      },
                    }}
                  />
                </Box>
              </CardContent>

              {/* Card Footer */}
              <Box
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fbfcfd',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <AppButton
                  size="small"
                  variant="outlined"
                  icon={<Users size={14} />}
                  onClick={() => setRosterClass(cls)}
                  sx={{ fontSize: '0.75rem', px: 1.5 }}
                >
                  View Student Roster
                </AppButton>
                <Chip
                  label={`Grade ${cls.numericGrade}`}
                  size="small"
                  sx={{ height: 20, fontSize: '0.675rem', fontWeight: 600 }}
                />
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Class Student Roster Modal */}
      <Dialog
        open={Boolean(rosterClass)}
        onClose={() => setRosterClass(null)}
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {rosterClass?.name} Student Roster
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Head Teacher: {rosterClass?.classTeacherName} • Room: {rosterClass?.roomNumber}
            </Typography>
          </Box>
          <Chip label={`${rosterStudents.length} Enrolled`} size="small" color="primary" sx={{ fontWeight: 700 }} />
        </DialogTitle>

        <DialogContent sx={{ p: 2 }}>
          {rosterStudents.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No students currently enrolled in {rosterClass?.name}.
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {rosterStudents.map((std) => (
                <ListItem
                  key={std.id}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={std.avatar} sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontWeight: 700 }}>
                      {std.firstName[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {std.fullName}
                      </Typography>
                    }
                    secondary={`Adm: ${std.admissionNo} • Roll: ${std.rollNo} • Section ${std.section}`}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {std.attendanceRate ?? 95}% Att.
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <AppButton variant="contained" onClick={() => setRosterClass(null)}>
            Close Roster
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* Class Modal */}
      <ClassModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        schoolClass={selectedClass}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name}
        title="Delete Class"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Make sure no students are left unassigned.`}
      />
    </Box>
  );
};
