import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { Teacher } from '../types';
import { sendInvitationEmail } from '../services/emailService';

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
  sendInviteEmail: z.boolean().optional(),
});

const getTeacherPortalStatus = (
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

export const getTeachers = async (req: Request, res: Response) => {
  const { search, department, status } = req.query as Record<string, string>;

  let teachers = db.getTeachers();
  const users = db.getUsers();
  const invitations = db.getInvitations();

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

  const enriched = teachers.map((t) => ({
    ...t,
    portalStatus: getTeacherPortalStatus(t.email, users, invitations),
  }));

  return res.json({
    success: true,
    total: enriched.length,
    data: enriched,
  });
};

export const getTeacherById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const teacher = db.getTeacherById(id);

  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  }

  const users = db.getUsers();
  const invitations = db.getInvitations();

  return res.json({
    success: true,
    data: {
      ...teacher,
      portalStatus: getTeacherPortalStatus(teacher.email, users, invitations),
    },
  });
};

export const createTeacher = async (req: Request, res: Response) => {
  const parsed = teacherCreateSchema.parse(req.body);
  const { sendInviteEmail, ...data } = parsed;

  const employeeId = data.employeeId || `EMP-T-${Math.floor(200 + Math.random() * 800)}`;
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const newTeacher: Teacher = {
    ...data,
    id: `tch-${Date.now()}`,
    employeeId,
    fullName,
  };

  db.addTeacher(newTeacher);

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
        role: 'Teacher' as const,
        designation: data.designation || 'Faculty Instructor',
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
        role: 'Teacher',
        inviteLink,
      });

      inviteDispatched = emailResult.success;
      if (emailResult.success) {
        notice = ` Faculty portal invitation email dispatched to ${data.email}.`;
      } else {
        notice = ` Invitation generated (Notice: ${emailResult.error}).`;
      }
    }
  }

  const users = db.getUsers();
  const invitations = db.getInvitations();

  return res.status(201).json({
    success: true,
    message: `Faculty member "${newTeacher.fullName}" added successfully.${notice}`,
    data: {
      ...newTeacher,
      portalStatus: getTeacherPortalStatus(newTeacher.email, users, invitations),
    },
    inviteLink: inviteLink || undefined,
    inviteDispatched,
  });
};

export const inviteTeacher = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const teacher = db.getTeacherById(id);

  if (!teacher) {
    return res.status(404).json({ success: false, message: 'Teacher record not found' });
  }

  if (!teacher.email) {
    return res.status(400).json({ success: false, message: 'Teacher has no registered email address' });
  }

  const existingUser = db.findUserByEmail(teacher.email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: `Teacher account for ${teacher.email} is already active. No new invite needed.`,
    });
  }

  const token = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const invitation = {
    id: `inv-${Date.now()}`,
    name: teacher.fullName,
    email: teacher.email,
    role: 'Teacher' as const,
    designation: teacher.designation || 'Faculty Instructor',
    token,
    status: 'Pending' as const,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  db.addInvitation(invitation);
  const inviteLink = `${req.headers.origin || 'http://localhost:5173'}/setup-account?token=${token}`;

  const emailResult = await sendInvitationEmail({
    to: teacher.email,
    name: teacher.fullName,
    role: 'Teacher',
    inviteLink,
  });

  return res.json({
    success: true,
    message: emailResult.success
      ? `Invitation email successfully sent to ${teacher.email}`
      : `Invitation link generated: ${inviteLink}. (Email note: ${emailResult.error})`,
    inviteLink,
    emailDispatched: emailResult.success,
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
  const users = db.getUsers();
  const invitations = db.getInvitations();

  return res.json({
    success: true,
    message: 'Faculty record updated successfully',
    data: updated
      ? { ...updated, portalStatus: getTeacherPortalStatus(updated.email, users, invitations) }
      : null,
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
