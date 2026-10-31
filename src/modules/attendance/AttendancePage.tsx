import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Users,
  Check,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppDropdown } from '../../components/common/AppDropdown';
import { AppDatePicker } from '../../components/common/AppDatePicker';
import { AppButton } from '../../components/common/AppButton';
import { AppTable, Column } from '../../components/common/AppTable';
import { AttendanceRecord, AttendanceStatus } from '../../types';

export const AttendancePage: React.FC = () => {
  const { students, classes, attendanceRecords, saveAttendanceBatch } = useSchool();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedClassId, setSelectedClassId] = useState('cls-10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [activeTab, setActiveTab] = useState(0);

  // Find students in chosen class and section
  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classStudents = useMemo(() => {
    return students.filter(
      (s) => (s.classId === selectedClassId || s.className === currentClass?.name) &&
             (s.section === selectedSection || !s.section)
    );
  }, [students, selectedClassId, currentClass, selectedSection]);

  // Local draft records for the current date & class
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  // Initialize draft when date, class or students change
  React.useEffect(() => {
    const draft: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((std) => {
      const existing = attendanceRecords.find(
        (r) => r.date === selectedDate && r.studentId === std.id
      );
      if (existing) {
        draft[std.id] = { status: existing.status, remarks: existing.remarks || '' };
      } else {
        draft[std.id] = { status: 'Present', remarks: '' };
      }
    });
    setAttendanceDraft(draft);
  }, [selectedDate, selectedClassId, selectedSection, classStudents, attendanceRecords]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((std) => {
      updated[std.id] = {
        status,
        remarks: attendanceDraft[std.id]?.remarks || '',
      };
    });
    setAttendanceDraft(updated);
  };

  const handleSaveAttendance = () => {
    const recordsToSave: AttendanceRecord[] = classStudents.map((std) => ({
      id: `att-${selectedDate}-${std.id}`,
      date: selectedDate,
      studentId: std.id,
      studentName: std.fullName,
      rollNo: std.rollNo,
      classId: selectedClassId,
      section: selectedSection,
      status: attendanceDraft[std.id]?.status || 'Present',
      remarks: attendanceDraft[std.id]?.remarks || '',
    }));

    saveAttendanceBatch(recordsToSave);
  };

  // Summary Metrics
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;

    Object.values(attendanceDraft).forEach((val) => {
      if (val.status === 'Present') present++;
      else if (val.status === 'Absent') absent++;
      else if (val.status === 'Late') late++;
      else if (val.status === 'Leave') leave++;
    });

    const total = classStudents.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

    return { total, present, absent, late, leave, rate };
  }, [attendanceDraft, classStudents]);

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }));
  const sectionOptions = (currentClass?.sections || ['A', 'B']).map((s) => ({ value: s, label: `Section ${s}` }));

  // Table Columns
  const columns: Column<(typeof classStudents)[0]>[] = [
    {
      id: 'rollNo',
      label: 'Roll No',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {row.rollNo}
        </Typography>
      ),
    },
    {
      id: 'student',
      label: 'Student Name',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={row.avatar} sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontWeight: 700 }}>
            {row.firstName[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Adm: {row.admissionNo}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'statusRadio',
      label: 'Attendance Status',
      render: (row) => {
        const current = attendanceDraft[row.id]?.status || 'Present';
        return (
          <RadioGroup
            row
            value={current}
            onChange={(e) => handleStatusChange(row.id, e.target.value as AttendanceStatus)}
            sx={{ gap: { xs: 0.5, md: 2 } }}
          >
            <FormControlLabel
              value="Present"
              control={<Radio size="small" color="success" />}
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: current === 'Present' ? 'success.main' : 'text.secondary' }}>
                  Present
                </Typography>
              }
            />
            <FormControlLabel
              value="Absent"
              control={<Radio size="small" color="error" />}
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: current === 'Absent' ? 'error.main' : 'text.secondary' }}>
                  Absent
                </Typography>
              }
            />
            <FormControlLabel
              value="Late"
              control={<Radio size="small" color="warning" />}
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: current === 'Late' ? 'warning.main' : 'text.secondary' }}>
                  Late
                </Typography>
              }
            />
            <FormControlLabel
              value="Leave"
              control={<Radio size="small" color="info" />}
              label={
                <Typography variant="body2" sx={{ fontWeight: 600, color: current === 'Leave' ? 'info.main' : 'text.secondary' }}>
                  Leave
                </Typography>
              }
            />
          </RadioGroup>
        );
      },
    },
    {
      id: 'remarks',
      label: 'Notes / Remarks',
      render: (row) => (
        <TextField
          size="small"
          placeholder="Optional reason..."
          value={attendanceDraft[row.id]?.remarks || ''}
          onChange={(e) => handleRemarksChange(row.id, e.target.value)}
          sx={{ minWidth: 160 }}
        />
      ),
    },
  ];

  return (
    <Box>
      <AppPageTitle
        title="Attendance Management"
        subtitle="Mark daily student presence, log authorized leaves, and view attendance analytics"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Attendance' }]}
        actions={
          <AppButton
            variant="contained"
            color="primary"
            icon={<Save size={16} />}
            onClick={handleSaveAttendance}
          >
            Save Attendance
          </AppButton>
        }
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Daily Attendance Sheet" />
          <Tab label="Monthly Class Summary" />
        </Tabs>
      </Box>

      {/* Selector Card */}
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
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <AppDatePicker
                label="Attendance Date"
                value={selectedDate}
                onChange={setSelectedDate}
                fullWidth={false}
              />

              <AppDropdown
                label="Class"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value as string)}
                options={classOptions}
                sx={{ width: 160, mt: 2.5 }}
              />

              <AppDropdown
                label="Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value as string)}
                options={sectionOptions}
                sx={{ width: 130, mt: 2.5 }}
              />
            </Box>

            {/* Quick Bulk Actions */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', pt: { xs: 1, md: 2.5 } }}>
              <AppButton
                size="small"
                variant="outlined"
                color="success"
                icon={<Check size={14} />}
                onClick={() => handleMarkAll('Present')}
              >
                Mark All Present
              </AppButton>
              <AppButton
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleMarkAll('Absent')}
              >
                Clear / All Absent
              </AppButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* KPI Stats Strip */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Total Students
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
            {summary.total}
          </Typography>
        </Card>

        <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(16, 185, 129, 0.08)' }}>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
            Present
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
            {summary.present}
          </Typography>
        </Card>

        <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(239, 68, 68, 0.08)' }}>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: 700 }}>
            Absent
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'error.main', mt: 0.5 }}>
            {summary.absent}
          </Typography>
        </Card>

        <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(245, 158, 11, 0.08)' }}>
          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700 }}>
            Late Arrival
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'warning.main', mt: 0.5 }}>
            {summary.late}
          </Typography>
        </Card>

        <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(59, 130, 246, 0.08)' }}>
          <Typography variant="caption" color="info.main" sx={{ fontWeight: 700 }}>
            Approved Leave
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'info.main', mt: 0.5 }}>
            {summary.leave}
          </Typography>
        </Card>

        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Attendance Rate
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
            {summary.rate}%
          </Typography>
        </Card>
      </Box>

      {/* Tab 0: Daily Attendance Roster Table */}
      {activeTab === 0 && (
        <Card>
          <AppTable
            columns={columns}
            data={classStudents}
            keyExtractor={(row) => row.id}
            emptyTitle="No students found in this section"
            emptyDescription="Ensure students are assigned to this class and section."
          />

          <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'flex-end', borderTop: 1, borderColor: 'divider' }}>
            <AppButton
              variant="contained"
              color="primary"
              size="medium"
              icon={<Save size={16} />}
              onClick={handleSaveAttendance}
            >
              Submit & Save Attendance
            </AppButton>
          </Box>
        </Card>
      )}

      {/* Tab 1: Monthly Attendance Summary */}
      {activeTab === 1 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Monthly Attendance Trend Report
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Aggregated attendance record for {currentClass?.name} - Section {selectedSection} across the current month.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
            {classStudents.map((std) => (
              <Card key={std.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <Avatar src={std.avatar} sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                    {std.firstName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {std.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Roll: {std.rollNo}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Overall Monthly Rate:
                  </Typography>
                  <Chip
                    label={`${std.attendanceRate ?? 95}%`}
                    size="small"
                    color={(std.attendanceRate ?? 95) >= 90 ? 'success' : 'warning'}
                    sx={{ fontWeight: 700, height: 22 }}
                  />
                </Box>
              </Card>
            ))}
          </Box>
        </Card>
      )}
    </Box>
  );
};
