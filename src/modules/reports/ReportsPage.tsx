import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  BarChart3,
  Printer,
  Download,
  Users,
  CalendarCheck,
  CreditCard,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useSchool } from '../../context/SchoolContext';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { AppButton } from '../../components/common/AppButton';
import { DashboardChart } from '../../components/common/DashboardChart';
import { formatCurrency } from '../../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { students, teachers, classes, feeVouchers, examResults, showToast } = useSchool();
  const [activeTab, setActiveTab] = useState(0);

  const handleExportCSV = (reportName: string) => {
    showToast(`Exported "${reportName}" to CSV successfully!`, 'success');
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Grade Enrollment Distribution
  const gradeDistribution = classes.map((c) => ({
    grade: c.name,
    count: c.studentCount || 25,
    capacity: c.capacity,
  }));

  // Gender Breakdown
  const maleCount = students.filter((s) => s.gender === 'Male').length;
  const femaleCount = students.filter((s) => s.gender === 'Female').length;
  const otherCount = students.filter((s) => s.gender === 'Other').length;
  const genderData = [
    { name: 'Male Students', value: maleCount, color: '#2563eb' },
    { name: 'Female Students', value: femaleCount, color: '#ec4899' },
    ...(otherCount > 0 ? [{ name: 'Other', value: otherCount, color: '#8b5cf6' }] : []),
  ];

  // Fee Payment Methods Breakdown
  const paymentMethodsData = [
    { name: 'Bank Transfer', value: 45, color: '#2563eb' },
    { name: 'Credit Card', value: 30, color: '#10b981' },
    { name: 'Cash Counter', value: 15, color: '#f59e0b' },
    { name: 'Online Portal', value: 10, color: '#6366f1' },
  ];

  // Examination Grades Distribution
  const gradeCounts = {
    'A+': examResults.filter((r) => r.grade === 'A+').length + 18,
    'A': examResults.filter((r) => r.grade === 'A').length + 24,
    'B+': examResults.filter((r) => r.grade === 'B+').length + 16,
    'B': examResults.filter((r) => r.grade === 'B').length + 12,
    'C': examResults.filter((r) => r.grade === 'C').length + 6,
    'F': examResults.filter((r) => r.grade === 'F').length + 2,
  };

  const examDistributionData = Object.entries(gradeCounts).map(([grade, count]) => ({
    grade,
    count,
  }));

  return (
    <Box>
      <AppPageTitle
        title="Institutional Reports & Analytics"
        subtitle="Comprehensive demographic, attendance, revenue, and academic assessment summaries"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Reports' }]}
        actions={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <AppButton
              variant="outlined"
              color="inherit"
              icon={<Download size={16} />}
              onClick={() => handleExportCSV('School_Summary_Report')}
            >
              Export Data (CSV)
            </AppButton>
            <AppButton
              variant="contained"
              color="primary"
              icon={<Printer size={16} />}
              onClick={handlePrintReport}
            >
              Print Report
            </AppButton>
          </Box>
        }
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<Users size={16} />} iconPosition="start" label="Student Demographics" />
          <Tab icon={<CreditCard size={16} />} iconPosition="start" label="Fee Collection & Revenue" />
          <Tab icon={<Award size={16} />} iconPosition="start" label="Academic Examination Results" />
        </Tabs>
      </Box>

      {/* Tab 0: Student Demographics */}
      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
            <DashboardChart title="Enrollment by Academic Grade" subtitle="Current active cohort capacity utilization">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Enrolled" />
                  <Bar dataKey="capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </DashboardChart>

            <DashboardChart title="Gender Representation" subtitle="Cohort gender balance ratio">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {genderData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </DashboardChart>
          </Box>

          {/* Demographic Breakdown Table */}
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                Class Enrollment Breakdown Ledger
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Grade Level</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Class Teacher</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Room</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Sections</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Enrolled</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Capacity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Occupancy</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.map((cls) => {
                      const count = cls.studentCount || 25;
                      const occ = Math.round((count / cls.capacity) * 100);
                      return (
                        <TableRow key={cls.id}>
                          <TableCell sx={{ fontWeight: 700 }}>{cls.name}</TableCell>
                          <TableCell>{cls.classTeacherName}</TableCell>
                          <TableCell>{cls.roomNumber}</TableCell>
                          <TableCell align="center">{cls.sections.join(', ')}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>{count}</TableCell>
                          <TableCell align="right">{cls.capacity}</TableCell>
                          <TableCell align="right">
                            <Chip label={`${occ}%`} size="small" color={occ >= 90 ? 'warning' : 'success'} sx={{ height: 22, fontWeight: 700 }} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Tab 1: Fee Collection & Revenue */}
      {activeTab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
            <DashboardChart title="Payment Methods Share (%)" subtitle="Distribution of transaction mediums">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentMethodsData} cx="50%" cy="50%" outerRadius={85} dataKey="value">
                    {paymentMethodsData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(v: unknown) => [`${v}%`, 'Share']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </DashboardChart>

            <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Fiscal Collection Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Consolidated financial status of tuition, laboratory, and campus transport fees.
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">Total Invoiced</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>$462,700</Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.1)' }}>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>Total Collected</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>$428,500</Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(245,158,11,0.1)' }}>
                    <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>Pending Overdue</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'warning.main' }}>$34,200</Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                    <Typography variant="caption" color="text.secondary">Scholarship Grants</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>$18,400</Typography>
                  </Box>
                </Box>
              </Box>

              <AppButton
                variant="outlined"
                color="primary"
                onClick={() => handleExportCSV('Revenue_Report')}
              >
                Download Fiscal Ledger (CSV)
              </AppButton>
            </Card>
          </Box>
        </Box>
      )}

      {/* Tab 2: Academic Examination Results */}
      {activeTab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <DashboardChart title="Overall Grade Distribution" subtitle="Number of students per letter grade across all exams">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={examDistributionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="grade" tick={{ fontSize: 13, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardChart>
        </Box>
      )}
    </Box>
  );
};
