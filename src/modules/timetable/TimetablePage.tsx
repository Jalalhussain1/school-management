import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Calendar,
  Plus,
  Clock,
  DoorOpen,
  User,
  Edit,
  Trash2,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { TimetableModal } from './TimetableModal';
import { TimetableSlot, DayOfWeek } from '../../types';

export const TimetablePage: React.FC = () => {
  const { timetableSlots, deleteTimetableSlot, classes, teachers } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState('cls-10');
  const [selectedSection, setSelectedSection] = useState('A');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TimetableSlot | null>(null);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [1, 2, 3, 4, 5, 6];

  const filteredSlots = useMemo(() => {
    return timetableSlots.filter(
      (s) => s.classId === selectedClassId && (s.section === selectedSection || !s.section)
    );
  }, [timetableSlots, selectedClassId, selectedSection]);

  const handleOpenAdd = () => {
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: TimetableSlot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (slot: TimetableSlot) => {
    setDeleteTarget(slot);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTimetableSlot(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }));

  const periodTimeLabels: Record<number, string> = {
    1: '08:30 - 09:20',
    2: '09:25 - 10:15',
    3: '10:30 - 11:20',
    4: '11:25 - 12:15',
    5: '01:00 - 01:50',
    6: '01:55 - 02:45',
  };

  return (
    <Box>
      <AppPageTitle
        title="Weekly Academic Timetable"
        subtitle="Manage master period schedules, teacher lesson times, and room allocations"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Timetable' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Add Period Slot
          </AppButton>
        }
      />

      {/* Filter Selector */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <AppDropdown
              label="Select Grade / Class"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value as string)}
              options={classOptions}
              sx={{ width: 180 }}
            />

            <AppDropdown
              label="Section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as string)}
              options={[
                { value: 'A', label: 'Section A' },
                { value: 'B', label: 'Section B' },
                { value: 'C', label: 'Section C' },
              ]}
              sx={{ width: 140 }}
            />

            <Chip
              label="5 Days • 6 Periods per Day"
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.75rem', ml: 'auto' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Timetable Weekly Grid */}
      <Box sx={{ overflowX: 'auto', pb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '120px repeat(5, minmax(190px, 1fr))',
            gap: 1.5,
            minWidth: 1050,
          }}
        >
          {/* Header Row */}
          <Box sx={{ p: 1.5, textAlign: 'center', fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>
            PERIOD / TIME
          </Box>
          {days.map((day) => (
            <Card
              key={day}
              sx={{
                p: 1.5,
                textAlign: 'center',
                bgcolor: 'action.hover',
                fontWeight: 800,
                fontSize: '0.875rem',
              }}
            >
              {day}
            </Card>
          ))}

          {/* Period Rows */}
          {periods.map((periodNum) => (
            <React.Fragment key={periodNum}>
              {/* Time Label Column */}
              <Card
                sx={{
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  Period {periodNum}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {periodTimeLabels[periodNum]}
                </Typography>
              </Card>

              {/* Day slots */}
              {days.map((day) => {
                const slot = filteredSlots.find(
                  (s) => s.dayOfWeek === day && s.periodNumber === periodNum
                );

                if (!slot) {
                  return (
                    <Card
                      key={`${day}-${periodNum}`}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderStyle: 'dashed',
                        bgcolor: 'transparent',
                        opacity: 0.6,
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <AppButton
                        size="small"
                        variant="text"
                        onClick={handleOpenAdd}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        + Free Slot
                      </AppButton>
                    </Card>
                  );
                }

                return (
                  <Card
                    key={slot.id}
                    sx={{
                      p: 1.75,
                      borderLeft: '4px solid',
                      borderColor:
                        slot.subjectCode.startsWith('MTH')
                          ? '#2563eb'
                          : slot.subjectCode.startsWith('PHY')
                          ? '#10b981'
                          : slot.subjectCode.startsWith('ENG')
                          ? '#f59e0b'
                          : slot.subjectCode.startsWith('HST')
                          ? '#8b5cf6'
                          : '#06b6d4',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.15s ease',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                  >
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Chip
                          label={slot.subjectCode}
                          size="small"
                          sx={{ height: 20, fontSize: '0.675rem', fontWeight: 800 }}
                        />
                        <Box sx={{ display: 'flex', gap: 0.25 }}>
                          <Tooltip title="Edit Period">
                            <IconButton size="small" onClick={() => handleOpenEdit(slot)} sx={{ p: 0.25 }}>
                              <Edit size={13} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Period">
                            <IconButton size="small" onClick={() => handleOpenDelete(slot)} sx={{ p: 0.25, color: 'error.main' }}>
                              <Trash2 size={13} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.25, mb: 1 }}>
                        {slot.subjectName}
                      </Typography>
                    </Box>

                    <Box sx={{ pt: 1, borderTop: 1, borderColor: 'divider', fontSize: '0.725rem', color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                        <User size={12} />
                        <Typography variant="caption" sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
                          {slot.teacherName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DoorOpen size={12} />
                        <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                          {slot.roomNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                );
              })}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      {/* Modals */}
      <TimetableModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slot={selectedSlot}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={`${deleteTarget?.subjectName} (${deleteTarget?.dayOfWeek} P${deleteTarget?.periodNumber})`}
        title="Delete Timetable Period"
      />
    </Box>
  );
};
