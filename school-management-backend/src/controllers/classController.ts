import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { SchoolClass } from '../types';

const classCreateSchema = z.object({
  name: z.string().min(1),
  numericGrade: z.number(),
  sections: z.array(z.string()).min(1),
  classTeacherId: z.string(),
  classTeacherName: z.string(),
  roomNumber: z.string(),
  capacity: z.number().positive(),
  studentCount: z.number().optional(),
});

export const getClasses = async (_req: Request, res: Response) => {
  const classes = db.getClasses();
  return res.json({ success: true, total: classes.length, data: classes });
};

export const getClassById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const cls = db.getClassById(id);

  if (!cls) {
    return res.status(404).json({ success: false, message: 'Class not found' });
  }

  return res.json({ success: true, data: cls });
};

export const createClass = async (req: Request, res: Response) => {
  const data = classCreateSchema.parse(req.body);

  const newCls: SchoolClass = {
    ...data,
    id: `cls-${Date.now()}`,
    studentCount: data.studentCount ?? 0,
  };

  db.addClass(newCls);

  return res.status(201).json({
    success: true,
    message: `Class "${newCls.name}" added successfully`,
    data: newCls,
  });
};

export const updateClass = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateClass(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Class not found' });
  }

  return res.json({
    success: true,
    message: 'Class updated successfully',
    data: updated,
  });
};

export const deleteClass = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteClass(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Class not found' });
  }

  return res.json({
    success: true,
    message: 'Class deleted successfully',
  });
};
