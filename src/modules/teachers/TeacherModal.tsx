import React, { useState, useEffect } from 'react';
import { Box, Typography, Switch } from '@mui/material';
import { Mail } from 'lucide-react';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Teacher, TeacherStatus, Gender } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface TeacherModalProps {
  open: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({ open, onClose, teacher }) => {
  const { addTeacher, updateTeacher } = useSchool();
  const isEditing = Boolean(teacher);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    gender: 'Male' as Gender,
    designation: 'Senior Teacher',
    department: 'Mathematics',
    qualification: '',
    joiningDate: '2022-08-01',
    salary: 65000,
    status: 'Active' as TeacherStatus,
    address: '',
    subjects: 'Mathematics',
  });

  const [sendInviteEmail, setSendInviteEmail] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        employeeId: teacher.employeeId,
        email: teacher.email,
        phone: teacher.phone,
        gender: teacher.gender,
        designation: teacher.designation,
        department: teacher.department,
        qualification: teacher.qualification,
        joiningDate: teacher.joiningDate,
        salary: teacher.salary,
        status: teacher.status,
        address: teacher.address || '',
        subjects: teacher.subjects.join(', '),
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        employeeId: `EMP-T-${Math.floor(200 + Math.random() * 800)}`,
        email: '',
        phone: '',
        gender: 'Male',
        designation: 'Senior Teacher',
        department: 'Mathematics',
        qualification: 'M.Sc. Education',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: 62000,
        status: 'Active',
        address: '',
        subjects: 'Mathematics',
      });
    }
    setErrors({});
    setSendInviteEmail(true);
  }, [teacher, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.department.trim()) errs.department = 'Department is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const subjectsArr = formData.subjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (isEditing && teacher) {
      updateTeacher(teacher.id, {
        ...formData,
        subjects: subjectsArr,
      });
    } else {
      addTeacher({
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        subjects: subjectsArr,
        sendInviteEmail,
        avatar: '',
      });
    }
    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Faculty Record: ${teacher?.fullName}` : 'Add Faculty & Staff Member'}
      subtitle="Staff profile and department assignment"
      maxWidth="md"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Staff Member'}
          </AppButton>
        </>
      }
    >
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
        <AppInput
          label="Employee ID"
          value={formData.employeeId}
          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
        />
        <AppDropdown
          label="Designation"
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value as string })}
          options={[
            { value: 'Head of Department', label: 'Head of Department' },
            { value: 'Lead Faculty', label: 'Lead Faculty' },
            { value: 'Senior Teacher', label: 'Senior Teacher' },
            { value: 'Assistant Teacher', label: 'Assistant Teacher' },
            { value: 'Lab Assistant', label: 'Lab Assistant' },
            { value: 'Administrative Officer', label: 'Administrative Officer' },
          ]}
        />
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
            { value: 'Administration', label: 'Administration' },
          ]}
        />
        <AppInput
          label="Email Address"
          required
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <AppInput
          label="Contact Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+1 (555) 000-0000"
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
          label="Academic Qualification"
          value={formData.qualification}
          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          placeholder="e.g. M.Sc. in Physics, MIT"
        />
        <AppInput
          label="Joining Date"
          type="date"
          value={formData.joiningDate}
          onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <AppInput
          label="Annual Salary ($)"
          type="number"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
        />
        <AppDropdown
          label="Employment Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as TeacherStatus })}
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'On Leave', label: 'On Leave' },
            { value: 'Resigned', label: 'Resigned / Former' },
          ]}
        />
        <AppInput
          label="Assigned Subjects (comma-separated)"
          value={formData.subjects}
          onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
          placeholder="e.g. Calculus, Algebra, Statistics"
        />
        <AppInput
          label="Residential Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Street address, City, State"
        />
      </Box>

      {/* Staff Portal Setup Email */}
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
                bgcolor: 'secondary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Mail size={18} color="#7c3aed" />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Send Staff Portal Invitation Email
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formData.email
                  ? `Faculty member will receive an activation email at ${formData.email} to set up password and log in.`
                  : 'Enter faculty email above to dispatch instant portal invitation with password setup link.'}
              </Typography>
            </Box>
          </Box>
          <Switch
            checked={sendInviteEmail}
            onChange={(e) => setSendInviteEmail(e.target.checked)}
            color="secondary"
          />
        </Box>
      )}
    </AppModal>
  );
};
