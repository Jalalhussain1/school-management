import React, { useState } from 'react';
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
  Award,
  Plus,
  Edit,
  Trash2,
  Calendar,
  FileCheck,
  Printer,
  Calculator,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppButton } from '../../components/common/AppButton';
import { AppTable, Column } from '../../components/common/AppTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDeleteDialog } from '../../components/common/ConfirmDeleteDialog';
import { ExamModal } from './ExamModal';
import { EnterMarksModal } from './EnterMarksModal';
import { ReportCardModal } from './ReportCardModal';
import { Exam, ExamResult } from '../../types';
import { formatDate } from '../../utils/formatters';

export const ExaminationsPage: React.FC = () => {
  const { exams, deleteExam, examResults } = useSchool();

  const [activeTab, setActiveTab] = useState(0);

  // Modals
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [marksExam, setMarksExam] = useState<Exam | null>(null);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);

  const handleOpenAdd = () => {
    setSelectedExam(null);
    setIsExamModalOpen(true);
  };

  const handleOpenEdit = (e: Exam) => {
    setSelectedExam(e);
    setIsExamModalOpen(true);
  };

  const handleOpenDelete = (e: Exam) => {
    setDeleteTarget(e);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteExam(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  // Exam list table columns
  const examColumns: Column<Exam>[] = [
    {
      id: 'title',
      label: 'Examination Title',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.term} • {row.description || 'Standard Evaluation'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'dates',
      label: 'Exam Schedule',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calendar size={15} color="#64748b" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(row.startDate)} — {formatDate(row.endDate)}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'classes',
      label: 'Eligible Grades',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {row.classes.map((c, i) => (
            <Chip key={i} label={c} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
          ))}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          <AppButton
            size="small"
            variant="outlined"
            color="primary"
            icon={<Calculator size={14} />}
            onClick={() => setMarksExam(row)}
            sx={{ fontSize: '0.75rem', px: 1.25, py: 0.5 }}
          >
            Enter Marks
          </AppButton>

          <Tooltip title="Edit Schedule">
            <IconButton size="small" onClick={() => handleOpenEdit(row)} sx={{ color: 'text.secondary' }}>
              <Edit size={17} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Exam">
            <IconButton size="small" onClick={() => handleOpenDelete(row)} sx={{ color: 'error.main' }}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Exam results table columns
  const resultColumns: Column<ExamResult>[] = [
    {
      id: 'student',
      label: 'Student',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.studentName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Roll: {row.rollNo} • Adm: {row.admissionNo}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'class',
      label: 'Class',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.className}
        </Typography>
      ),
    },
    {
      id: 'score',
      label: 'Aggregate Score',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {row.obtainedTotal} / {row.totalMarks}
        </Typography>
      ),
    },
    {
      id: 'percentage',
      label: 'Percentage',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
          {row.percentage}%
        </Typography>
      ),
    },
    {
      id: 'grade',
      label: 'Grade',
      render: (row) => (
        <Chip
          label={row.grade}
          size="small"
          color={row.grade === 'A+' || row.grade === 'A' ? 'success' : row.grade === 'F' ? 'error' : 'default'}
          sx={{ fontWeight: 800, height: 22 }}
        />
      ),
    },
    {
      id: 'status',
      label: 'Outcome',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: 'actions',
      label: 'Report Card',
      align: 'right',
      render: (row) => (
        <AppButton
          size="small"
          variant="contained"
          color="secondary"
          icon={<Printer size={14} />}
          onClick={() => setSelectedResult(row)}
          sx={{ fontSize: '0.75rem', px: 1.5, py: 0.5 }}
        >
          View Report Card
        </AppButton>
      ),
    },
  ];

  return (
    <Box>
      <AppPageTitle
        title="Examinations & Academic Results"
        subtitle="Manage term schedules, record marks, compute grades, and generate student report cards"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Examinations' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Plus size={16} />}
            onClick={handleOpenAdd}
          >
            Schedule Examination
          </AppButton>
        }
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Examination Schedules" />
          <Tab label="Student Results & Report Cards" />
        </Tabs>
      </Box>

      {/* Tab 0: Scheduled Exams */}
      {activeTab === 0 && (
        <Card>
          <AppTable
            columns={examColumns}
            data={exams}
            keyExtractor={(row) => row.id}
            emptyTitle="No examinations scheduled"
            emptyDescription="Create an examination record to start scheduling."
            emptyActionText="Schedule Exam"
            onEmptyAction={handleOpenAdd}
          />
        </Card>
      )}

      {/* Tab 1: Student Result Ledger */}
      {activeTab === 1 && (
        <Card>
          <AppTable
            columns={resultColumns}
            data={examResults}
            keyExtractor={(row) => row.id}
            emptyTitle="No results recorded"
            emptyDescription="Use 'Enter Marks' from the Examination Schedules tab to record student marks."
          />
        </Card>
      )}

      {/* Modals */}
      <ExamModal
        open={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        exam={selectedExam}
      />

      <EnterMarksModal
        open={Boolean(marksExam)}
        onClose={() => setMarksExam(null)}
        exam={marksExam}
      />

      <ReportCardModal
        open={Boolean(selectedResult)}
        onClose={() => setSelectedResult(null)}
        result={selectedResult}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title}
        title="Delete Examination"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
      />
    </Box>
  );
};
