import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Typography,
  Switch,
} from '@mui/material';
import { Mail } from 'lucide-react';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Student, StudentStatus, Gender } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface StudentModalProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({ open, onClose, student }) => {
  const { addStudent, updateStudent, classes } = useSchool();
  const isEditing = Boolean(student);

  const [tab, setTab] = useState(0);
  const [sendInviteEmail, setSendInviteEmail] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    admissionNo: '',
    rollNo: '',
    email: '',
    phone: '',
    gender: 'Male' as Gender,
    dateOfBirth: '2010-01-01',
    bloodGroup: 'O+',
    classId: 'cls-10',
    className: 'Grade 10',
    section: 'A',
    status: 'Active' as StudentStatus,
    address: '',
    parentName: '',
    parentRelation: 'Father',
    parentPhone: '',
    parentEmail: '',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        admissionNo: student.admissionNo,
        rollNo: student.rollNo,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        bloodGroup: student.bloodGroup,
        classId: student.classId,
        className: student.className,
        section: student.section,
        status: student.status,
        address: student.address,
        parentName: student.parentName,
        parentRelation: student.parentRelation,
        parentPhone: student.parentPhone,
        parentEmail: student.parentEmail,
        emergencyContact: student.emergencyContact,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        admissionNo: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
        rollNo: `10A-${Math.floor(10 + Math.random() * 90)}`,
        email: '',
        phone: '',
        gender: 'Male',
        dateOfBirth: '2010-05-15',
        bloodGroup: 'O+',
        classId: 'cls-10',
        className: 'Grade 10',
        section: 'A',
        status: 'Active',
        address: '',
        parentName: '',
        parentRelation: 'Father',
        parentPhone: '',
        parentEmail: '',
        emergencyContact: '',
      });
    }
    setErrors({});
    setTab(0);
    setSendInviteEmail(true);
  }, [student, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.admissionNo.trim()) errs.admissionNo = 'Admission No is required';
    if (!formData.parentName.trim()) errs.parentName = 'Parent/Guardian name is required';
    if (!formData.parentPhone.trim()) errs.parentPhone = 'Parent contact phone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const matchedClass = classes.find((c) => c.id === formData.classId);
    const className = matchedClass ? matchedClass.name : formData.className;

    if (isEditing && student) {
      updateStudent(student.id, {
        ...formData,
        className,
      });
    } else {
      addStudent({
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        className,
        admissionDate: new Date().toISOString().split('T')[0],
        sendInviteEmail,
        avatar: formData.gender === 'Female'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      });
    }
    onClose();
  };

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Student: ${student?.fullName}` : 'New Student Admission'}
      subtitle={isEditing ? 'Modify academic and guardian records' : 'Register candidate for the current academic session'}
      maxWidth="md"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Enroll Student'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="1. Personal Information" />
          <Tab label="2. Academic & Enrollment" />
          <Tab label="3. Parent & Guardian" />
        </Tabs>
      </Box>

      {/* Tab 0: Personal Details */}
      {tab === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <AppInput
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            error={Boolean(errors.firstName)}
            helperText={errors.firstName}
          />
          <AppInput
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={Boolean(errors.lastName)}
            helperText={errors.lastName}
          />
          <AppDropdown
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <AppInput
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <AppDropdown
            label="Blood Group"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as string })}
            options={[
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
            ]}
          />
          <AppInput
            label="Student Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="student@edumanage.org"
          />
          <AppInput
            label="Contact Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
          <AppInput
            label="Residential Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Street address, City, State"
          />
        </Box>
      )}

      {/* Tab 1: Academic & Enrollment */}
      {tab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <AppInput
            label="Admission Number"
            required
            value={formData.admissionNo}
            onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
            error={Boolean(errors.admissionNo)}
            helperText={errors.admissionNo}
          />
          <AppInput
            label="Roll Number"
            value={formData.rollNo}
            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            placeholder="e.g. 10A-14"
          />
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
          <AppDropdown
            label="Student Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
            options={[
              { value: 'Active', label: 'Active (Currently Enrolled)' },
              { value: 'Inactive', label: 'Inactive (On Leave / Suspended)' },
              { value: 'Graduated', label: 'Graduated (Alumni)' },
            ]}
          />
        </Box>
      )}

      {/* Tab 2: Parent & Guardian Details */}
      {tab === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <AppInput
            label="Parent / Guardian Full Name"
            required
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            error={Boolean(errors.parentName)}
            helperText={errors.parentName}
          />
          <AppDropdown
            label="Relationship"
            value={formData.parentRelation}
            onChange={(e) => setFormData({ ...formData, parentRelation: e.target.value as string })}
            options={[
              { value: 'Father', label: 'Father' },
              { value: 'Mother', label: 'Mother' },
              { value: 'Guardian', label: 'Legal Guardian' },
              { value: 'Parents', label: 'Both Parents' },
            ]}
          />
          <AppInput
            label="Parent Phone Number"
            required
            value={formData.parentPhone}
            onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
            error={Boolean(errors.parentPhone)}
            helperText={errors.parentPhone}
          />
          <AppInput
            label="Parent Email Address"
            type="email"
            value={formData.parentEmail}
            onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
          />
          <AppInput
            label="Emergency Contact Phone"
            value={formData.emergencyContact}
            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            placeholder="+1 (555) 999-9999"
          />
        </Box>
      )}

      {/* Instant Portal Account Invitation */}
      {!isEditing && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2.5,
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Mail size={18} color="#2563eb" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Send Portal Setup & Invitation Email
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formData.email
                  ? `Student will receive an activation email at ${formData.email} to set password and log in.`
                  : 'Enter student email above to dispatch instant portal invitation with password setup link.'}
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={sendInviteEmail}
            onChange={(e) => setSendInviteEmail(e.target.checked)}
            color="primary"
          />
        </Box>
      )}
    </AppModal>
  );
};
