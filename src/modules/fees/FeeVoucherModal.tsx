import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { FeeVoucher, FeeStatus } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface FeeVoucherModalProps {
  open: boolean;
  onClose: () => void;
  voucher?: FeeVoucher | null;
}

export const FeeVoucherModal: React.FC<FeeVoucherModalProps> = ({ open, onClose, voucher }) => {
  const { addFeeVoucher, updateFeeVoucher, students, feeCategories } = useSchool();
  const isEditing = Boolean(voucher);

  const [formData, setFormData] = useState({
    invoiceNo: '',
    studentId: '',
    feeType: 'Tuition Fee - Term 1',
    amount: 1350,
    discount: 0,
    dueDate: '2026-11-15',
    status: 'Unpaid' as FeeStatus,
    academicTerm: 'Term 1 (Fall 2026)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (voucher) {
      setFormData({
        invoiceNo: voucher.invoiceNo,
        studentId: voucher.studentId,
        feeType: voucher.feeType,
        amount: voucher.amount,
        discount: voucher.discount,
        dueDate: voucher.dueDate,
        status: voucher.status,
        academicTerm: voucher.academicTerm,
      });
    } else {
      setFormData({
        invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        studentId: students[0]?.id || '',
        feeType: 'Tuition Fee - Term 1',
        amount: 1350,
        discount: 0,
        dueDate: '2026-11-15',
        status: 'Unpaid',
        academicTerm: 'Term 1 (Fall 2026)',
      });
    }
    setErrors({});
  }, [voucher, open, students]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.studentId) errs.studentId = 'Please select a student';
    if (!formData.feeType) errs.feeType = 'Fee category is required';
    if (formData.amount <= 0) errs.amount = 'Amount must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const studentObj = students.find((s) => s.id === formData.studentId);
    const studentName = studentObj ? studentObj.fullName : 'Unknown Student';
    const admissionNo = studentObj ? studentObj.admissionNo : 'ADM-000';
    const classId = studentObj ? studentObj.classId : 'cls-10';
    const className = studentObj ? studentObj.className : 'Grade 10';
    const netAmount = Math.max(0, formData.amount - formData.discount);

    if (isEditing && voucher) {
      updateFeeVoucher(voucher.id, {
        ...formData,
        studentName,
        admissionNo,
        classId,
        className,
        netAmount,
      });
    } else {
      addFeeVoucher({
        ...formData,
        studentName,
        admissionNo,
        classId,
        className,
        netAmount,
      });
    }
    onClose();
  };

  const studentOptions = students.map((s) => ({
    value: s.id,
    label: `${s.fullName} (${s.className} - ${s.admissionNo})`,
  }));

  const feeTypeOptions = feeCategories.map((c) => ({
    value: c.name,
    label: `${c.name} ($${c.amount})`,
  }));

  const netPayable = Math.max(0, formData.amount - formData.discount);

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Fee Voucher: ${voucher?.invoiceNo}` : 'Generate Student Fee Voucher'}
      subtitle="Issue academic fee bill with scholarship or discount deduction"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Issue Voucher'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AppInput
          label="Invoice Number"
          value={formData.invoiceNo}
          onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
        />

        <AppDropdown
          label="Select Enrolled Student"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value as string })}
          options={studentOptions}
          error={Boolean(errors.studentId)}
          helperText={errors.studentId}
        />

        <AppDropdown
          label="Fee Category / Type"
          value={formData.feeType}
          onChange={(e) => {
            const chosen = e.target.value as string;
            const cat = feeCategories.find((c) => c.name === chosen);
            setFormData({
              ...formData,
              feeType: chosen,
              amount: cat ? cat.amount * 3 : formData.amount,
            });
          }}
          options={feeTypeOptions}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Gross Amount ($)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
          />

          <AppInput
            label="Discount / Scholarship ($)"
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
          />
        </Box>

        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Net Payable Amount:</Box>
            <Box sx={{ fontSize: '1.25rem', fontWeight: 800, color: 'primary.main' }}>
              ${netPayable.toLocaleString()}
            </Box>
          </Box>
          <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', textAlign: 'right' }}>
            Term: {formData.academicTerm}
          </Box>
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
            label="Payment Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as FeeStatus })}
            options={[
              { value: 'Unpaid', label: 'Unpaid' },
              { value: 'Paid', label: 'Paid' },
              { value: 'Overdue', label: 'Overdue' },
            ]}
          />
        </Box>
      </Box>
    </AppModal>
  );
};
