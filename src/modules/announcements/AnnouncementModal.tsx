import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Announcement, AnnouncementCategory, AudienceType } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface AnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  announcement?: Announcement | null;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  open,
  onClose,
  announcement,
}) => {
  const { addAnnouncement, updateAnnouncement } = useSchool();
  const isEditing = Boolean(announcement);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Academic' as AnnouncementCategory,
    targetAudience: 'All' as AudienceType,
    author: 'Principal Office',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        targetAudience: announcement.targetAudience,
        author: announcement.author,
        priority: announcement.priority,
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: 'Academic',
        targetAudience: 'All',
        author: 'Principal Office',
        priority: 'Medium',
      });
    }
    setErrors({});
  }, [announcement, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.content.trim()) errs.content = 'Content is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && announcement) {
      updateAnnouncement(announcement.id, formData);
    } else {
      addAnnouncement({
        ...formData,
        publishDate: new Date().toISOString().split('T')[0],
      });
    }
    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Circular: ${announcement?.title}` : 'Publish School Announcement'}
      subtitle="Broadcast news or circular to students, parents, and faculty"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Broadcast Notice'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AppInput
          label="Notice Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Science Fair Registration Open"
          error={Boolean(errors.title)}
          helperText={errors.title}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as AnnouncementCategory })}
            options={[
              { value: 'Academic', label: 'Academic' },
              { value: 'Sports', label: 'Sports' },
              { value: 'Holiday', label: 'Holiday & Vacation' },
              { value: 'Emergency', label: 'Emergency Alert' },
              { value: 'General', label: 'General Circular' },
            ]}
          />

          <AppDropdown
            label="Target Audience"
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as AudienceType })}
            options={[
              { value: 'All', label: 'All Campus Community' },
              { value: 'Teachers', label: 'Faculty Staff Only' },
              { value: 'Students', label: 'Students' },
              { value: 'Parents', label: 'Parents / Guardians' },
            ]}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Priority Level"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High Priority (Urgent)' },
            ]}
          />

          <AppInput
            label="Publishing Office / Author"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="e.g. Principal Office"
          />
        </Box>

        <AppInput
          label="Announcement Content"
          multiline
          rows={4}
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter the full text of the circular notice..."
          error={Boolean(errors.content)}
          helperText={errors.content}
        />
      </Box>
    </AppModal>
  );
};
