import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Student } from '../types';
import { sendInvitationEmail } from '../services/emailService';

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
  sendInviteEmail: z.boolean().optional(),
});

const getStudentPortalStatus = (
  email: string,
  users: ReturnType<typeof db.getUsers>,
  invitations: ReturnType<typeof db.getInvitations>
): 'Active' | 'Pending' | 'Not Invited' => {
  if (!email) return 'Not Invited';
  const normEmail = email.toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normEmail);
  if (user) return 'Active';

  const pendingInv = invitations.find(
    (inv) => inv.email.toLowerCase() === normEmail && inv.status === 'Pending'
  );
  if (pendingInv) return 'Pending';

  return 'Not Invited';
};

export const getStudents = async (req: Request, res: Response) => {
  const { search, classFilter, statusFilter, genderFilter, page, pageSize } = req.query as Record<string, string>;

  let students = db.getStudents();
  const users = db.getUsers();
  const invitations = db.getInvitations();

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

  const enriched = students.map((s) => ({
    ...s,
    portalStatus: getStudentPortalStatus(s.email, users, invitations),
  }));

  const total = enriched.length;

  if (page && pageSize) {
    const p = Math.max(1, parseInt(page, 10));
    const size = Math.max(1, parseInt(pageSize, 10));
    const start = (p - 1) * size;
    const paginated = enriched.slice(start, start + size);

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
    data: enriched,
  });
};

export const getStudentById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const student = db.getStudentById(id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  const users = db.getUsers();
  const invitations = db.getInvitations();

  return res.json({
    success: true,
    data: {
      ...student,
      portalStatus: getStudentPortalStatus(student.email, users, invitations),
    },
  });
};

export const createStudent = async (req: Request, res: Response) => {
  const parsed = studentCreateSchema.parse(req.body);
  const { sendInviteEmail, ...data } = parsed;

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

  let inviteDispatched = false;
  let inviteLink = '';
  let notice = '';

  // Trigger automatic invitation email if enabled and email exists
  if (sendInviteEmail !== false && data.email) {
    const existingUser = db.findUserByEmail(data.email);
    if (!existingUser) {
      const token = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const invitation = {
        id: `inv-${Date.now()}`,
        name: fullName,
        email: data.email,
        role: 'Student' as const,
        designation: `Student (${data.className || 'General'})`,
        token,
        status: 'Pending' as const,
        createdAt: new Date().toISOString(),
        expiresAt,
      };

      db.addInvitation(invitation);
      inviteLink = `${req.headers.origin || 'http://localhost:5173'}/setup-account?token=${token}`;

      const emailResult = await sendInvitationEmail({
        to: data.email,
        name: fullName,
        role: 'Student',
        inviteLink,
      });

      inviteDispatched = emailResult.success;
      if (emailResult.success) {
        notice = ` Setup invitation email dispatched to ${data.email}.`;
      } else {
        notice = ` Invitation generated (Notice: ${emailResult.error}).`;
      }
    }
  }

  const users = db.getUsers();
  const invitations = db.getInvitations();

  return res.status(201).json({
    success: true,
    message: `Student "${newStudent.fullName}" created successfully.${notice}`,
    data: {
      ...newStudent,
      portalStatus: getStudentPortalStatus(newStudent.email, users, invitations),
    },
    inviteLink: inviteLink || undefined,
    inviteDispatched,
  });
};

export const inviteStudent = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const student = db.getStudentById(id);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student record not found' });
  }

  if (!student.email) {
    return res.status(400).json({ success: false, message: 'Student has no registered email address' });
  }

  const existingUser = db.findUserByEmail(student.email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: `Student account for ${student.email} is already active. No new invite needed.`,
    });
  }

  const token = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const invitation = {
    id: `inv-${Date.now()}`,
    name: student.fullName,
    email: student.email,
    role: 'Student' as const,
    designation: `Student (${student.className || 'General'})`,
    token,
    status: 'Pending' as const,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  db.addInvitation(invitation);
  const inviteLink = `${req.headers.origin || 'http://localhost:5173'}/setup-account?token=${token}`;

  const emailResult = await sendInvitationEmail({
    to: student.email,
    name: student.fullName,
    role: 'Student',
    inviteLink,
  });

  return res.json({
    success: true,
    message: emailResult.success
      ? `Invitation email successfully sent to ${student.email}`
      : `Invitation link generated: ${inviteLink}. (Email note: ${emailResult.error})`,
    inviteLink,
    emailDispatched: emailResult.success,
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
  const users = db.getUsers();
  const invitations = db.getInvitations();

  return res.json({
    success: true,
    message: 'Student record updated successfully',
    data: updated
      ? { ...updated, portalStatus: getStudentPortalStatus(updated.email, users, invitations) }
      : null,
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
