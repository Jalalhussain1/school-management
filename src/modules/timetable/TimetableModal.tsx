import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { TimetableSlot, DayOfWeek } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface TimetableModalProps {
  open: boolean;
  onClose: () => void;
  slot?: TimetableSlot | null;
}

export const TimetableModal: React.FC<TimetableModalProps> = ({ open, onClose, slot }) => {
  const { addTimetableSlot, updateTimetableSlot, teachers, subjects, classes } = useSchool();
  const isEditing = Boolean(slot);

  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday' as DayOfWeek,
    periodNumber: 1,
    startTime: '08:30 AM',
    endTime: '09:20 AM',
    classId: 'cls-10',
    className: 'Grade 10',
    section: 'A',
    subjectCode: 'MTH-101',
    subjectName: 'Mathematics',
    teacherId: '',
    teacherName: '',
    roomNumber: 'Room 301',
  });

  useEffect(() => {
    if (slot) {
      setFormData({
        dayOfWeek: slot.dayOfWeek,
        periodNumber: slot.periodNumber,
        startTime: slot.startTime,
        endTime: slot.endTime,
        classId: slot.classId,
        className: slot.className,
        section: slot.section,
        subjectCode: slot.subjectCode,
        subjectName: slot.subjectName,
        teacherId: slot.teacherId,
        teacherName: slot.teacherName,
        roomNumber: slot.roomNumber,
      });
    } else {
      setFormData({
        dayOfWeek: 'Monday',
        periodNumber: 1,
        startTime: '08:30 AM',
        endTime: '09:20 AM',
        classId: classes[0]?.id || 'cls-10',
        className: classes[0]?.name || 'Grade 10',
        section: 'A',
        subjectCode: subjects[0]?.code || 'MTH-101',
        subjectName: subjects[0]?.name || 'Mathematics',
        teacherId: teachers[0]?.id || '',
        teacherName: teachers[0]?.fullName || '',
        roomNumber: 'Room 301',
      });
    }
  }, [slot, open, classes, subjects, teachers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classObj = classes.find((c) => c.id === formData.classId);
    const className = classObj ? classObj.name : formData.className;

    const teacherObj = teachers.find((t) => t.id === formData.teacherId);
    const teacherName = teacherObj ? teacherObj.fullName : formData.teacherName;

    const subjObj = subjects.find((s) => s.code === formData.subjectCode);
    const subjectName = subjObj ? subjObj.name : formData.subjectName;

    if (isEditing && slot) {
      updateTimetableSlot(slot.id, {
        ...formData,
        className,
        teacherName,
        subjectName,
      });
    } else {
      addTimetableSlot({
        ...formData,
        className,
        teacherName,
        subjectName,
      });
    }
    onClose();
  };

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }));
  const teacherOptions = teachers.map((t) => ({ value: t.id, label: t.fullName }));
  const subjectOptions = subjects.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Period Slot' : 'Add Timetable Period'}
      subtitle="Schedule class subject, instructor, and room allocation"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Schedule Period'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Day of Week"
            value={formData.dayOfWeek}
            onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as DayOfWeek })}
            options={[
              { value: 'Monday', label: 'Monday' },
              { value: 'Tuesday', label: 'Tuesday' },
              { value: 'Wednesday', label: 'Wednesday' },
              { value: 'Thursday', label: 'Thursday' },
              { value: 'Friday', label: 'Friday' },
            ]}
          />

          <AppInput
            label="Period Number (1-6)"
            type="number"
            value={formData.periodNumber}
            onChange={(e) => setFormData({ ...formData, periodNumber: Number(e.target.value) })}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Start Time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            placeholder="08:30 AM"
          />

          <AppInput
            label="End Time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            placeholder="09:20 AM"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Class / Grade"
            value={formData.classId}
            onChange={(e) => setFormData({ ...formData, classId: e.target.value as string })}
            options={classOptions}
          />

          <AppDropdown
            label="Section"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value as string })}
            options={[
              { value: 'A', label: 'Section A' },
              { value: 'B', label: 'Section B' },
              { value: 'C', label: 'Section C' },
            ]}
          />
        </Box>

        <AppDropdown
          label="Subject"
          value={formData.subjectCode}
          onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value as string })}
          options={subjectOptions}
        />

        <AppDropdown
          label="Instructor / Teacher"
          value={formData.teacherId}
          onChange={(e) => setFormData({ ...formData, teacherId: e.target.value as string })}
          options={teacherOptions}
        />

        <AppInput
          label="Classroom / Lab Number"
          value={formData.roomNumber}
          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
          placeholder="e.g. Room 301 or Lab 2"
        />
      </Box>
    </AppModal>
  );
};
