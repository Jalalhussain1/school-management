import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Homework, HomeworkStatus } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface HomeworkModalProps {
  open: boolean;
  onClose: () => void;
  homework?: Homework | null;
}

export const HomeworkModal: React.FC<HomeworkModalProps> = ({ open, onClose, homework }) => {
  const { addHomework, updateHomework, classes, subjects, teachers } = useSchool();
  const isEditing = Boolean(homework);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classId: 'cls-10',
    className: 'Grade 10',
    section: 'A',
    subjectName: 'Advanced Mathematics',
    teacherName: 'Eleanor Patterson',
    assignedDate: '2026-10-20',
    dueDate: '2026-10-27',
    totalSubmissions: 0,
    maxSubmissions: 30,
    status: 'Active' as HomeworkStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (homework) {
      setFormData({
        title: homework.title,
        description: homework.description,
        classId: homework.classId,
        className: homework.className,
        section: homework.section,
        subjectName: homework.subjectName,
        teacherName: homework.teacherName,
        assignedDate: homework.assignedDate,
        dueDate: homework.dueDate,
        totalSubmissions: homework.totalSubmissions,
        maxSubmissions: homework.maxSubmissions,
        status: homework.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        classId: classes[0]?.id || 'cls-10',
        className: classes[0]?.name || 'Grade 10',
        section: 'A',
        subjectName: subjects[0]?.name || 'Mathematics',
        teacherName: teachers[0]?.fullName || 'Faculty',
        assignedDate: new Date().toISOString().split('T')[0],
        dueDate: '2026-11-01',
        totalSubmissions: 0,
        maxSubmissions: 30,
        status: 'Active',
      });
    }
    setErrors({});
  }, [homework, open, classes, subjects, teachers]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Assignment title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const classObj = classes.find((c) => c.id === formData.classId);
    const className = classObj ? classObj.name : formData.className;

    if (isEditing && homework) {
      updateHomework(homework.id, {
        ...formData,
        className,
      });
    } else {
      addHomework({
        ...formData,
        className,
      });
    }
    onClose();
  };

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }));
  const subjectOptions = subjects.map((s) => ({ value: s.name, label: s.name }));
  const teacherOptions = teachers.map((t) => ({ value: t.fullName, label: t.fullName }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Assignment: ${homework?.title}` : 'Publish New Homework'}
      subtitle="Assign course tasks, deadlines, and submission parameters"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Publish Homework'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AppInput
          label="Homework Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Chapter 4 Practice Set & Graphing"
          error={Boolean(errors.title)}
          helperText={errors.title}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Assigned Class"
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

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Subject"
            value={formData.subjectName}
            onChange={(e) => setFormData({ ...formData, subjectName: e.target.value as string })}
            options={subjectOptions}
          />

          <AppDropdown
            label="Teacher In Charge"
            value={formData.teacherName}
            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value as string })}
            options={teacherOptions}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <AppDropdown
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as HomeworkStatus })}
            options={[
              { value: 'Active', label: 'Active (Ongoing)' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Closed', label: 'Closed / Evaluated' },
            ]}
          />
        </Box>

        <AppInput
          label="Assignment Details & Instructions"
          multiline
          rows={3}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed problem instructions, page references, or submission criteria..."
          error={Boolean(errors.description)}
          helperText={errors.description}
        />
      </Box>
    </AppModal>
  );
};
