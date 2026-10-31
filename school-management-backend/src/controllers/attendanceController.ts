import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { AttendanceRecord } from '../types';

const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  rollNo: z.string(),
  classId: z.string(),
  section: z.string(),
  status: z.enum(['Present', 'Absent', 'Late', 'Leave']),
  remarks: z.string().optional(),
});

const batchSaveSchema = z.object({
  records: z.array(attendanceRecordSchema),
});

export const getAttendance = async (req: Request, res: Response) => {
  const { date, classId, section, studentId } = req.query as Record<string, string>;

  let records = db.getAttendance();

  if (date) {
    records = records.filter((r) => r.date === date);
  }

  if (classId && classId !== 'ALL') {
    records = records.filter((r) => r.classId === classId);
  }

  if (section && section !== 'ALL') {
    records = records.filter((r) => r.section === section);
  }

  if (studentId) {
    records = records.filter((r) => r.studentId === studentId);
  }

  return res.json({
    success: true,
    total: records.length,
    data: records,
  });
};

export const batchSaveAttendance = async (req: Request, res: Response) => {
  const { records } = batchSaveSchema.parse(req.body);

  const formattedRecords: AttendanceRecord[] = records.map((r) => ({
    ...r,
    id: r.id || `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  }));

  const allRecords = db.batchSaveAttendance(formattedRecords);

  return res.json({
    success: true,
    message: `Saved attendance batch for ${records.length} students`,
    data: allRecords,
  });
};

export const getAttendanceSummary = async (req: Request, res: Response) => {
  const { date } = req.query as { date?: string };
  const targetDate = date || new Date().toISOString().split('T')[0];

  const records = db.getAttendance().filter((r) => r.date === targetDate);
  const total = records.length;

  if (total === 0) {
    return res.json({
      success: true,
      date: targetDate,
      summary: {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        presentPercentage: 100,
      },
    });
  }

  const present = records.filter((r) => r.status === 'Present').length;
  const absent = records.filter((r) => r.status === 'Absent').length;
  const late = records.filter((r) => r.status === 'Late').length;
  const leave = records.filter((r) => r.status === 'Leave').length;

  return res.json({
    success: true,
    date: targetDate,
    summary: {
      total,
      present,
      absent,
      late,
      leave,
      presentPercentage: Number(((present / total) * 100).toFixed(1)),
    },
  });
};
