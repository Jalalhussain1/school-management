import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Teacher } from '../types';

const teacherCreateSchema = z.object({
  employeeId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  gender: z.enum(['Male', 'Female', 'Other']),
  designation: z.string(),
  department: z.string(),
  qualification: z.string(),
  joiningDate: z.string(),
  salary: z.number(),
  status: z.enum(['Active', 'On Leave', 'Resigned']),
  subjects: z.array(z.string()),
  avatar: z.string().optional(),
  address: z.string().optional(),
});

export const getTeachers = async (req: Request, res: Response) => {
  const { search, department, status } = req.query as Record<string, string>;

  let teachers = db.getTeachers();

  if (search) {
    const q = search.toLowerCase();
    teachers = teachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
    );
  }

  if (department && department !== 'ALL') {
    teachers = teachers.filter((t) => t.department === department);
  }

  if (status && status !== 'ALL') {
    teachers = teachers.filter((t) => t.status === status);
  }

  return res.json({
    success: true,
    total: teachers.length,
    data: teachers,
  });
};

export const getTeacherById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const teacher = db.getTeacherById(id);

  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  return res.json({ success: true, data: teacher });
};

export const createTeacher = async (req: Request, res: Response) => {
  const data = teacherCreateSchema.parse(req.body);

  const employeeId = data.employeeId || `EMP-T-${Math.floor(200 + Math.random() * 800)}`;
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const newTeacher: Teacher = {
    ...data,
    id: `tch-${Date.now()}`,
    employeeId,
    fullName,
  };

  db.addTeacher(newTeacher);

  return res.status(201).json({
    success: true,
    message: `Faculty member "${newTeacher.fullName}" added successfully`,
    data: newTeacher,
  });
};

export const updateTeacher = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const existing = db.getTeacherById(id);

  if (!existing) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  const updates = req.body;
  if (updates.firstName || updates.lastName) {
    const firstName = updates.firstName ?? existing.firstName;
    const lastName = updates.lastName ?? existing.lastName;
    updates.fullName = `${firstName} ${lastName}`.trim();
  }

  const updated = db.updateTeacher(id, updates);

  return res.json({
    success: true,
    message: 'Faculty record updated successfully',
    data: updated,
  });
};

export const deleteTeacher = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteTeacher(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  return res.json({
    success: true,
    message: 'Faculty deleted successfully',
  });
};
