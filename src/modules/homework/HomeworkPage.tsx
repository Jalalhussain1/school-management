import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  User,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppSearch } from '../../components/common/AppSearch';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { HomeworkModal } from './HomeworkModal';
import { Homework } from '../../types';
import { formatDate } from '../../utils/formatters';

export const HomeworkPage: React.FC = () => {
  const { homework, deleteHomework, classes } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHw, setSelectedHw] = useState<Homework | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Homework | null>(null);

  const filteredHw = useMemo(() => {
    return homework.filter((h) => {
      const matchSearch =
        searchQuery === '' ||
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.subjectName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || h.status === statusFilter;
      const matchClass = classFilter === 'ALL' || h.className === classFilter;

      return matchSearch && matchStatus && matchClass;
    });
  }, [homework, searchQuery, statusFilter, classFilter]);

  const handleOpenAdd = () => {
    setSelectedHw(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h: Homework) => {
    setSelectedHw(h);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (h: Homework) => {
    setDeleteTarget(h);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteHomework(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const classOptions = [
    { value: 'ALL', label: 'All Classes' },
    ...classes.map((c) => ({ value: c.name, label: c.name })),
  ];

  return (
    <Box>
      <AppPageTitle
        title="Homework & Assignments"
        subtitle={`Total assignments assigned: ${homework.length} | Track student submission progress and deadlines`}
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Homework' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Assign Homework
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
              onChange={setSearchQuery}
              placeholder="Search assignment title or subject..."
              width={{ xs: '100%', md: 320 }}
            />

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <AppDropdown
                label="Class"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value as string)}
                options={classOptions}
                sx={{ width: 150 }}
              />

              <AppDropdown
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as string)}
                options={[
                  { value: 'ALL', label: 'All Statuses' },
                  { value: 'Active', label: 'Active' },
                  { value: 'Overdue', label: 'Overdue' },
                  { value: 'Closed', label: 'Closed' },
                ]}
                sx={{ width: 140 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Homework Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        {filteredHw.map((hw) => {
          const submissionPercent = Math.round((hw.totalSubmissions / hw.maxSubmissions) * 100);

          return (
            <Card
              key={hw.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 24px rgba(0,0,0,0.4)'
                      : '0 8px 20px rgba(0,0,0,0.08)',
                },
              }}
            >
              <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Chip
                    label={`${hw.className} (${hw.section}) • ${hw.subjectName}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                  />
                  <StatusBadge status={hw.status} />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>
                  {hw.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {hw.description}
                </Typography>

                {/* Submissions Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Submissions: <strong>{hw.totalSubmissions} / {hw.maxSubmissions}</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {submissionPercent}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={submissionPercent}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={13} />
                    <span>{hw.teacherName}</span>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={13} />
                    <span>Due: {formatDate(hw.dueDate)}</span>
                  </Box>
                </Box>
              </CardContent>

              {/* Card Footer */}
              <Box
                sx={{
                  px: 2.5,
                  py: 1.25,
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: 'action.hover',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Assigned: {formatDate(hw.assignedDate)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Edit Assignment">
                    <IconButton size="small" onClick={() => handleOpenEdit(hw)}>
                      <Edit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Assignment">
                    <IconButton size="small" onClick={() => handleOpenDelete(hw)} sx={{ color: 'error.main' }}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Modals */}
      <HomeworkModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        homework={selectedHw}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title}
        title="Delete Homework Assignment"
      />
    </Box>
  );
};
