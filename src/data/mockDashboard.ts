export interface EnrollmentData {
  month: string;
  enrolled: number;
  capacity: number;
}

export interface MonthlyFeeCollection {
  month: string;
  collected: number;
  target: number;
  pending: number;
}

export interface AttendanceBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'admission' | 'fee' | 'attendance' | 'exam' | 'library';
  icon: string;
}

export const enrollmentChartData: EnrollmentData[] = [
  { month: 'Jun', enrolled: 1320, capacity: 1550 },
  { month: 'Jul', enrolled: 1360, capacity: 1550 },
  { month: 'Aug', enrolled: 1440, capacity: 1550 },
  { month: 'Sep', enrolled: 1465, capacity: 1550 },
  { month: 'Oct', enrolled: 1480, capacity: 1550 },
];

export const monthlyFeeChartData: MonthlyFeeCollection[] = [
  { month: 'May', collected: 72000, target: 80000, pending: 8000 },
  { month: 'Jun', collected: 68000, target: 75000, pending: 7000 },
  { month: 'Jul', collected: 81000, target: 85000, pending: 4000 },
  { month: 'Aug', collected: 94000, target: 95000, pending: 1000 },
  { month: 'Sep', collected: 88500, target: 90000, pending: 1500 },
  { month: 'Oct', collected: 84200, target: 92000, pending: 7800 },
];

export const attendanceDistributionData: AttendanceBreakdown[] = [
  { name: 'Present', value: 92.4, color: '#10b981' },
  { name: 'Absent', value: 3.8, color: '#ef4444' },
  { name: 'Late', value: 2.2, color: '#f59e0b' },
  { name: 'Leave', value: 1.6, color: '#6366f1' },
];

export const recentActivities: RecentActivity[] = [
  {
    id: 'act-1',
    title: 'New Student Admitted',
    description: 'Lucas Anderson enrolled into Grade 9-A',
    time: '18 minutes ago',
    type: 'admission',
    icon: 'UserPlus',
  },
  {
    id: 'act-2',
    title: 'Term Fee Received',
    description: 'Sophia Chen paid $1,200 via Credit Card',
    time: '42 minutes ago',
    type: 'fee',
    icon: 'CreditCard',
  },
  {
    id: 'act-3',
    title: 'Daily Attendance Finalized',
    description: 'Grade 10-A attendance confirmed by Eleanor Patterson',
    time: '1 hour ago',
    type: 'attendance',
    icon: 'CalendarCheck',
  },
  {
    id: 'act-4',
    title: 'Report Cards Published',
    description: 'Q1 Diagnostic Assessment results published to student portal',
    time: '3 hours ago',
    type: 'exam',
    icon: 'Award',
  },
  {
    id: 'act-5',
    title: 'Library Book Issued',
    description: 'Alexander Wright borrowed "The C Programming Language"',
    time: '4 hours ago',
    type: 'library',
    icon: 'BookOpen',
  },
];
