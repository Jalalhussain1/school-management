import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { Calculator } from 'lucide-react';
import { AppModal } from '../../components/common/AppModal';
import { AppInput } from '../../components/common/AppInput';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppButton } from '../../components/common/AppButton';
import { Exam, Student, SubjectMark, ExamResult } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface EnterMarksModalProps {
  open: boolean;
  onClose: () => void;
  exam: Exam | null;
  student?: Student | null;
}

export const EnterMarksModal: React.FC<EnterMarksModalProps> = ({
  open,
  onClose,
  exam,
  student,
}) => {
  const { students, subjects, saveExamResult, examResults } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState(student?.id || '');

  const [marks, setMarks] = useState<SubjectMark[]>([
    { subjectCode: 'MTH-101', subjectName: 'Mathematics', maxMarks: 100, obtainedMarks: 85 },
    { subjectCode: 'PHY-201', subjectName: 'Physics', maxMarks: 100, obtainedMarks: 82 },
    { subjectCode: 'ENG-102', subjectName: 'English Literature', maxMarks: 100, obtainedMarks: 88 },
    { subjectCode: 'HST-202', subjectName: 'World History', maxMarks: 100, obtainedMarks: 80 },
    { subjectCode: 'CSC-301', subjectName: 'Computer Science', maxMarks: 100, obtainedMarks: 90 },
  ]);

  const [remarks, setRemarks] = useState('Satisfactory performance with steady progress across all disciplines.');

  useEffect(() => {
    if (student) {
      setSelectedStudentId(student.id);
    } else if (students.length > 0) {
      setSelectedStudentId(students[0].id);
    }
  }, [student, students, open]);

  // Load existing result if available
  useEffect(() => {
    if (exam && selectedStudentId) {
      const existing = examResults.find((r) => r.examId === exam.id && r.studentId === selectedStudentId);
      if (existing) {
        setMarks(existing.marks);
        setRemarks(existing.remarks || '');
      }
    }
  }, [exam, selectedStudentId, examResults]);

  const handleMarkChange = (index: number, val: number) => {
    const clamped = Math.max(0, Math.min(100, val || 0));
    setMarks((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], obtainedMarks: clamped };
      return copy;
    });
  };

  // Calculations
  const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const totalObtained = marks.reduce((sum, m) => sum + m.obtainedMarks, 0);
  const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(1)) : 0;

  const calculateGrade = (pct: number) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    return 'F';
  };

  const grade = calculateGrade(percentage);
  const isPassed = percentage >= 50;

  const handleSave = () => {
    if (!exam) return;
    const std = students.find((s) => s.id === selectedStudentId) || students[0];
    if (!std) return;

    const result: ExamResult = {
      id: `res-${exam.id}-${std.id}`,
      examId: exam.id,
      studentId: std.id,
      studentName: std.fullName,
      rollNo: std.rollNo,
      admissionNo: std.admissionNo,
      classId: std.classId,
      className: std.className,
      marks,
      totalMarks: totalMax,
      obtainedTotal: totalObtained,
      percentage,
      grade,
      status: isPassed ? 'Passed' : 'Failed',
      remarks,
    };

    saveExamResult(result);
    onClose();
  };

  const studentOptions = students.map((s) => ({
    value: s.id,
    label: `${s.fullName} (${s.className} - Roll: ${s.rollNo})`,
  }));

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Enter Examination Marks"
      subtitle={`Exam: ${exam?.title || 'Selected Assessment'}`}
      maxWidth="sm"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="contained" color="primary" onClick={handleSave}>
            Save & Publish Marks
          </AppButton>
        </>
      }
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <AppDropdown
          label="Select Candidate"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value as string)}
          options={studentOptions}
        />

        <Divider />

        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Subject Marks (Max 100 each)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {marks.map((m, idx) => (
            <Box
              key={m.subjectCode}
              sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                alignItems: 'center',
                gap: 2,
                p: 1.25,
                borderRadius: 2,
                bgcolor: 'action.hover',
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {m.subjectName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Code: {m.subjectCode}
                </Typography>
              </Box>

              <AppInput
                type="number"
                size="small"
                value={m.obtainedMarks}
                onChange={(e) => handleMarkChange(idx, Number(e.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
              />
            </Box>
          ))}
        </Box>

        {/* Live Calculation Card */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: isPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              AGGREGATE RESULT
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {totalObtained} / {totalMax} ({percentage}%)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={`Grade: ${grade}`} color={isPassed ? 'primary' : 'error'} sx={{ fontWeight: 800 }} />
            <Chip label={isPassed ? 'PASSED' : 'FAILED'} color={isPassed ? 'success' : 'error'} sx={{ fontWeight: 800 }} />
          </Box>
        </Box>

        <AppInput
          label="Teacher / Evaluator Remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Teacher remarks on student's aptitude..."
        />
      </Box>
    </AppModal>
  );
};
