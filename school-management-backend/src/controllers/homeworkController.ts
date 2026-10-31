import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Homework } from '../types';

const homeworkCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  classId: z.string(),
  className: z.string(),
  section: z.string(),
  subjectName: z.string(),
  teacherName: z.string(),
  assignedDate: z.string(),
  dueDate: z.string(),
  totalSubmissions: z.number().int().nonnegative().optional(),
  maxSubmissions: z.number().int().positive().optional(),
  status: z.enum(['Active', 'Overdue', 'Closed']),
});

export const getHomeworkList = async (req: Request, res: Response) => {
  const { classId, status } = req.query as Record<string, string>;

  let homework = db.getHomework();

  if (classId && classId !== 'ALL') {
    homework = homework.filter((h) => h.classId === classId || h.className === classId);
  }

  if (status && status !== 'ALL') {
    homework = homework.filter((h) => h.status === status);
  }

  return res.json({
    success: true,
    total: homework.length,
    data: homework,
  });
};

export const getHomeworkById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const hw = db.getHomeworkById(id);

  if (!hw) {
    return res.status(404).json({ success: false, message: 'Homework assignment not found' });
  }

  return res.json({ success: true, data: hw });
};

export const createHomework = async (req: Request, res: Response) => {
  const data = homeworkCreateSchema.parse(req.body);

  const newHw: Homework = {
    ...data,
    id: `hw-${Date.now()}`,
    totalSubmissions: data.totalSubmissions ?? 0,
    maxSubmissions: data.maxSubmissions ?? 35,
  };

  db.addHomework(newHw);

  return res.status(201).json({
    success: true,
    message: `Assignment "${newHw.title}" published successfully`,
    data: newHw,
  });
};

export const updateHomework = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateHomework(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Homework not found' });
  }

  return res.json({
    success: true,
    message: 'Assignment updated successfully',
    data: updated,
  });
};

export const deleteHomework = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteHomework(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Homework not found' });
  }

  return res.json({
    success: true,
    message: 'Assignment removed successfully',
  });
};
