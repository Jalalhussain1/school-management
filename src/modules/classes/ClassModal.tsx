import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { SchoolClass } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface ClassModalProps {
  open: boolean;
  onClose: () => void;
  schoolClass?: SchoolClass | null;
}

export const ClassModal: React.FC<ClassModalProps> = ({ open, onClose, schoolClass }) => {
  const { addClass, updateClass, teachers } = useSchool();
  const isEditing = Boolean(schoolClass);

  const [formData, setFormData] = useState({
    name: '',
    numericGrade: 10,
    sections: 'A, B',
    classTeacherId: '',
    roomNumber: 'Room 301',
    capacity: 60,
    studentCount: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (schoolClass) {
      setFormData({
        name: schoolClass.name,
        numericGrade: schoolClass.numericGrade,
        sections: schoolClass.sections.join(', '),
        classTeacherId: schoolClass.classTeacherId,
        roomNumber: schoolClass.roomNumber,
        capacity: schoolClass.capacity,
        studentCount: schoolClass.studentCount,
      });
    } else {
      setFormData({
        name: 'Grade 7',
        numericGrade: 7,
        sections: 'A, B',
        classTeacherId: teachers[0]?.id || '',
        roomNumber: 'Room 105',
        capacity: 60,
        studentCount: 0,
      });
    }
    setErrors({});
  }, [schoolClass, open, teachers]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Class name is required';
    if (!formData.roomNumber.trim()) errs.roomNumber = 'Room number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const sectionsArr = formData.sections
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const teacherObj = teachers.find((t) => t.id === formData.classTeacherId);
    const classTeacherName = teacherObj ? teacherObj.fullName : 'Unassigned';

    if (isEditing && schoolClass) {
      updateClass(schoolClass.id, {
        ...formData,
        sections: sectionsArr,
        classTeacherName,
      });
    } else {
      addClass({
        ...formData,
        sections: sectionsArr,
        classTeacherName,
      });
    }
    onClose();
  };

  const teacherOptions = teachers.map((t) => ({ value: t.id, label: `${t.fullName} (${t.department})` }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Class: ${schoolClass?.name}` : 'Create New Class'}
      subtitle="Define grade level, sections, room, and assigned head class educator"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Create Class'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AppInput
          label="Class / Grade Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Grade 10 or Senior High"
          error={Boolean(errors.name)}
          helperText={errors.name}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Numeric Grade Level"
            type="number"
            value={formData.numericGrade}
            onChange={(e) => setFormData({ ...formData, numericGrade: Number(e.target.value) })}
          />
          <AppInput
            label="Room Number"
            required
            value={formData.roomNumber}
            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            placeholder="e.g. Room 301 or Science Wing 2"
          />
        </Box>

        <AppInput
          label="Sections (comma-separated)"
          value={formData.sections}
          onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
          placeholder="e.g. A, B, C"
          helperText="Sections assigned to this academic grade"
        />

        <AppDropdown
          label="Assigned Class Teacher"
          value={formData.classTeacherId}
          onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value as string })}
          options={teacherOptions}
        />

        <AppInput
          label="Maximum Student Capacity"
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
        />
      </Box>
    </AppModal>
  );
};
