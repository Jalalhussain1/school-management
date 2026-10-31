import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Users,
  GraduationCap,
  Layers,
  DollarSign,
  CalendarCheck,
  AlertCircle,
  Plus,
  ArrowRight,
  Calendar,
  CreditCard,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { useNavigate } from 'react-router-dom';
import { AppPageTitle } from '../../components/common/AppPageTitle';
import { StatCard } from '../../components/common/StatCard';
import { DashboardChart } from '../../components/common/DashboardChart';
import { AppButton } from '../../components/common/AppButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { api } from '../../services/api';

interface DashboardData {
  metrics: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalCollected: number;
    totalPending: number;
    averageAttendance: number;
    activeEventsCount: number;
    upcomingExamsCount: number;
  };
  recentAdmissions: any[];
  recentActivities: any[];
  charts: {
    enrollmentChartData: { month: string; enrolled: number; capacity: number }[];
    monthlyFeeChartData: { month: string; collected: number; target: number; pending: number }[];
    attendanceDistributionData: { name: string; value: number; color: string }[];
  };
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dashboard.getStats()
      .then((res) => {
        if (res.success) setDashData(res.data as DashboardData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const metrics = dashData?.metrics;
  const recentAdmissions = dashData?.recentAdmissions ?? [];
  const recentActivities = dashData?.recentActivities ?? [];
  const enrollmentChartData = dashData?.charts?.enrollmentChartData ?? [];
  const monthlyFeeChartData = dashData?.charts?.monthlyFeeChartData ?? [];
  const attendanceDistributionData = dashData?.charts?.attendanceDistributionData ?? [
    { name: 'Present', value: 100, color: '#10b981' },
    { name: 'Absent', value: 0, color: '#ef4444' },
    { name: 'Late', value: 0, color: '#f59e0b' },
    { name: 'Leave', value: 0, color: '#6366f1' },
  ];

  const avgAttendance = metrics?.averageAttendance ?? 0;

  return (
    <Box>
      {/* Page Title & Quick Actions */}
      <AppPageTitle
        title="School Executive Overview"
        subtitle="Real-time academic performance, financial metrics, and campus intelligence"
        actions={
          <>
            <AppButton
              variant="outlined"
              color="inherit"
              icon={<Calendar size={16} />}
              onClick={() => navigate('/timetable')}
            >
              Master Schedule
            </AppButton>
            <AppButton
              variant="contained"
              color="primary"
              icon={<Plus size={16} />}
              onClick={() => navigate('/students')}
            >
              Enroll Student
            </AppButton>
          </>
        }
      />

      {/* 6 Key Stat Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          },
          gap: 2,
          mb: 3.5,
        }}
      >
        <StatCard
          title="Total Students"
          value={(metrics?.totalStudents ?? 0).toLocaleString()}
          icon={<Users size={22} />}
          color="primary"
        />
        <StatCard
          title="Faculty & Staff"
          value={(metrics?.totalTeachers ?? 0).toLocaleString()}
          icon={<GraduationCap size={22} />}
          color="secondary"
        />
        <StatCard
          title="Active Classes"
          value={(metrics?.totalClasses ?? 0).toString()}
          icon={<Layers size={22} />}
          footerText="Grade 1 to Grade 12"
          color="info"
        />
        <StatCard
          title="Fee Collection"
          value={formatCurrency(metrics?.totalCollected ?? 0)}
          icon={<DollarSign size={22} />}
          color="success"
        />
        <StatCard
          title="Attendance Rate"
          value={`${avgAttendance}%`}
          icon={<CalendarCheck size={22} />}
          color="success"
        />
        <StatCard
          title="Pending Dues"
          value={formatCurrency(metrics?.totalPending ?? 0)}
          icon={<AlertCircle size={22} />}
          color="warning"
        />
      </Box>

      {/* Primary Analytics Charts Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
          mb: 3.5,
        }}
      >
        {/* Student Enrollment Trend */}
        <DashboardChart
          title="Student Enrollment Growth"
          subtitle="Total enrolled students vs school maximum capacity"
          action={
            <Chip
              label="Live Data"
              size="small"
              color="primary"
              sx={{ fontWeight: 600, fontSize: '0.75rem' }}
            />
          }
        >
          {enrollmentChartData.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
              <Typography variant="body2">No enrollment data yet. Add students and classes to see trends.</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  formatter={(value: unknown) => [typeof value === 'number' ? value.toLocaleString() : String(value ?? ''), 'Students']}
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#enrollGrad)"
                  name="Enrolled"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </DashboardChart>

        {/* Daily Attendance Breakdown Donut */}
        <DashboardChart
          title="Attendance Distribution"
          subtitle="Average daily status breakdown across all classes"
          action={
            <AppButton
              size="small"
              variant="text"
              onClick={() => navigate('/attendance')}
              sx={{ fontSize: '0.75rem' }}
            >
              View Roster
            </AppButton>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceDistributionData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
              >
                {attendanceDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: unknown) => [`${value}%`, 'Percentage']}
                contentStyle={{ borderRadius: 8 }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(val: string) => <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardChart>
      </Box>

      {/* Secondary Financial & Activity Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          mb: 3.5,
        }}
      >
        {/* Monthly Fee Collection vs Target */}
        <DashboardChart
          title="Monthly Fee Collections"
          subtitle="Collected payments compared to projected budget targets"
          action={
            <AppButton
              size="small"
              variant="text"
              onClick={() => navigate('/fees')}
              sx={{ fontSize: '0.75rem' }}
            >
              Fee Center
            </AppButton>
          }
        >
          {monthlyFeeChartData.length === 0 || monthlyFeeChartData.every(m => m.collected === 0 && m.pending === 0) ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
              <Typography variant="body2">No fee data yet. Create fee vouchers to see collections.</Typography>
            </Box>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFeeChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <RechartsTooltip
                  formatter={(val: unknown) => [formatCurrency(Number(val) || 0), 'Amount']}
                  contentStyle={{ borderRadius: 8 }}
                />
                <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </DashboardChart>

        {/* Live Campus Activity Feed */}
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Campus Activity
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Real-time operational events and administrative updates
                </Typography>
              </Box>
              <Chip label="Live Feed" size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
            </Box>

            {recentActivities.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="body2">No recent activity yet.</Typography>
                <Typography variant="caption">Start by adding students, fees, or exams.</Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {recentActivities.map((act: any, idx: number) => (
                  <React.Fragment key={act.id}>
                    <ListItem sx={{ px: 0, py: 1.2 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              act.type === 'admission'
                                ? 'rgba(37, 99, 235, 0.1)'
                                : act.type === 'fee'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : act.type === 'attendance'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(99, 102, 241, 0.1)',
                            color:
                              act.type === 'admission'
                                ? 'primary.main'
                                : act.type === 'fee'
                                ? 'success.main'
                                : act.type === 'attendance'
                                ? 'warning.main'
                                : 'secondary.main',
                            width: 38,
                            height: 38,
                          }}
                        >
                          {act.type === 'admission' ? (
                            <Users size={18} />
                          ) : act.type === 'fee' ? (
                            <CreditCard size={18} />
                          ) : act.type === 'attendance' ? (
                            <CalendarCheck size={18} />
                          ) : act.type === 'library' ? (
                            <BookOpen size={18} />
                          ) : (
                            <Award size={18} />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {act.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {act.description}
                          </Typography>
                        }
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.725rem', whiteSpace: 'nowrap' }}>
                        {act.time}
                      </Typography>
                    </ListItem>
                    {idx < recentActivities.length - 1 && <Divider component="li" sx={{ opacity: 0.5 }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Bottom Grid: Recent Admissions & Upcoming Events */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Recent Student Admissions */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Student Admissions
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Newly enrolled students
                </Typography>
              </Box>
              <AppButton
                size="small"
                variant="text"
                onClick={() => navigate('/students')}
                endIcon={<ArrowRight size={14} />}
                sx={{ fontSize: '0.75rem' }}
              >
                All Students
              </AppButton>
            </Box>

            {recentAdmissions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="body2">No students enrolled yet.</Typography>
                <AppButton
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/students')}
                  sx={{ mt: 1.5 }}
                >
                  Enroll First Student
                </AppButton>
              </Box>
            ) : (
              <List dense disablePadding>
                {recentAdmissions.map((std: any) => (
                  <ListItem
                    key={std.id}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      mb: 0.5,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={std.avatar} sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                        {std.firstName?.[0] ?? '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {std.fullName}
                          </Typography>
                          <Chip
                            label={std.className}
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={`Adm No: ${std.admissionNo} • Roll: ${std.rollNo}`}
                    />
                    <StatusBadge status={std.status} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Exams & School Events */}
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Upcoming Events & Examinations
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Academic timeline and scheduled school calendar milestones
                </Typography>
              </Box>
              <AppButton
                size="small"
                variant="text"
                onClick={() => navigate('/announcements')}
                endIcon={<ChevronRight size={14} />}
                sx={{ fontSize: '0.75rem' }}
              >
                Full Calendar
              </AppButton>
            </Box>

            {(!dashData?.recentActivities || dashData.recentActivities.filter((a: any) => a.type === 'exam').length === 0) &&
            metrics?.activeEventsCount === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="body2">No upcoming events or exams scheduled.</Typography>
                <AppButton
                  size="small"
                  variant="outlined"
                  onClick={() => navigate('/examinations')}
                  sx={{ mt: 1.5 }}
                >
                  Schedule Exam
                </AppButton>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="body2">
                  {metrics?.upcomingExamsCount ?? 0} upcoming exam(s) • {metrics?.activeEventsCount ?? 0} active event(s)
                </Typography>
                <AppButton
                  size="small"
                  variant="text"
                  onClick={() => navigate('/examinations')}
                  sx={{ mt: 1 }}
                >
                  View Examinations →
                </AppButton>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
