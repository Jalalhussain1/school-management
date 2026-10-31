import {
  Student,
  Teacher,
  SchoolClass,
  Subject,
  AttendanceRecord,
  FeeVoucher,
  FeeCategory,
  Exam,
  ExamResult,
  TimetableSlot,
  Homework,
  LibraryBook,
  BookBorrowRecord,
  Vehicle,
  TransportRoute,
  Announcement,
  SchoolEvent,
  SchoolSettings,
  NotificationItem,
} from '../types';
import { AuthUser, UserRole } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('edumanage_auth_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem('edumanage_auth_token', token);
    } else {
      localStorage.removeItem('edumanage_auth_token');
    }
  } catch (err) {
    console.error('Error saving auth token to localStorage:', err);
  }
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  // --- AUTH ---
  auth: {
    login: async (email: string, password: string, role?: UserRole) => {
      const res = await apiRequest<{ success: boolean; token: string; user: AuthUser; message?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    },
    register: async (name: string, email: string, password: string, role: UserRole, avatar?: string) => {
      const res = await apiRequest<{ success: boolean; token: string; user: AuthUser; message?: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, avatar }),
      });
      // Do not auto-set auth token here so the user logs in manually
      return res;
    },
    getCurrentUser: async () => {
      return apiRequest<{ success: boolean; user: AuthUser }>('/auth/me');
    },
    updateProfile: async (data: { name?: string; avatar?: string }) => {
      return apiRequest<{ success: boolean; message: string; user: AuthUser }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    forgotPassword: async (email: string) => {
      return apiRequest<{ success: boolean; message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    switchRole: async (role: UserRole) => {
      const res = await apiRequest<{ success: boolean; token: string; user: AuthUser }>('/auth/switch-role', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      if (res.token) setAuthToken(res.token);
      return res;
    },
  },

  // --- STUDENTS ---
  students: {
    getAll: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: Student[] }>(`/students${query}`);
    },
    getById: async (id: string) => {
      return apiRequest<{ success: boolean; data: Student }>(`/students/${id}`);
    },
    create: async (student: Omit<Student, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: Student }>('/students', {
        method: 'POST',
        body: JSON.stringify(student),
      });
    },
    update: async (id: string, updates: Partial<Student>) => {
      return apiRequest<{ success: boolean; message: string; data: Student }>(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/students/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- TEACHERS ---
  teachers: {
    getAll: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: Teacher[] }>(`/teachers${query}`);
    },
    getById: async (id: string) => {
      return apiRequest<{ success: boolean; data: Teacher }>(`/teachers/${id}`);
    },
    create: async (teacher: Omit<Teacher, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: Teacher }>('/teachers', {
        method: 'POST',
        body: JSON.stringify(teacher),
      });
    },
    update: async (id: string, updates: Partial<Teacher>) => {
      return apiRequest<{ success: boolean; message: string; data: Teacher }>(`/teachers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/teachers/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- CLASSES ---
  classes: {
    getAll: async () => {
      return apiRequest<{ success: boolean; total: number; data: SchoolClass[] }>('/classes');
    },
    create: async (cls: Omit<SchoolClass, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: SchoolClass }>('/classes', {
        method: 'POST',
        body: JSON.stringify(cls),
      });
    },
    update: async (id: string, updates: Partial<SchoolClass>) => {
      return apiRequest<{ success: boolean; message: string; data: SchoolClass }>(`/classes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/classes/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- SUBJECTS ---
  subjects: {
    getAll: async () => {
      return apiRequest<{ success: boolean; total: number; data: Subject[] }>('/subjects');
    },
    create: async (subject: Omit<Subject, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: Subject }>('/subjects', {
        method: 'POST',
        body: JSON.stringify(subject),
      });
    },
    update: async (id: string, updates: Partial<Subject>) => {
      return apiRequest<{ success: boolean; message: string; data: Subject }>(`/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/subjects/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- ATTENDANCE ---
  attendance: {
    getAll: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: AttendanceRecord[] }>(`/attendance${query}`);
    },
    batchSave: async (records: AttendanceRecord[]) => {
      return apiRequest<{ success: boolean; message: string; data: AttendanceRecord[] }>('/attendance/batch', {
        method: 'POST',
        body: JSON.stringify({ records }),
      });
    },
    getSummary: async (date?: string) => {
      const query = date ? `?date=${encodeURIComponent(date)}` : '';
      return apiRequest<{ success: boolean; summary: any }>(`/attendance/summary${query}`);
    },
  },

  // --- FEES ---
  fees: {
    getCategories: async () => {
      return apiRequest<{ success: boolean; data: FeeCategory[] }>('/fees/categories');
    },
    getVouchers: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: FeeVoucher[] }>(`/fees${query}`);
    },
    createVoucher: async (voucher: Omit<FeeVoucher, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: FeeVoucher }>('/fees', {
        method: 'POST',
        body: JSON.stringify(voucher),
      });
    },
    updateVoucher: async (id: string, updates: Partial<FeeVoucher>) => {
      return apiRequest<{ success: boolean; message: string; data: FeeVoucher }>(`/fees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    payVoucher: async (id: string, paymentMethod: FeeVoucher['paymentMethod'], transactionId?: string) => {
      return apiRequest<{ success: boolean; message: string; data: FeeVoucher }>(`/fees/${id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ paymentMethod, transactionId }),
      });
    },
    deleteVoucher: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/fees/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- EXAMS ---
  exams: {
    getAll: async () => {
      return apiRequest<{ success: boolean; total: number; data: Exam[] }>('/exams');
    },
    create: async (exam: Omit<Exam, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: Exam }>('/exams', {
        method: 'POST',
        body: JSON.stringify(exam),
      });
    },
    update: async (id: string, updates: Partial<Exam>) => {
      return apiRequest<{ success: boolean; message: string; data: Exam }>(`/exams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/exams/${id}`, {
        method: 'DELETE',
      });
    },
    getResults: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: ExamResult[] }>(`/exams/results${query}`);
    },
    saveResult: async (result: ExamResult) => {
      return apiRequest<{ success: boolean; message: string; data: ExamResult }>('/exams/results', {
        method: 'POST',
        body: JSON.stringify(result),
      });
    },
  },

  // --- TIMETABLE ---
  timetable: {
    getAll: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: TimetableSlot[] }>(`/timetable${query}`);
    },
    create: async (slot: Omit<TimetableSlot, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: TimetableSlot }>('/timetable', {
        method: 'POST',
        body: JSON.stringify(slot),
      });
    },
    update: async (id: string, updates: Partial<TimetableSlot>) => {
      return apiRequest<{ success: boolean; message: string; data: TimetableSlot }>(`/timetable/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/timetable/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- HOMEWORK ---
  homework: {
    getAll: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: Homework[] }>(`/homework${query}`);
    },
    create: async (hw: Omit<Homework, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: Homework }>('/homework', {
        method: 'POST',
        body: JSON.stringify(hw),
      });
    },
    update: async (id: string, updates: Partial<Homework>) => {
      return apiRequest<{ success: boolean; message: string; data: Homework }>(`/homework/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/homework/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- LIBRARY ---
  library: {
    getBooks: async (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : '';
      return apiRequest<{ success: boolean; total: number; data: LibraryBook[] }>(`/library/books${query}`);
    },
    createBook: async (book: Omit<LibraryBook, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: LibraryBook }>('/library/books', {
        method: 'POST',
        body: JSON.stringify(book),
      });
    },
    updateBook: async (id: string, updates: Partial<LibraryBook>) => {
      return apiRequest<{ success: boolean; message: string; data: LibraryBook }>(`/library/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    deleteBook: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/library/books/${id}`, {
        method: 'DELETE',
      });
    },
    getBorrows: async () => {
      return apiRequest<{ success: boolean; total: number; data: BookBorrowRecord[] }>('/library/borrows');
    },
    issueBook: async (record: Omit<BookBorrowRecord, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: BookBorrowRecord }>('/library/borrows/issue', {
        method: 'POST',
        body: JSON.stringify(record),
      });
    },
    returnBook: async (recordId: string) => {
      return apiRequest<{ success: boolean; message: string; data: BookBorrowRecord }>(`/library/borrows/${recordId}/return`, {
        method: 'POST',
      });
    },
  },

  // --- TRANSPORT ---
  transport: {
    getVehicles: async () => {
      return apiRequest<{ success: boolean; total: number; data: Vehicle[] }>('/transport/vehicles');
    },
    createVehicle: async (veh: Omit<Vehicle, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: Vehicle }>('/transport/vehicles', {
        method: 'POST',
        body: JSON.stringify(veh),
      });
    },
    updateVehicle: async (id: string, updates: Partial<Vehicle>) => {
      return apiRequest<{ success: boolean; message: string; data: Vehicle }>(`/transport/vehicles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    deleteVehicle: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/transport/vehicles/${id}`, {
        method: 'DELETE',
      });
    },
    getRoutes: async () => {
      return apiRequest<{ success: boolean; total: number; data: TransportRoute[] }>('/transport/routes');
    },
    createRoute: async (route: Omit<TransportRoute, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: TransportRoute }>('/transport/routes', {
        method: 'POST',
        body: JSON.stringify(route),
      });
    },
    updateRoute: async (id: string, updates: Partial<TransportRoute>) => {
      return apiRequest<{ success: boolean; message: string; data: TransportRoute }>(`/transport/routes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    deleteRoute: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/transport/routes/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- ANNOUNCEMENTS & EVENTS ---
  announcements: {
    getAll: async () => {
      return apiRequest<{ success: boolean; total: number; data: Announcement[] }>('/announcements');
    },
    create: async (ann: Omit<Announcement, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: Announcement }>('/announcements', {
        method: 'POST',
        body: JSON.stringify(ann),
      });
    },
    update: async (id: string, updates: Partial<Announcement>) => {
      return apiRequest<{ success: boolean; message: string; data: Announcement }>(`/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    delete: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/announcements/${id}`, {
        method: 'DELETE',
      });
    },
    getEvents: async () => {
      return apiRequest<{ success: boolean; total: number; data: SchoolEvent[] }>('/events');
    },
    createEvent: async (evt: Omit<SchoolEvent, 'id'>) => {
      return apiRequest<{ success: boolean; message: string; data: SchoolEvent }>('/events', {
        method: 'POST',
        body: JSON.stringify(evt),
      });
    },
    deleteEvent: async (id: string) => {
      return apiRequest<{ success: boolean; message: string }>(`/events/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // --- DASHBOARD ---
  dashboard: {
    getStats: async () => {
      return apiRequest<{ success: boolean; data: any }>('/dashboard/stats');
    },
  },

  // --- NOTIFICATIONS ---
  notifications: {
    getAll: async () => {
      return apiRequest<{ success: boolean; total: number; data: NotificationItem[] }>('/notifications');
    },
    markRead: async (id: string) => {
      return apiRequest<{ success: boolean; message: string; data: NotificationItem }>(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    },
    clearAll: async () => {
      return apiRequest<{ success: boolean; message: string; data: NotificationItem[] }>('/notifications/clear-all', {
        method: 'PUT',
      });
    },
  },

  // --- REPORTS ---
  reports: {
    getEnrollment: async () => {
      return apiRequest<{ success: boolean; data: any }>('/reports/enrollment');
    },
    getFinancial: async () => {
      return apiRequest<{ success: boolean; data: any }>('/reports/financial');
    },
    getAcademic: async () => {
      return apiRequest<{ success: boolean; data: any }>('/reports/academic');
    },
  },

  // --- SETTINGS ---
  settings: {
    get: async () => {
      return apiRequest<{ success: boolean; data: SchoolSettings }>('/settings');
    },
    update: async (updates: Partial<SchoolSettings>) => {
      return apiRequest<{ success: boolean; message: string; data: SchoolSettings }>('/settings', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    resetData: async () => {
      return apiRequest<{ success: boolean; message: string; data: any }>('/settings/reset', {
        method: 'POST',
      });
    },
  },
};
