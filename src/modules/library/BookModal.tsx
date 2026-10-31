import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { LibraryBook } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface BookModalProps {
  open: boolean;
  onClose: () => void;
  book?: LibraryBook | null;
}

export const BookModal: React.FC<BookModalProps> = ({ open, onClose, book }) => {
  const { addBook, updateBook } = useSchool();
  const isEditing = Boolean(book);

  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    category: 'Computer Science',
    publisher: '',
    totalCopies: 5,
    availableCopies: 5,
    shelfLocation: 'Shelf-01A',
    publicationYear: 2022,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (book) {
      setFormData({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        category: book.category,
        publisher: book.publisher,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        shelfLocation: book.shelfLocation,
        publicationYear: book.publicationYear,
      });
    } else {
      setFormData({
        isbn: `978-0${Math.floor(100000000 + Math.random() * 900000000)}`,
        title: '',
        author: '',
        category: 'Computer Science',
        publisher: 'Academic Press',
        totalCopies: 8,
        availableCopies: 8,
        shelfLocation: 'CS-Shelf-02B',
        publicationYear: 2023,
      });
    }
    setErrors({});
  }, [book, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Book title is required';
    if (!formData.author.trim()) errs.author = 'Author is required';
    if (!formData.isbn.trim()) errs.isbn = 'ISBN is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && book) {
      updateBook(book.id, formData);
    } else {
      addBook(formData);
    }
    onClose();
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Book: ${book?.title}` : 'Catalog New Library Book'}
      subtitle="Register book in campus digital library repository"
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Catalog Book'}
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AppInput
          label="Book Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={Boolean(errors.title)}
          helperText={errors.title}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Author"
            required
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            error={Boolean(errors.author)}
            helperText={errors.author}
          />
          <AppInput
            label="ISBN Number"
            required
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            error={Boolean(errors.isbn)}
            helperText={errors.isbn}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppDropdown
            label="Category / Genre"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as string })}
            options={[
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Physics & Science', label: 'Physics & Science' },
              { value: 'Mathematics', label: 'Mathematics' },
              { value: 'Classic Literature', label: 'Classic Literature' },
              { value: 'History & Sociology', label: 'History & Sociology' },
              { value: 'General Reference', label: 'General Reference' },
            ]}
          />
          <AppInput
            label="Shelf Location"
            value={formData.shelfLocation}
            onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
            placeholder="e.g. Shelf 04-B"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
          />
          <AppInput
            label="Publication Year"
            type="number"
            value={formData.publicationYear}
            onChange={(e) => setFormData({ ...formData, publicationYear: Number(e.target.value) })}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <AppInput
            label="Total Copies"
            type="number"
            value={formData.totalCopies}
            onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
          />
          <AppInput
            label="Available Copies"
            type="number"
            value={formData.availableCopies}
            onChange={(e) => setFormData({ ...formData, availableCopies: Number(e.target.value) })}
          />
        </Box>
      </Box>
    </AppModal>
  );
};
