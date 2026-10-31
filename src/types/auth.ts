export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Parent';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  designation?: string;
  department?: string;
  className?: string;
}

export interface DemoCredential {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  description: string;
  badgeColor: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  name: string;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
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

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: [
    '/',
    '/students',
    '/teachers',
    '/classes',
    '/subjects',
    '/timetable',
    '/homework',
    '/attendance',
    '/fees',
    '/examinations',
    '/library',
    '/transport',
    '/announcements',
    '/reports',
    '/settings',
  ],
  Teacher: [
    '/',
    '/students',
    '/classes',
    '/subjects',
    '/timetable',
    '/homework',
    '/attendance',
    '/examinations',
    '/library',
    '/announcements',
  ],
  Student: [
    '/',
    '/subjects',
    '/timetable',
    '/homework',
    '/attendance',
    '/examinations',
    '/library',
    '/announcements',
  ],
  Parent: [
    '/',
    '/attendance',
    '/fees',
    '/examinations',
    '/timetable',
    '/homework',
    '/announcements',
  ],
};

export const hasRolePermission = (role: UserRole | undefined, path: string): boolean => {
  if (!role) return false;
  const allowed = ROLE_PERMISSIONS[role] || [];
  if (path === '/' || path === '/dashboard') return allowed.includes('/');
  return allowed.some((p) => p !== '/' && (path === p || path.startsWith(p + '/')));
};

