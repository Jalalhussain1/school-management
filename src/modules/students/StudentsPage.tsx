import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Users,
  Mail,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppSearch } from '../../components/common/AppSearch';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { AppTable, Column } from '../../components/common/AppTable';
import { Pagination } from '../../components/common/Pagination';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { StudentModal } from './StudentModal';
import { StudentDetailModal } from './StudentDetailModal';
import { Student } from '../../types';

export const StudentsPage: React.FC = () => {
  const { students, deleteStudent, classes, inviteStudent } = useSchool();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const handleInvite = async (student: Student) => {
    setInvitingId(student.id);
    try {
      await inviteStudent(student.id);
    } finally {
      setInvitingId(null);
    }
  };

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchClass = classFilter === 'ALL' || s.className === classFilter;
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      const matchGender = genderFilter === 'ALL' || s.gender === genderFilter;

      return matchSearch && matchClass && matchStatus && matchGender;
    });
  }, [students, searchQuery, classFilter, statusFilter, genderFilter]);

  // Paginated records
  const paginatedStudents = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (student: Student) => {
    setDeleteTarget(student);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteStudent(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Table Columns
  const columns: Column<Student>[] = [
    {
      id: 'student',
      label: 'Student',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={row.avatar} sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 700 }}>
            {row.firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email || row.phone}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'admissionNo',
      label: 'Admission No',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {row.admissionNo}
        </Typography>
      ),
    },
    {
      id: 'rollNo',
      label: 'Roll No',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.rollNo}
        </Typography>
      ),
    },
    {
      id: 'class',
      label: 'Class & Section',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.className}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Section {row.section}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'gender',
      label: 'Gender',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.gender}
        </Typography>
      ),
    },
    {
      id: 'guardian',
      label: 'Parent / Guardian',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.parentName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.parentPhone}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'attendance',
      label: 'Attendance',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: (row.attendanceRate ?? 95) >= 90 ? 'success.main' : 'warning.main' }}>
          {row.attendanceRate ?? 95}%
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'portalStatus',
      label: 'Portal Access',
      render: (row) => {
        if (row.portalStatus === 'Active') {
          return (
            <Chip
              icon={<CheckCircle size={13} style={{ marginLeft: 6 }} />}
              label="Active"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }}
            />
          );
        }
        if (row.portalStatus === 'Pending') {
          return (
            <Chip
              icon={<Clock size={13} style={{ marginLeft: 6 }} />}
              label="Invited"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 700, height: 24, fontSize: '0.75rem' }}
            />
          );
        }
        return (
          <Chip
            label="Not Invited"
            size="small"
            sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem', bgcolor: 'action.hover', color: 'text.secondary' }}
          />
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          {row.email && row.portalStatus !== 'Active' && (
            <Tooltip title={row.portalStatus === 'Pending' ? 'Resend Portal Invitation Email' : 'Send Portal Invitation Email'}>
              <IconButton
                size="small"
                disabled={invitingId === row.id}
                onClick={() => handleInvite(row)}
                sx={{ color: 'warning.main' }}
              >
                {invitingId === row.id ? <CircularProgress size={16} color="inherit" /> : <Mail size={17} />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View Profile Dossier">
            <IconButton size="small" onClick={() => setDetailStudent(row)} sx={{ color: 'primary.main' }}>
              <Eye size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Student Record">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <Edit size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Student">
            <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const classFilterOptions = [
    { value: 'ALL', label: 'All Classes' },
    ...classes.map((c) => ({ value: c.name, label: c.name })),
  ];

  return (
    <Box>
      {/* Page Title */}
      <AppPageTitle
        title="Student Management"
        subtitle={`Total registered students: ${students.length} | Currently displaying active cohort`}
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Students' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<UserPlus size={16} />}
            onClick={handleOpenAdd}
          >
            New Student Admission
          </AppButton>
        }
      />

      {/* Filters and Controls Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2,
              justifyContent: 'space-between',
            }}
          >
            {/* Search */}
            <AppSearch
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
              placeholder="Search by name, roll, or admission ID..."
              width={{ xs: '100%', md: 320 }}
            />

            {/* Filter Dropdowns */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <AppDropdown
                label="Class"
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value as string);
                  setPage(1);
                }}
                options={classFilterOptions}
                sx={{ width: 140 }}
              />

              <AppDropdown
                label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as string);
                  setPage(1);
                }}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                  { value: 'Graduated', label: 'Graduated' },
                ]}
                sx={{ width: 140 }}
              />

              <AppDropdown
                label="Gender"
                value={genderFilter}
                onChange={(e) => {
                  setGenderFilter(e.target.value as string);
                  setPage(1);
                }}
                options={[
                  { value: 'ALL', label: 'All Genders' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                ]}
                sx={{ width: 130 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Students Data Table */}
      <Card>
        <AppTable
          columns={columns}
          data={paginatedStudents}
          keyExtractor={(row) => row.id}
          emptyTitle="No students found"
          emptyDescription="There are no students matching your filter criteria. Try clearing search or filters."
          emptyActionText="Add First Student"
          onEmptyAction={handleOpenAdd}
        />

        {filteredStudents.length > 0 && (
          <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
            <Pagination
              currentPage={page}
              totalItems={filteredStudents.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </Box>
        )}
      </Card>

      {/* Add / Edit Student Modal */}
      <StudentModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />

      {/* Student Profile Dossier Modal */}
      <StudentDetailModal
        open={Boolean(detailStudent)}
        onClose={() => setDetailStudent(null)}
        student={detailStudent}
        onEdit={(std) => {
          setSelectedStudent(std);
          setIsModalOpen(true);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.fullName}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete "${deleteTarget?.fullName}" (${deleteTarget?.admissionNo}) from the student directory?`}
      />
    </Box>
  );
};
