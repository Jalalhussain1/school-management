import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Library,
  Plus,
  BookOpen,
  ArrowUpRight,
  RotateCcw,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppSearch } from '../../components/common/AppSearch';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { AppTable, Column } from '../../components/common/AppTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { BookModal } from './BookModal';
import { IssueBookModal } from './IssueBookModal';
import { LibraryBook, BookBorrowRecord } from '../../types';
import { formatDate } from '../../utils/formatters';

export const LibraryPage: React.FC = () => {
  const { books, borrowRecords, returnBook, deleteBook } = useSchool();

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueBookTarget, setIssueBookTarget] = useState<LibraryBook | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<LibraryBook | null>(null);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        searchQuery === '' ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbn.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = categoryFilter === 'ALL' || b.category === categoryFilter;

      return matchSearch && matchCat;
    });
  }, [books, searchQuery, categoryFilter]);

  const handleOpenAdd = () => {
    setSelectedBook(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEdit = (b: LibraryBook) => {
    setSelectedBook(b);
    setIsBookModalOpen(true);
  };

  const handleOpenIssue = (b?: LibraryBook) => {
    setIssueBookTarget(b || null);
    setIsIssueModalOpen(true);
  };

  const handleOpenDelete = (b: LibraryBook) => {
    setDeleteTarget(b);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteBook(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const bookColumns: Column<LibraryBook>[] = [
    {
      id: 'title',
      label: 'Book Title & Details',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            By {row.author} • {row.publisher} ({row.publicationYear})
          </Typography>
        </Box>
      ),
    },
    {
      id: 'isbn',
      label: 'ISBN',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {row.isbn}
        </Typography>
      ),
    },
    {
      id: 'category',
      label: 'Category',
      render: (row) => (
        <Chip label={row.category} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.725rem' }} />
      ),
    },
    {
      id: 'shelf',
      label: 'Shelf Location',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.shelfLocation}
        </Typography>
      ),
    },
    {
      id: 'copies',
      label: 'Stock Availability',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${row.availableCopies} Available`}
            size="small"
            color={row.availableCopies > 0 ? 'success' : 'error'}
            sx={{ fontWeight: 700, height: 22, fontSize: '0.725rem' }}
          />
          <Typography variant="caption" color="text.secondary">
            / {row.totalCopies} Total
          </Typography>
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <AppButton
            size="small"
            variant="contained"
            color="primary"
            disabled={row.availableCopies <= 0}
            onClick={() => handleOpenIssue(row)}
            sx={{ fontSize: '0.75rem', px: 1.25, py: 0.5 }}
          >
            Issue
          </AppButton>
          <Tooltip title="Edit Book Details">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <Edit size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Book">
            <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const historyColumns: Column<BookBorrowRecord>[] = [
    {
      id: 'book',
      label: 'Book Title',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {row.bookTitle}
        </Typography>
      ),
    },
    {
      id: 'borrower',
      label: 'Borrower',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.borrowerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Type: {row.borrowerType}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'issueDate',
      label: 'Issue Date',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(row.issueDate)}
        </Typography>
      ),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(row.dueDate)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'actions',
      label: 'Action',
      align: 'right',
      render: (row) => (
        row.status !== 'Returned' ? (
          <AppButton
            size="small"
            variant="outlined"
            color="success"
            icon={<RotateCcw size={14} />}
            onClick={() => returnBook(row.id)}
            sx={{ fontSize: '0.75rem', px: 1.25, py: 0.5 }}
          >
            Mark Returned
          </AppButton>
        ) : (
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
            Returned on {formatDate(row.returnDate)}
          </Typography>
        )
      ),
    },
  ];

  const uniqueCategories = Array.from(new Set(books.map((b) => b.category)));

  return (
    <Box>
      <AppPageTitle
        title="Library Management"
        subtitle={`Total books cataloged: ${books.length} | Borrowing tracking and catalog inventory`}
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Library' }]}
        actions={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <AppButton
              variant="outlined"
              color="primary"
              icon={<ArrowUpRight size={16} />}
              onClick={() => handleOpenIssue()}
            >
              Issue Book
            </AppButton>
            <AppButton
              variant="contained"
              color="primary"
              icon={<Plus size={16} />}
              onClick={handleOpenAdd}
            >
              Add New Book
            </AppButton>
          </Box>
        }
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Book Catalog & Inventory" />
          <Tab label={`Borrowing Records (${borrowRecords.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Books Catalog */}
      {activeTab === 0 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 2,
                  justifyContent: 'space-between',
                }}
              >
                <AppSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search title, author, or ISBN..."
                  width={{ xs: '100%', sm: 320 }}
                />

                <AppDropdown
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as string)}
                  options={[
                    { value: 'ALL', label: 'All Categories' },
                    ...uniqueCategories.map((c) => ({ value: c, label: c })),
                  ]}
                  sx={{ width: 190 }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <AppTable
              columns={bookColumns}
              data={filteredBooks}
              keyExtractor={(row) => row.id}
              emptyTitle="No books found"
              emptyDescription="No books matching your query or category filter."
              emptyActionText="Add First Book"
              onEmptyAction={handleOpenAdd}
            />
          </Card>
        </>
      )}

      {/* Tab 1: Borrowing History */}
      {activeTab === 1 && (
        <Card>
          <AppTable
            columns={historyColumns}
            data={borrowRecords}
            keyExtractor={(row) => row.id}
            emptyTitle="No borrow records found"
            emptyDescription="No active or past book loans recorded."
          />
        </Card>
      )}

      {/* Modals */}
      <BookModal
        open={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        book={selectedBook}
      />

      <IssueBookModal
        open={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        preselectedBook={issueBookTarget}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title}
        title="Delete Book from Library"
      />
    </Box>
  );
};
