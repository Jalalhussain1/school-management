import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Exam, ExamStatus } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface ExamModalProps {
  open: boolean;
  onClose: () => void;
  exam?: Exam | null;
}

export const ExamModal: React.FC<ExamModalProps> = ({ open, onClose, exam }) => {
  const { addExam, updateExam, classes } = useSchool();
  const isEditing = Boolean(exam);

  const [formData, setFormData] = useState({
    title: '',
    term: 'Term 1',
    startDate: '2026-11-15',
    endDate: '2026-11-25',
    classes: 'Grade 9, Grade 10, Grade 11',
    status: 'Upcoming' as ExamStatus,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (exam) {
      setFormData({
        title: exam.title,
        term: exam.term,
        startDate: exam.startDate,
        endDate: exam.endDate,
        classes: exam.classes.join(', '),
        status: exam.status,
        description: exam.description || '',
      });
    } else {
      setFormData({
        title: 'Mid-Term Examinations 2026',
        term: 'Term 1',
        startDate: '2026-11-15',
        endDate: '2026-11-25',
        classes: 'Grade 9, Grade 10, Grade 11, Grade 12',
        status: 'Upcoming',
        description: 'Comprehensive mid-semester term examinations.',
      });
    }
    setErrors({});
  }, [exam, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Exam title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const classesArr = formData.classes
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (isEditing && exam) {
      updateExam(exam.id, {
        ...formData,
        classes: classesArr,
      });
    } else {
      addExam({
        ...formData,
        classes: classesArr,
      });
    }
    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Exam: ${exam?.title}` : 'Schedule New Examination'}
      subtitle="Define examination term, dates, and participating academic grades"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Schedule Exam'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AppInput
          label="Examination Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Annual Final Examinations 2026"
          error={Boolean(errors.title)}
          helperText={errors.title}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Academic Term"
            value={formData.term}
            onChange={(e) => setFormData({ ...formData, term: e.target.value as string })}
            options={[
              { value: 'Term 1', label: 'Term 1 (Fall)' },
              { value: 'Term 2', label: 'Term 2 (Spring)' },
              { value: 'Finals', label: 'Annual Board Finals' },
            ]}
          />

          <AppDropdown
            label="Exam Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ExamStatus })}
            options={[
              { value: 'Upcoming', label: 'Upcoming' },
              { value: 'Ongoing', label: 'Ongoing' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Published', label: 'Results Published' },
            ]}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <AppInput
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <AppInput
          label="Participating Classes (comma-separated)"
          value={formData.classes}
          onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
          placeholder="e.g. Grade 9, Grade 10, Grade 11"
        />

        <AppInput
          label="Examination Instructions / Guidelines"
          multiline
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Rules on hall tickets, calculators, and evaluation criteria..."
        />
      </Box>
    </AppModal>
  );
};
