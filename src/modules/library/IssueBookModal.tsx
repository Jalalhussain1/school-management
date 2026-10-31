import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { LibraryBook } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface IssueBookModalProps {
  open: boolean;
  onClose: () => void;
  preselectedBook?: LibraryBook | null;
}

export const IssueBookModal: React.FC<IssueBookModalProps> = ({
  open,
  onClose,
  preselectedBook,
}) => {
  const { books, students, teachers, issueBook } = useSchool();

  const [bookId, setBookId] = useState(preselectedBook?.id || '');
  const [borrowerType, setBorrowerType] = useState<'Student' | 'Teacher'>('Student');
  const [borrowerId, setBorrowerId] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (preselectedBook) {
      setBookId(preselectedBook.id);
    } else if (books.length > 0) {
      setBookId(books[0].id);
    }
    if (borrowerType === 'Student' && students.length > 0) {
      setBorrowerId(students[0].id);
    } else if (borrowerType === 'Teacher' && teachers.length > 0) {
      setBorrowerId(teachers[0].id);
    }
  }, [preselectedBook, books, students, teachers, borrowerType, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    let borrowerName = 'Anonymous';
    if (borrowerType === 'Student') {
      const s = students.find((std) => std.id === borrowerId);
      if (s) borrowerName = s.fullName;
    } else {
      const t = teachers.find((tch) => tch.id === borrowerId);
      if (t) borrowerName = t.fullName;
    }

    issueBook({
      bookId: book.id,
      bookTitle: book.title,
      borrowerType,
      borrowerId,
      borrowerName,
      issueDate,
      dueDate,
      status: 'Borrowed',
    });

    onClose();
  };

  const bookOptions = books.map((b) => ({
    value: b.id,
    label: `${b.title} (${b.availableCopies} available)`,
  }));

  const borrowerOptions =
    borrowerType === 'Student'
      ? students.map((s) => ({ value: s.id, label: `${s.fullName} (${s.className})` }))
      : teachers.map((t) => ({ value: t.id, label: `${t.fullName} (${t.department})` }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Issue Library Book"
      subtitle="Checkout book loan to student or teacher"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            Confirm Issue
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AppDropdown
          label="Select Library Book"
          value={bookId}
          onChange={(e) => setBookId(e.target.value as string)}
          options={bookOptions}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
          <AppDropdown
            label="Borrower Type"
            value={borrowerType}
            onChange={(e) => setBorrowerType(e.target.value as 'Student' | 'Teacher')}
            options={[
              { value: 'Student', label: 'Student' },
              { value: 'Teacher', label: 'Faculty Staff' },
            ]}
          />

          <AppDropdown
            label="Select Borrower Member"
            value={borrowerId}
            onChange={(e) => setBorrowerId(e.target.value as string)}
            options={borrowerOptions}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Issue Date"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <AppInput
            label="Return Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </Box>
    </AppModal>
  );
};
