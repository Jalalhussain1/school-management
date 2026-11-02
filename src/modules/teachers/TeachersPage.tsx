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
  GraduationCap,
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
import { TeacherModal } from './TeacherModal';
import { TeacherDetailModal } from './TeacherDetailModal';
import { Teacher } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const TeachersPage: React.FC = () => {
  const { teachers, deleteTeacher, inviteTeacher } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [detailTeacher, setDetailTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);
  const [invitingId, setInvitingId] = useState<string | null>(null);

  const handleInvite = async (teacher: Teacher) => {
    setInvitingId(teacher.id);
    try {
      await inviteTeacher(teacher.id);
    } finally {
      setInvitingId(null);
    }
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        searchQuery === '' ||
        t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = departmentFilter === 'ALL' || t.department === departmentFilter;
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [teachers, searchQuery, departmentFilter, statusFilter]);

  const paginatedTeachers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTeachers.slice(startIndex, startIndex + pageSize);
  }, [filteredTeachers, page, pageSize]);

  const handleOpenAdd = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Teacher) => {
    setSelectedTeacher(t);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (t: Teacher) => {
    setDeleteTarget(t);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteTeacher(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns: Column<Teacher>[] = [
    {
      id: 'teacher',
      label: 'Faculty Member',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={row.avatar} sx={{ width: 38, height: 38, bgcolor: 'secondary.main', fontWeight: 700 }}>
            {row.firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'employeeId',
      label: 'Employee ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {row.employeeId}
        </Typography>
      ),
    },
    {
      id: 'designation',
      label: 'Designation',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.designation}
        </Typography>
      ),
    },
    {
      id: 'department',
      label: 'Department',
      render: (row) => (
        <Chip
          label={row.department}
          size="small"
          sx={{ fontWeight: 600, height: 22, fontSize: '0.725rem' }}
        />
      ),
    },
    {
      id: 'subjects',
      label: 'Assigned Subjects',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: 220 }}>
          {row.subjects.slice(0, 2).map((s, i) => (
            <Chip key={i} label={s} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          ))}
          {row.subjects.length > 2 && (
            <Chip label={`+${row.subjects.length - 2}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
          )}
        </Box>
      ),
    },
    {
      id: 'salary',
      label: 'Annual Salary',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatCurrency(row.salary)}
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
                sx={{ color: 'secondary.main' }}
              >
                {invitingId === row.id ? <CircularProgress size={16} color="inherit" /> : <Mail size={17} />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View Faculty Profile">
            <IconButton size="small" onClick={() => setDetailTeacher(row)} sx={{ color: 'primary.main' }}>
              <Eye size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Faculty Record">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <Edit size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Record">
            <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const uniqueDepartments = Array.from(new Set(teachers.map((t) => t.department)));
  const deptOptions = [
    { value: 'ALL', label: 'All Departments' },
    ...uniqueDepartments.map((d) => ({ value: d, label: d })),
  ];

  return (
    <Box>
      <AppPageTitle
        title="Teacher & Staff Management"
        subtitle={`Total faculty members: ${teachers.length} | Departments and academic instructors`}
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Teachers' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<UserPlus size={16} />}
            onClick={handleOpenAdd}
          >
            Add Faculty Member
          </AppButton>
        }
      />

      {/* Filter Card */}
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
            <AppSearch
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setPage(1);
              }}
              placeholder="Search faculty name, ID, or email..."
              width={{ xs: '100%', md: 320 }}
            />

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <AppDropdown
                label="Department"
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value as string);
                  setPage(1);
                }}
                options={deptOptions}
                sx={{ width: 180 }}
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
                  { value: 'On Leave', label: 'On Leave' },
                  { value: 'Resigned', label: 'Resigned' },
                ]}
                sx={{ width: 140 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Teachers Table */}
      <Card>
        <AppTable
          columns={columns}
          data={paginatedTeachers}
          keyExtractor={(row) => row.id}
          emptyTitle="No faculty members found"
          emptyDescription="There are no records matching your selected department or search terms."
          emptyActionText="Add First Faculty"
          onEmptyAction={handleOpenAdd}
        />

        {filteredTeachers.length > 0 && (
          <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
            <Pagination
              currentPage={page}
              totalItems={filteredTeachers.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </Box>
        )}
      </Card>

      <TeacherModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacher={selectedTeacher}
      />

      <TeacherDetailModal
        open={Boolean(detailTeacher)}
        onClose={() => setDetailTeacher(null)}
        teacher={detailTeacher}
        onEdit={(t) => {
          setSelectedTeacher(t);
          setIsModalOpen(true);
        }}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.fullName}
        title="Delete Faculty Member"
        message={`Are you sure you want to remove "${deleteTarget?.fullName}" (${deleteTarget?.employeeId}) from faculty records?`}
      />
    </Box>
  );
};
