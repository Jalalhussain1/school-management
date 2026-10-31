import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Subject } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface SubjectModalProps {
  open: boolean;
  onClose: () => void;
  subject?: Subject | null;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({ open, onClose, subject }) => {
  const { addSubject, updateSubject, teachers, classes } = useSchool();
  const isEditing = Boolean(subject);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'Mathematics',
    type: 'Core' as 'Core' | 'Elective',
    weeklyHours: 4,
    assignedTeacherId: '',
    assignedClassId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subject) {
      setFormData({
        code: subject.code,
        name: subject.name,
        department: subject.department,
        type: subject.type,
        weeklyHours: subject.weeklyHours,
        assignedTeacherId: subject.assignedTeacherIds[0] || '',
        assignedClassId: subject.assignedClassIds[0] || '',
      });
    } else {
      setFormData({
        code: `SUB-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        department: 'Mathematics',
        type: 'Core',
        weeklyHours: 4,
        assignedTeacherId: teachers[0]?.id || '',
        assignedClassId: classes[0]?.id || '',
      });
    }
    setErrors({});
  }, [subject, open, teachers, classes]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Subject name is required';
    if (!formData.code.trim()) errs.code = 'Subject code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && subject) {
      updateSubject(subject.id, {
        code: formData.code,
        name: formData.name,
        department: formData.department,
        type: formData.type,
        weeklyHours: formData.weeklyHours,
        assignedTeacherIds: formData.assignedTeacherId ? [formData.assignedTeacherId] : subject.assignedTeacherIds,
        assignedClassIds: formData.assignedClassId ? [formData.assignedClassId] : subject.assignedClassIds,
      });
    } else {
      addSubject({
        code: formData.code,
        name: formData.name,
        department: formData.department,
        type: formData.type,
        weeklyHours: formData.weeklyHours,
        assignedTeacherIds: formData.assignedTeacherId ? [formData.assignedTeacherId] : [],
        assignedClassIds: formData.assignedClassId ? [formData.assignedClassId] : [],
      });
    }
    onClose();
  };

  const teacherOptions = teachers.map((t) => ({ value: t.id, label: `${t.fullName} (${t.department})` }));
  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Subject: ${subject?.name}` : 'Add Curriculum Subject'}
      subtitle="Define academic course code, credit periods, and teacher assignment"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Subject'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
          <AppInput
            label="Subject Code"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g. MTH-101"
            error={Boolean(errors.code)}
            helperText={errors.code}
          />
          <AppInput
            label="Subject Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Advanced Calculus & Trigonometry"
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value as string })}
            options={[
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'Science & Physics', label: 'Science & Physics' },
              { value: 'Chemistry & Biology', label: 'Chemistry & Biology' },
              { value: 'English Literature', label: 'English Literature' },
              { value: 'Social Studies & History', label: 'Social Studies & History' },
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Fine Arts & Music', label: 'Fine Arts & Music' },
              { value: 'Physical Education', label: 'Physical Education' },
            ]}
          />

          <AppDropdown
            label="Course Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Core' | 'Elective' })}
            options={[
              { value: 'Core', label: 'Core Required Course' },
              { value: 'Elective', label: 'Elective / Optional' },
            ]}
          />
        </Box>

        <AppInput
          label="Weekly Period Hours"
          type="number"
          value={formData.weeklyHours}
          onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
        />

        <AppDropdown
          label="Primary Assigned Teacher"
          value={formData.assignedTeacherId}
          onChange={(e) => setFormData({ ...formData, assignedTeacherId: e.target.value as string })}
          options={teacherOptions}
        />

        <AppDropdown
          label="Assigned Grade / Class"
          value={formData.assignedClassId}
          onChange={(e) => setFormData({ ...formData, assignedClassId: e.target.value as string })}
          options={classOptions}
        />
      </Box>
    </AppModal>
  );
};
