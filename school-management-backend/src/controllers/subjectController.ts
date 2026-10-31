import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Subject } from '../types';

const subjectCreateSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  department: z.string().min(1),
  type: z.enum(['Core', 'Elective']),
  weeklyHours: z.number().positive(),
  assignedTeacherIds: z.array(z.string()),
  assignedClassIds: z.array(z.string()),
});

export const getSubjects = async (_req: Request, res: Response) => {
  const subjects = db.getSubjects();
  return res.json({ success: true, total: subjects.length, data: subjects });
};

export const getSubjectById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const subject = db.getSubjectById(id);

  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  return res.json({ success: true, data: subject });
};

export const createSubject = async (req: Request, res: Response) => {
  const data = subjectCreateSchema.parse(req.body);

  const newSubject: Subject = {
    ...data,
    id: `sbj-${Date.now()}`,
  };

  db.addSubject(newSubject);

  return res.status(201).json({
    success: true,
    message: `Subject "${newSubject.name}" created successfully`,
    data: newSubject,
  });
};

export const updateSubject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateSubject(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  return res.json({
    success: true,
    message: 'Subject updated successfully',
    data: updated,
  });
};

export const deleteSubject = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteSubject(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  return res.json({
    success: true,
    message: 'Subject deleted successfully',
  });
};
