import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Clock,
  Layers,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppSearch } from '../../components/common/AppSearch';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { AppTable, Column } from '../../components/common/AppTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { SubjectModal } from './SubjectModal';
import { Subject } from '../../types';

export const SubjectsPage: React.FC = () => {
  const { subjects, deleteSubject, teachers, classes } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = departmentFilter === 'ALL' || s.department === departmentFilter;
      const matchType = typeFilter === 'ALL' || s.type === typeFilter;

      return matchSearch && matchDept && matchType;
    });
  }, [subjects, searchQuery, departmentFilter, typeFilter]);

  const handleOpenAdd = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setSelectedSubject(s);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (s: Subject) => {
    setDeleteTarget(s);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteSubject(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const columns: Column<Subject>[] = [
    {
      id: 'code',
      label: 'Code',
      render: (row) => (
        <Chip
          label={row.code}
          size="small"
          sx={{ fontWeight: 700, borderRadius: 1.5, height: 24, fontSize: '0.75rem' }}
        />
      ),
    },
    {
      id: 'name',
      label: 'Subject Name',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.department}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'type',
      label: 'Type',
      render: (row) => <StatusBadge status={row.type} />,
    },
    {
      id: 'weeklyHours',
      label: 'Weekly Hours',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Clock size={14} color="#64748b" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row.weeklyHours} hrs/week
          </Typography>
        </Box>
      ),
    },
    {
      id: 'teachers',
      label: 'Assigned Faculty',
      render: (row) => {
        const assignedTeachers = teachers.filter((t) => row.assignedTeacherIds.includes(t.id));
        return (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {assignedTeachers.length === 0 ? (
              <Typography variant="caption" color="text.secondary">
                Unassigned
              </Typography>
            ) : (
              assignedTeachers.map((t) => (
                <Chip key={t.id} label={t.fullName} size="small" variant="outlined" sx={{ height: 22, fontSize: '0.725rem' }} />
              ))
            )}
          </Box>
        );
      },
    },
    {
      id: 'classes',
      label: 'Assigned Grades',
      render: (row) => {
        const assignedClassNames = classes
          .filter((c) => row.assignedClassIds.includes(c.id))
          .map((c) => c.name);
        return (
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {assignedClassNames.length > 0 ? assignedClassNames.join(', ') : 'All Grades'}
          </Typography>
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="Edit Subject">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <Edit size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Subject">
            <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const uniqueDepts = Array.from(new Set(subjects.map((s) => s.department)));

  return (
    <Box>
      <AppPageTitle
        title="Subjects & Curriculum"
        subtitle={`Total curriculum courses: ${subjects.length} | Core requirements and elective pathways`}
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Subjects' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Add Subject
          </AppButton>
        }
      />

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
              placeholder="Search subject by code or name..."
              width={{ xs: '100%', sm: 300 }}
            />

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <AppDropdown
                label="Department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value as string)}
                options={[{ value: 'ALL', label: 'All Departments' }, ...uniqueDepts.map((d) => ({ value: d, label: d }))]}
                sx={{ width: 170 }}
              />

              <AppDropdown
                label="Type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as string)}
                options={[
                  { value: 'ALL', label: 'All Types' },
                  { value: 'Core', label: 'Core' },
                  { value: 'Elective', label: 'Elective' },
                ]}
                sx={{ width: 130 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <AppTable
          columns={columns}
          data={filteredSubjects}
          keyExtractor={(row) => row.id}
          emptyTitle="No curriculum subjects found"
          emptyDescription="There are no subjects matching your filters."
          emptyActionText="Create New Subject"
          onEmptyAction={handleOpenAdd}
        />
      </Card>

      <SubjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subject={selectedSubject}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name}
        title="Delete Subject"
        message={`Are you sure you want to remove "${deleteTarget?.name}" (${deleteTarget?.code}) from curriculum?`}
      />
    </Box>
  );
};
