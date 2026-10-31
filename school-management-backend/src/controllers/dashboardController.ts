import { Request, Response } from 'express';
import { db } from '../database/db';

export const getDashboardStats = async (_req: Request, res: Response) => {
  const students = db.getStudents();
  const teachers = db.getTeachers();
  const classes = db.getClasses();
  const feeVouchers = db.getFeeVouchers();
  const exams = db.getExams();
  const events = db.getEvents();

  // Metrics from real data
  const activeStudents = students.filter((s) => s.status === 'Active');
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  const collectedFees = feeVouchers
    .filter((v) => v.status === 'Paid')
    .reduce((sum, v) => sum + v.netAmount, 0);

  const pendingFees = feeVouchers
    .filter((v) => v.status === 'Unpaid' || v.status === 'Overdue')
    .reduce((sum, v) => sum + v.netAmount, 0);

  const avgAttendance = activeStudents.length > 0
    ? Number((activeStudents.reduce((sum, s) => sum + (s.attendanceRate || 100), 0) / activeStudents.length).toFixed(1))
    : 100;

  // Recent Admissions
  const recentAdmissions = students.slice(0, 5);

  // Dynamic Recent Activities based on actual database records
  const recentActivities: any[] = [];

  students.slice(0, 3).forEach((s) => {
    recentActivities.push({
      id: `act-adm-${s.id}`,
      title: 'Student Enrolled',
      description: `${s.fullName} registered for ${s.className || 'School'}`,
      time: s.admissionDate ? `${s.admissionDate}` : 'Recently',
      type: 'admission',
      icon: 'UserPlus',
    });
  });

  feeVouchers.filter((v) => v.status === 'Paid').slice(0, 3).forEach((v) => {
    recentActivities.push({
      id: `act-fee-${v.id}`,
      title: 'Fee Payment Received',
      description: `${v.studentName} paid $${v.netAmount.toLocaleString()} via ${v.paymentMethod || 'Online'}`,
      time: v.paidDate || 'Recently',
      type: 'fee',
      icon: 'CreditCard',
    });
  });

  exams.slice(0, 2).forEach((e) => {
    recentActivities.push({
      id: `act-ex-${e.id}`,
      title: 'Exam Scheduled',
      description: `${e.title} (${e.term})`,
      time: e.startDate || 'Upcoming',
      type: 'exam',
      icon: 'Award',
    });
  });

  // Dynamic Monthly Fee Collections from real vouchers
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(currentMonthIdx - 5 + i);
    return {
      month: months[d.getMonth()],
      year: d.getFullYear(),
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    };
  });

  const monthlyFeeChartData = last6Months.map(({ month, key }) => {
    const vouchersInMonth = feeVouchers.filter((v) => (v.paidDate || v.dueDate || '').startsWith(key));
    const collected = vouchersInMonth
      .filter((v) => v.status === 'Paid')
      .reduce((sum, v) => sum + v.netAmount, 0);
    const pending = vouchersInMonth
      .filter((v) => v.status === 'Unpaid' || v.status === 'Overdue')
      .reduce((sum, v) => sum + v.netAmount, 0);
    return {
      month,
      collected,
      target: collected + pending,
      pending,
    };
  });

  const enrollmentChartData = last6Months.map(({ month }) => ({
    month,
    enrolled: totalStudents,
    capacity: classes.reduce((sum, c) => sum + c.capacity, 0) || 100,
  }));

  const attendanceRecords = db.getAttendance();
  const totalAttendanceLogged = attendanceRecords.length;

  const attendanceDistributionData = totalAttendanceLogged > 0
    ? [
        { name: 'Present', value: Number(((attendanceRecords.filter((a) => a.status === 'Present').length / totalAttendanceLogged) * 100).toFixed(1)), color: '#10b981' },
        { name: 'Absent', value: Number(((attendanceRecords.filter((a) => a.status === 'Absent').length / totalAttendanceLogged) * 100).toFixed(1)), color: '#ef4444' },
        { name: 'Late', value: Number(((attendanceRecords.filter((a) => a.status === 'Late').length / totalAttendanceLogged) * 100).toFixed(1)), color: '#f59e0b' },
        { name: 'Leave', value: Number(((attendanceRecords.filter((a) => a.status === 'Leave').length / totalAttendanceLogged) * 100).toFixed(1)), color: '#6366f1' },
      ]
    : [
        { name: 'Present', value: avgAttendance, color: '#10b981' },
        { name: 'Absent', value: Number(Math.max(0, 100 - avgAttendance).toFixed(1)), color: '#ef4444' },
        { name: 'Late', value: 0, color: '#f59e0b' },
        { name: 'Leave', value: 0, color: '#6366f1' },
      ];

  return res.json({
    success: true,
    data: {
      metrics: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalCollected: collectedFees,
        totalPending: pendingFees,
        averageAttendance: avgAttendance,
        activeEventsCount: events.length,
        upcomingExamsCount: exams.filter((e) => e.status === 'Upcoming').length,
      },
      recentAdmissions,
      recentActivities,
      charts: {
        enrollmentChartData,
        monthlyFeeChartData,
        attendanceDistributionData,
      },
    },
  });
};
