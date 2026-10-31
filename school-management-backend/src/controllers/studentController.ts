import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Student } from '../types';

const studentCreateSchema = z.object({
  admissionNo: z.string().optional(),
  rollNo: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  gender: z.enum(['Male', 'Female', 'Other']),
  dateOfBirth: z.string(),
  bloodGroup: z.string(),
  classId: z.string(),
  className: z.string(),
  section: z.string(),
  address: z.string(),
  parentName: z.string(),
  parentRelation: z.string(),
  parentPhone: z.string(),
  parentEmail: z.string(),
  admissionDate: z.string(),
  status: z.enum(['Active', 'Inactive', 'Graduated']),
  avatar: z.string().optional(),
  emergencyContact: z.string(),
  attendanceRate: z.number().optional(),
  totalFeeDue: z.number().optional(),
});

export const getStudents = async (req: Request, res: Response) => {
  const { search, classFilter, statusFilter, genderFilter, page, pageSize } = req.query as Record<string, string>;

  let students = db.getStudents();

  if (search) {
    const q = search.toLowerCase();
    students = students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }

  if (classFilter && classFilter !== 'ALL') {
    students = students.filter((s) => s.className === classFilter || s.classId === classFilter);
  }

  if (statusFilter && statusFilter !== 'ALL') {
    students = students.filter((s) => s.status === statusFilter);
  }

  if (genderFilter && genderFilter !== 'ALL') {
    students = students.filter((s) => s.gender === genderFilter);
  }

  const total = students.length;

  if (page && pageSize) {
    const p = Math.max(1, parseInt(page, 10));
    const size = Math.max(1, parseInt(pageSize, 10));
    const start = (p - 1) * size;
    const paginated = students.slice(start, start + size);

    return res.json({
      success: true,
      total,
      page: p,
      pageSize: size,
      totalPages: Math.ceil(total / size),
      data: paginated,
    });
  }

  return res.json({
    success: true,
    total,
    data: students,
  });
};

export const getStudentById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const student = db.getStudentById(id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  return res.json({ success: true, data: student });
};

export const createStudent = async (req: Request, res: Response) => {
  const data = studentCreateSchema.parse(req.body);

  const admissionNo = data.admissionNo || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`;
  const rollNo = data.rollNo || `RN-${Math.floor(10 + Math.random() * 90)}`;
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const newStudent: Student = {
    ...data,
    id: `std-${Date.now()}`,
    admissionNo,
    rollNo,
    fullName,
    attendanceRate: data.attendanceRate ?? 100,
    totalFeeDue: data.totalFeeDue ?? 0,
  };

  db.addStudent(newStudent);

  return res.status(201).json({
    success: true,
    message: `Student "${newStudent.fullName}" created successfully`,
    data: newStudent,
  });
};

export const updateStudent = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const existing = db.getStudentById(id);

  if (!existing) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const updates = req.body;
  if (updates.firstName || updates.lastName) {
    const firstName = updates.firstName ?? existing.firstName;
    const lastName = updates.lastName ?? existing.lastName;
    updates.fullName = `${firstName} ${lastName}`.trim();
  }

  const updated = db.updateStudent(id, updates);

  return res.json({
    success: true,
    message: 'Student record updated successfully',
    data: updated,
  });
};

export const deleteStudent = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteStudent(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  return res.json({
    success: true,
    message: 'Student deleted successfully',
  });
};
