import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { TimetableSlot } from '../types';

const timetableCreateSchema = z.object({
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  periodNumber: z.number().int().positive(),
  startTime: z.string(),
  endTime: z.string(),
  classId: z.string(),
  className: z.string(),
  section: z.string(),
  subjectCode: z.string(),
  subjectName: z.string(),
  teacherId: z.string(),
  teacherName: z.string(),
  roomNumber: z.string(),
});

export const getTimetable = async (req: Request, res: Response) => {
  const { classId, teacherId, dayOfWeek } = req.query as Record<string, string>;

  let slots = db.getTimetableSlots();

  if (classId && classId !== 'ALL') {
    slots = slots.filter((s) => s.classId === classId || s.className === classId);
  }

  if (teacherId && teacherId !== 'ALL') {
    slots = slots.filter((s) => s.teacherId === teacherId);
  }

  if (dayOfWeek && dayOfWeek !== 'ALL') {
    slots = slots.filter((s) => s.dayOfWeek === dayOfWeek);
  }

  return res.json({
    success: true,
    total: slots.length,
    data: slots,
  });
};

export const createTimetableSlot = async (req: Request, res: Response) => {
  const data = timetableCreateSchema.parse(req.body);

  const newSlot: TimetableSlot = {
    ...data,
    id: `tt-${Date.now()}`,
  };

  db.addTimetableSlot(newSlot);

  return res.status(201).json({
    success: true,
    message: 'Timetable period scheduled successfully',
    data: newSlot,
  });
};

export const updateTimetableSlot = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateTimetableSlot(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Timetable slot not found' });
  }

  return res.json({
    success: true,
    message: 'Timetable slot updated successfully',
    data: updated,
  });
};

export const deleteTimetableSlot = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteTimetableSlot(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Timetable slot not found' });
  }

  return res.json({
    success: true,
    message: 'Timetable slot deleted successfully',
  });
};
