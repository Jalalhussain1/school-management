import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../database/db';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';
import { User, UserRole } from '../types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['Admin', 'Teacher', 'Student', 'Parent']).optional(),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Admin', 'Teacher', 'Student', 'Parent']),
  avatar: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  className: z.string().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = loginSchema.parse(req.body);

  const user = db.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials: No account found with this email',
    });
  }

  // If role is specified and does not match
  if (role && user.role !== role) {
    return res.status(401).json({
      success: false,
      message: `Account is registered as ${user.role}, not ${role}`,
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid password. Please check your credentials.',
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      designation: user.designation,
      department: user.department,
      className: user.className,
    },
  });
};

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const existing = db.findUserByEmail(data.email);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists',
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(data.password, salt);

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role,
    avatar: data.avatar,
    designation: data.designation || (data.role === 'Admin' ? 'Administrator' : data.role === 'Teacher' ? 'Faculty Instructor' : data.role),
    department: data.department,
    className: data.className,
    createdAt: new Date().toISOString(),
  };

  db.addUser(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      designation: newUser.designation,
      department: newUser.department,
      className: newUser.className,
    },
  });
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }

  return res.json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }

  const { name, avatar } = req.body;
  const updates: Partial<User> = {};
  if (typeof name === 'string' && name.trim()) updates.name = name.trim();
  if (typeof avatar === 'string') updates.avatar = avatar;

  const updatedUser = db.updateUser(req.user.id, updates);
  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      designation: updatedUser.designation,
      department: updatedUser.department,
      className: updatedUser.className,
    },
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const user = db.findUserByEmail(email);
  if (!user) {
    // For security reasons, don't reveal non-existent emails, or return helpful message in dev
    return res.json({
      success: true,
      message: `If an account with ${email} exists, a password reset link has been dispatched.`,
    });
  }

  return res.json({
    success: true,
    message: `Password reset link has been dispatched to ${email}`,
  });
};

export const getDemoCredentials = async (_req: Request, res: Response) => {
  const demoUsers = [
    {
      role: 'Admin',
      label: 'Administrator',
      email: 'admin@edumanage.org',
      password: 'admin123',
      description: 'Dr. Sarah Jenkins (Principal & Super Admin)',
      badgeColor: 'primary',
      name: 'Dr. Sarah Jenkins',
    },
    {
      role: 'Teacher',
      label: 'Teacher / Faculty',
      email: 'teacher@edumanage.org',
      password: 'teacher123',
      description: 'Dr. Robert Vance (Head of Science)',
      badgeColor: 'secondary',
      name: 'Dr. Robert Vance',
    },
    {
      role: 'Student',
      label: 'Student',
      email: 'student@edumanage.org',
      password: 'student123',
      description: 'Alexander Wright (Grade 10-A, Roll: 10A-01)',
      badgeColor: 'info',
      name: 'Alexander Wright',
    },
    {
      role: 'Parent',
      label: 'Parent / Guardian',
      email: 'parent@edumanage.org',
      password: 'parent123',
      description: 'Marcus Wright (Parent of Alexander Wright)',
      badgeColor: 'warning',
      name: 'Marcus Wright',
    },
  ];

  return res.json({ success: true, credentials: demoUsers });
};

export const switchRole = async (req: Request, res: Response) => {
  const { role } = req.body as { role: UserRole };
  const user = db.getUsers().find((u) => u.role === role);

  if (!user) {
    return res.status(404).json({ success: false, message: `No user found with role ${role}` });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      designation: user.designation,
      department: user.department,
      className: user.className,
    },
  });
};
