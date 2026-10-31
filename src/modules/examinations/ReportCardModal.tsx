import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { Printer, Award, ShieldCheck } from 'lucide-react';
import { AppModal } from '../../components/common/AppModal';
import { AppButton } from '../../components/common/AppButton';
import { ExamResult } from '../../types';
import { useSchool } from '../../context/SchoolContext';

export interface ReportCardModalProps {
  open: boolean;
  onClose: () => void;
  result: ExamResult | null;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  open,
  onClose,
  result,
}) => {
  const { settings } = useSchool();

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPassed = result.status === 'Passed';

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Official Student Academic Report Card"
      subtitle={`Student: ${result.studentName} (${result.rollNo})`}
      maxWidth="md"
      actions={
        <>
          <AppButton variant="outlined" color="inherit" onClick={onClose}>
            Close
          </AppButton>
          <AppButton
            variant="contained"
            color="primary"
            icon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print Transcript
          </AppButton>
        </>
      }
    >
      <Paper
        id="printable-report-card"
        sx={{
          p: 4,
          borderRadius: 2,
          border: '1px solid #cbd5e1',
          position: 'relative',
          backgroundColor: '#ffffff',
          color: '#0f172a',
        }}
      >
        {/* Header Banner */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={28} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {settings.schoolName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                Affiliated with National Academic Board • Institution Code: {settings.schoolCode}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb' }}>
              OFFICIAL TRANSCRIPT
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Session: {settings.currentAcademicYear}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

        {/* Student Dossier Strip */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>STUDENT NAME</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>{result.studentName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>ADMISSION ID</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{result.admissionNo}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>CLASS & SECTION</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{result.className}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>ROLL NUMBER</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{result.rollNo}</Typography>
          </Box>
        </Box>

        {/* Subject Marks Table */}
        <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2, mb: 3 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Subject Code & Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Maximum Marks</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Obtained Marks</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Percentage</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Letter Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.marks.map((m) => {
                const pct = Math.round((m.obtainedMarks / m.maxMarks) * 100);
                const lGrade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'F';
                return (
                  <TableRow key={m.subjectCode}>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>
                      {m.subjectName} <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({m.subjectCode})</span>
                    </TableCell>
                    <TableCell align="center" sx={{ color: '#64748b' }}>{m.maxMarks}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#0f172a' }}>{m.obtainedMarks}</TableCell>
                    <TableCell align="center" sx={{ color: '#475569' }}>{pct}%</TableCell>
                    <TableCell align="center">
                      <Chip label={lGrade} size="small" sx={{ fontWeight: 800, height: 22, fontSize: '0.75rem' }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Aggregate Performance Box */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
            gap: 2,
            p: 2.5,
            borderRadius: 2.5,
            backgroundColor: isPassed ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${isPassed ? '#a7f3d0' : '#fecaca'}`,
            mb: 3,
            textAlign: 'center',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>TOTAL OBTAINED</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {result.obtainedTotal} / {result.totalMarks}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>OVERALL PERCENTAGE</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {result.percentage}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>OVERALL GRADE</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563eb' }}>
              {result.grade}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>STATUS</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: isPassed ? '#059669' : '#dc2626' }}>
              {result.status.toUpperCase()}
            </Typography>
          </Box>
        </Box>

        {/* Remarks */}
        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', mb: 4 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block', mb: 0.5 }}>
            TEACHER & PRINCIPAL REMARKS:
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#334155' }}>
            "{result.remarks || 'Commendable dedication and discipline shown throughout the evaluation term.'}"
          </Typography>
        </Box>

        {/* Signature Line */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 3, borderTop: '1px dashed #cbd5e1' }}>
          <Box sx={{ textAlign: 'center', minWidth: 150 }}>
            <Box sx={{ borderBottom: '1px solid #0f172a', pb: 2, mb: 0.5, fontStyle: 'italic', color: '#475569' }}>
              Class Incharge
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>Class Teacher</Typography>
          </Box>

          <Box sx={{ textAlign: 'center', minWidth: 150 }}>
            <Box sx={{ borderBottom: '1px solid #0f172a', pb: 2, mb: 0.5, fontStyle: 'italic', color: '#475569' }}>
              Dr. Sarah Jenkins, Ed.D.
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a' }}>Principal Signature</Typography>
          </Box>
        </Box>
      </Paper>
    </AppModal>
  );
};
