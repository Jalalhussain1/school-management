import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Student,
  Teacher,
  SchoolClass,
  Subject,
  AttendanceRecord,
  FeeVoucher,
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
import { initialStudents } from '../data/mockStudents';
import { initialTeachers } from '../data/mockTeachers';
import { initialClasses } from '../data/mockClasses';
import { initialSubjects } from '../data/mockSubjects';
import { initialAttendanceRecords } from '../data/mockAttendance';
import { initialFeeVouchers, initialFeeCategories, FeeCategory } from '../data/mockFees';
import { initialExams, initialExamResults } from '../data/mockExams';
import { initialTimetableSlots } from '../data/mockTimetable';
import { initialHomework } from '../data/mockHomework';
import { initialBooks, initialBorrowRecords } from '../data/mockLibrary';
import { initialVehicles, initialRoutes } from '../data/mockTransport';
import { initialAnnouncements, initialSchoolEvents, initialNotifications } from '../data/mockAnnouncements';
import { initialSettings } from '../data/mockSettings';
import { api } from '../services/api';

interface ToastAlert {
  id: string;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

interface SchoolContextType {
  // Data lists
  students: Student[];
  teachers: Teacher[];
  classes: SchoolClass[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  feeVouchers: FeeVoucher[];
  feeCategories: FeeCategory[];
  exams: Exam[];
  examResults: ExamResult[];
  timetableSlots: TimetableSlot[];
  homework: Homework[];
  books: LibraryBook[];
  borrowRecords: BookBorrowRecord[];
  vehicles: Vehicle[];
  routes: TransportRoute[];
  announcements: Announcement[];
  events: SchoolEvent[];
  notifications: NotificationItem[];
  settings: SchoolSettings;
  toast: ToastAlert | null;
  loading: boolean;

  // Notification / Toast
  showToast: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Student CRUD
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, updated: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // Teacher CRUD
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, updated: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  // Class CRUD
  addClass: (cls: Omit<SchoolClass, 'id'>) => Promise<void>;
  updateClass: (id: string, updated: Partial<SchoolClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  // Subject CRUD
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (id: string, updated: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Attendance
  saveAttendanceBatch: (records: AttendanceRecord[]) => Promise<void>;

  // Fees CRUD & Payments
  addFeeVoucher: (voucher: Omit<FeeVoucher, 'id'>) => Promise<void>;
  updateFeeVoucher: (id: string, updated: Partial<FeeVoucher>) => Promise<void>;
  payFeeVoucher: (id: string, paymentMethod: FeeVoucher['paymentMethod'], transactionId?: string) => Promise<void>;
  deleteFeeVoucher: (id: string) => Promise<void>;

  // Exams & Results
  addExam: (exam: Omit<Exam, 'id'>) => Promise<void>;
  updateExam: (id: string, updated: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  saveExamResult: (result: ExamResult) => Promise<void>;

  // Timetable
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => Promise<void>;
  updateTimetableSlot: (id: string, updated: Partial<TimetableSlot>) => Promise<void>;
  deleteTimetableSlot: (id: string) => Promise<void>;

  // Homework
  addHomework: (hw: Omit<Homework, 'id'>) => Promise<void>;
  updateHomework: (id: string, updated: Partial<Homework>) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;

  // Library
  addBook: (book: Omit<LibraryBook, 'id'>) => Promise<void>;
  updateBook: (id: string, updated: Partial<LibraryBook>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  issueBook: (record: Omit<BookBorrowRecord, 'id'>) => Promise<void>;
  returnBook: (recordId: string) => Promise<void>;

  // Transport
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, updated: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  addRoute: (route: Omit<TransportRoute, 'id'>) => Promise<void>;
  updateRoute: (id: string, updated: Partial<TransportRoute>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;

  // Announcements & Events
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
  updateAnnouncement: (id: string, updated: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addEvent: (event: Omit<SchoolEvent, 'id'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Settings
  updateSettings: (newSettings: Partial<SchoolSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`edumanage_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, data: unknown) => {
  try {
    localStorage.setItem(`edumanage_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', initialStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadFromStorage('teachers', initialTeachers));
  const [classes, setClasses] = useState<SchoolClass[]>(() => loadFromStorage('classes', initialClasses));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadFromStorage('subjects', initialSubjects));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', initialAttendanceRecords));
  const [feeVouchers, setFeeVouchers] = useState<FeeVoucher[]>(() => loadFromStorage('fees', initialFeeVouchers));
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>(initialFeeCategories);
  const [exams, setExams] = useState<Exam[]>(() => loadFromStorage('exams', initialExams));
  const [examResults, setExamResults] = useState<ExamResult[]>(() => loadFromStorage('examResults', initialExamResults));
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => loadFromStorage('timetable', initialTimetableSlots));
  const [homework, setHomework] = useState<Homework[]>(() => loadFromStorage('homework', initialHomework));
  const [books, setBooks] = useState<LibraryBook[]>(() => loadFromStorage('books', initialBooks));
  const [borrowRecords, setBorrowRecords] = useState<BookBorrowRecord[]>(() => loadFromStorage('borrowRecords', initialBorrowRecords));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadFromStorage('vehicles', initialVehicles));
  const [routes, setRoutes] = useState<TransportRoute[]>(() => loadFromStorage('routes', initialRoutes));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadFromStorage('announcements', initialAnnouncements));
  const [events, setEvents] = useState<SchoolEvent[]>(() => loadFromStorage('events', initialSchoolEvents));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadFromStorage('notifications', initialNotifications));
  const [settings, setSettings] = useState<SchoolSettings>(() => loadFromStorage('settings', initialSettings));

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastAlert | null>(null);

  const showToast = useCallback((message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ id: Date.now().toString(), message, severity });
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  // Fetch all initial data from backend API
  const refreshAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        studentsRes,
        teachersRes,
        classesRes,
        subjectsRes,
        attendanceRes,
        feesRes,
        feeCatsRes,
        examsRes,
        resultsRes,
        timetableRes,
        homeworkRes,
        booksRes,
        borrowsRes,
        vehiclesRes,
        routesRes,
        announcementsRes,
        eventsRes,
        notifsRes,
        settingsRes,
      ] = await Promise.allSettled([
        api.students.getAll(),
        api.teachers.getAll(),
        api.classes.getAll(),
        api.subjects.getAll(),
        api.attendance.getAll(),
        api.fees.getVouchers(),
        api.fees.getCategories(),
        api.exams.getAll(),
        api.exams.getResults(),
        api.timetable.getAll(),
        api.homework.getAll(),
        api.library.getBooks(),
        api.library.getBorrows(),
        api.transport.getVehicles(),
        api.transport.getRoutes(),
        api.announcements.getAll(),
        api.announcements.getEvents(),
        api.notifications.getAll(),
        api.settings.get(),
      ]);

      if (studentsRes.status === 'fulfilled' && studentsRes.value.success) setStudents(studentsRes.value.data);
      if (teachersRes.status === 'fulfilled' && teachersRes.value.success) setTeachers(teachersRes.value.data);
      if (classesRes.status === 'fulfilled' && classesRes.value.success) setClasses(classesRes.value.data);
      if (subjectsRes.status === 'fulfilled' && subjectsRes.value.success) setSubjects(subjectsRes.value.data);
      if (attendanceRes.status === 'fulfilled' && attendanceRes.value.success) setAttendanceRecords(attendanceRes.value.data);
      if (feesRes.status === 'fulfilled' && feesRes.value.success) setFeeVouchers(feesRes.value.data);
      if (feeCatsRes.status === 'fulfilled' && feeCatsRes.value.success) setFeeCategories(feeCatsRes.value.data);
      if (examsRes.status === 'fulfilled' && examsRes.value.success) setExams(examsRes.value.data);
      if (resultsRes.status === 'fulfilled' && resultsRes.value.success) setExamResults(resultsRes.value.data);
      if (timetableRes.status === 'fulfilled' && timetableRes.value.success) setTimetableSlots(timetableRes.value.data);
      if (homeworkRes.status === 'fulfilled' && homeworkRes.value.success) setHomework(homeworkRes.value.data);
      if (booksRes.status === 'fulfilled' && booksRes.value.success) setBooks(booksRes.value.data);
      if (borrowsRes.status === 'fulfilled' && borrowsRes.value.success) setBorrowRecords(borrowsRes.value.data);
      if (vehiclesRes.status === 'fulfilled' && vehiclesRes.value.success) setVehicles(vehiclesRes.value.data);
      if (routesRes.status === 'fulfilled' && routesRes.value.success) setRoutes(routesRes.value.data);
      if (announcementsRes.status === 'fulfilled' && announcementsRes.value.success) setAnnouncements(announcementsRes.value.data);
      if (eventsRes.status === 'fulfilled' && eventsRes.value.success) setEvents(eventsRes.value.data);
      if (notifsRes.status === 'fulfilled' && notifsRes.value.success) setNotifications(notifsRes.value.data);
      if (settingsRes.status === 'fulfilled' && settingsRes.value.success) setSettings(settingsRes.value.data);
    } catch (err) {
      console.warn('Backend data load error, using cached storage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Sync to localStorage as offline cache
  useEffect(() => { saveToStorage('students', students); }, [students]);
  useEffect(() => { saveToStorage('teachers', teachers); }, [teachers]);
  useEffect(() => { saveToStorage('classes', classes); }, [classes]);
  useEffect(() => { saveToStorage('subjects', subjects); }, [subjects]);
  useEffect(() => { saveToStorage('attendance', attendanceRecords); }, [attendanceRecords]);
  useEffect(() => { saveToStorage('fees', feeVouchers); }, [feeVouchers]);
  useEffect(() => { saveToStorage('exams', exams); }, [exams]);
  useEffect(() => { saveToStorage('examResults', examResults); }, [examResults]);
  useEffect(() => { saveToStorage('timetable', timetableSlots); }, [timetableSlots]);
  useEffect(() => { saveToStorage('homework', homework); }, [homework]);
  useEffect(() => { saveToStorage('books', books); }, [books]);
  useEffect(() => { saveToStorage('borrowRecords', borrowRecords); }, [borrowRecords]);
  useEffect(() => { saveToStorage('vehicles', vehicles); }, [vehicles]);
  useEffect(() => { saveToStorage('routes', routes); }, [routes]);
  useEffect(() => { saveToStorage('announcements', announcements); }, [announcements]);
  useEffect(() => { saveToStorage('events', events); }, [events]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('settings', settings); }, [settings]);

  // Notification methods
  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await api.notifications.markRead(id);
    } catch {
      // Optimistic update retained
    }
  };

  const clearAllNotifications = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
    try {
      await api.notifications.clearAll();
    } catch {
      // Optimistic update retained
    }
  };

  // Student Actions
  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const res = await api.students.create(studentData);
      if (res.success && res.data) {
        setStudents(prev => [res.data, ...prev]);
        showToast(`Student "${res.data.fullName}" added successfully`);
        return;
      }
    } catch (err: any) {
      console.warn('API addStudent failed, applying local fallback:', err);
    }

    const fallback: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      admissionNo: studentData.admissionNo || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      rollNo: studentData.rollNo || `RN-${Math.floor(10 + Math.random() * 90)}`,
      fullName: `${studentData.firstName} ${studentData.lastName}`.trim(),
      attendanceRate: 100,
      totalFeeDue: 0,
    };
    setStudents(prev => [fallback, ...prev]);
    showToast(`Student "${fallback.fullName}" added successfully`);
  };

  const updateStudent = async (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const fullName = updated.firstName || updated.lastName
          ? `${updated.firstName ?? s.firstName} ${updated.lastName ?? s.lastName}`.trim()
          : s.fullName;
        return { ...s, ...updated, fullName };
      }
      return s;
    }));
    showToast('Student record updated successfully');
    try {
      await api.students.update(id, updated);
    } catch (err) {
      console.warn('API updateStudent error:', err);
    }
  };

  const deleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast('Student deleted successfully', 'warning');
    try {
      await api.students.delete(id);
    } catch (err) {
      console.warn('API deleteStudent error:', err);
    }
  };

  // Teacher Actions
  const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    try {
      const res = await api.teachers.create(teacherData);
      if (res.success && res.data) {
        setTeachers(prev => [res.data, ...prev]);
        showToast(`Faculty member "${res.data.fullName}" added successfully`);
        return;
      }
    } catch (err: any) {
      console.warn('API addTeacher failed, applying local fallback:', err);
    }

    const fallback: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
      employeeId: teacherData.employeeId || `EMP-T-${Math.floor(200 + Math.random() * 800)}`,
      fullName: `${teacherData.firstName} ${teacherData.lastName}`.trim(),
    };
    setTeachers(prev => [fallback, ...prev]);
    showToast(`Faculty member "${fallback.fullName}" added successfully`);
  };

  const updateTeacher = async (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const fullName = updated.firstName || updated.lastName
          ? `${updated.firstName ?? t.firstName} ${updated.lastName ?? t.lastName}`.trim()
          : t.fullName;
        return { ...t, ...updated, fullName };
      }
      return t;
    }));
    showToast('Faculty record updated successfully');
    try {
      await api.teachers.update(id, updated);
    } catch (err) {
      console.warn('API updateTeacher error:', err);
    }
  };

  const deleteTeacher = async (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast('Faculty deleted successfully', 'warning');
    try {
      await api.teachers.delete(id);
    } catch (err) {
      console.warn('API deleteTeacher error:', err);
    }
  };

  // Class Actions
  const addClass = async (clsData: Omit<SchoolClass, 'id'>) => {
    try {
      const res = await api.classes.create(clsData);
      if (res.success && res.data) {
        setClasses(prev => [...prev, res.data]);
        showToast(`Class "${res.data.name}" added successfully`);
        return;
      }
    } catch (err) {
      console.warn('API addClass error:', err);
    }

    const fallback: SchoolClass = { ...clsData, id: `cls-${Date.now()}` };
    setClasses(prev => [...prev, fallback]);
    showToast(`Class "${fallback.name}" added successfully`);
  };

  const updateClass = async (id: string, updated: Partial<SchoolClass>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    showToast('Class updated successfully');
    try {
      await api.classes.update(id, updated);
    } catch (err) {
      console.warn('API updateClass error:', err);
    }
  };

  const deleteClass = async (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    showToast('Class deleted', 'warning');
    try {
      await api.classes.delete(id);
    } catch (err) {
      console.warn('API deleteClass error:', err);
    }
  };

  // Subject Actions
  const addSubject = async (subjectData: Omit<Subject, 'id'>) => {
    try {
      const res = await api.subjects.create(subjectData);
      if (res.success && res.data) {
        setSubjects(prev => [...prev, res.data]);
        showToast(`Subject "${res.data.name}" created successfully`);
        return;
      }
    } catch (err) {
      console.warn('API addSubject error:', err);
    }

    const fallback: Subject = { ...subjectData, id: `sbj-${Date.now()}` };
    setSubjects(prev => [...prev, fallback]);
    showToast(`Subject "${fallback.name}" created successfully`);
  };

  const updateSubject = async (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    showToast('Subject updated successfully');
    try {
      await api.subjects.update(id, updated);
    } catch (err) {
      console.warn('API updateSubject error:', err);
    }
  };

  const deleteSubject = async (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast('Subject deleted', 'warning');
    try {
      await api.subjects.delete(id);
    } catch (err) {
      console.warn('API deleteSubject error:', err);
    }
  };

  // Attendance Actions
  const saveAttendanceBatch = async (records: AttendanceRecord[]) => {
    setAttendanceRecords(prev => {
      const updatedMap = new Map(prev.map(r => [`${r.date}_${r.studentId}`, r]));
      records.forEach(r => {
        updatedMap.set(`${r.date}_${r.studentId}`, r);
      });
      return Array.from(updatedMap.values());
    });
    showToast(`Saved attendance for ${records.length} students`);
    try {
      await api.attendance.batchSave(records);
    } catch (err) {
      console.warn('API saveAttendanceBatch error:', err);
    }
  };

  // Fee Actions
  const addFeeVoucher = async (voucherData: Omit<FeeVoucher, 'id'>) => {
    try {
      const res = await api.fees.createVoucher(voucherData);
      if (res.success && res.data) {
        setFeeVouchers(prev => [res.data, ...prev]);
        showToast(`Invoice ${res.data.invoiceNo} generated`);
        return;
      }
    } catch (err) {
      console.warn('API addFeeVoucher error:', err);
    }

    const fallback: FeeVoucher = {
      ...voucherData,
      id: `fvc-${Date.now()}`,
      invoiceNo: voucherData.invoiceNo || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setFeeVouchers(prev => [fallback, ...prev]);
    showToast(`Invoice ${fallback.invoiceNo} generated`);
  };

  const updateFeeVoucher = async (id: string, updated: Partial<FeeVoucher>) => {
    setFeeVouchers(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v));
    showToast('Fee voucher updated');
    try {
      await api.fees.updateVoucher(id, updated);
    } catch (err) {
      console.warn('API updateFeeVoucher error:', err);
    }
  };

  const payFeeVoucher = async (id: string, paymentMethod: FeeVoucher['paymentMethod'], transactionId?: string) => {
    const txn = transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const today = new Date().toISOString().split('T')[0];
    setFeeVouchers(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status: 'Paid',
          paidDate: today,
          paymentMethod: paymentMethod || 'Cash',
          transactionId: txn,
        };
      }
      return v;
    }));
    showToast(`Payment of invoice marked as Paid via ${paymentMethod || 'Cash'}`);
    try {
      await api.fees.payVoucher(id, paymentMethod, txn);
    } catch (err) {
      console.warn('API payFeeVoucher error:', err);
    }
  };

  const deleteFeeVoucher = async (id: string) => {
    setFeeVouchers(prev => prev.filter(v => v.id !== id));
    showToast('Fee record deleted', 'warning');
    try {
      await api.fees.deleteVoucher(id);
    } catch (err) {
      console.warn('API deleteFeeVoucher error:', err);
    }
  };

  // Exam Actions
  const addExam = async (examData: Omit<Exam, 'id'>) => {
    try {
      const res = await api.exams.create(examData);
      if (res.success && res.data) {
        setExams(prev => [res.data, ...prev]);
        showToast(`Exam "${res.data.title}" scheduled`);
        return;
      }
    } catch (err) {
      console.warn('API addExam error:', err);
    }

    const fallback: Exam = { ...examData, id: `ex-${Date.now()}` };
    setExams(prev => [fallback, ...prev]);
    showToast(`Exam "${fallback.title}" scheduled`);
  };

  const updateExam = async (id: string, updated: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    showToast('Exam schedule updated');
    try {
      await api.exams.update(id, updated);
    } catch (err) {
      console.warn('API updateExam error:', err);
    }
  };

  const deleteExam = async (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
    showToast('Exam deleted', 'warning');
    try {
      await api.exams.delete(id);
    } catch (err) {
      console.warn('API deleteExam error:', err);
    }
  };

  const saveExamResult = async (result: ExamResult) => {
    setExamResults(prev => {
      const idx = prev.findIndex(r => r.examId === result.examId && r.studentId === result.studentId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = result;
        return copy;
      }
      return [...prev, result];
    });
    showToast(`Exam marks saved for ${result.studentName}`);
    try {
      await api.exams.saveResult(result);
    } catch (err) {
      console.warn('API saveExamResult error:', err);
    }
  };

  // Timetable
  const addTimetableSlot = async (slotData: Omit<TimetableSlot, 'id'>) => {
    try {
      const res = await api.timetable.create(slotData);
      if (res.success && res.data) {
        setTimetableSlots(prev => [...prev, res.data]);
        showToast('Timetable period scheduled');
        return;
      }
    } catch (err) {
      console.warn('API addTimetableSlot error:', err);
    }

    const fallback: TimetableSlot = { ...slotData, id: `tt-${Date.now()}` };
    setTimetableSlots(prev => [...prev, fallback]);
    showToast('Timetable period scheduled');
  };

  const updateTimetableSlot = async (id: string, updated: Partial<TimetableSlot>) => {
    setTimetableSlots(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    showToast('Timetable period updated');
    try {
      await api.timetable.update(id, updated);
    } catch (err) {
      console.warn('API updateTimetableSlot error:', err);
    }
  };

  const deleteTimetableSlot = async (id: string) => {
    setTimetableSlots(prev => prev.filter(s => s.id !== id));
    showToast('Timetable period removed');
    try {
      await api.timetable.delete(id);
    } catch (err) {
      console.warn('API deleteTimetableSlot error:', err);
    }
  };

  // Homework
  const addHomework = async (hwData: Omit<Homework, 'id'>) => {
    try {
      const res = await api.homework.create(hwData);
      if (res.success && res.data) {
        setHomework(prev => [res.data, ...prev]);
        showToast(`Assignment "${res.data.title}" published`);
        return;
      }
    } catch (err) {
      console.warn('API addHomework error:', err);
    }

    const fallback: Homework = { ...hwData, id: `hw-${Date.now()}` };
    setHomework(prev => [fallback, ...prev]);
    showToast(`Assignment "${fallback.title}" published`);
  };

  const updateHomework = async (id: string, updated: Partial<Homework>) => {
    setHomework(prev => prev.map(h => h.id === id ? { ...h, ...updated } : h));
    showToast('Assignment updated');
    try {
      await api.homework.update(id, updated);
    } catch (err) {
      console.warn('API updateHomework error:', err);
    }
  };

  const deleteHomework = async (id: string) => {
    setHomework(prev => prev.filter(h => h.id !== id));
    showToast('Assignment removed');
    try {
      await api.homework.delete(id);
    } catch (err) {
      console.warn('API deleteHomework error:', err);
    }
  };

  // Library
  const addBook = async (bookData: Omit<LibraryBook, 'id'>) => {
    try {
      const res = await api.library.createBook(bookData);
      if (res.success && res.data) {
        setBooks(prev => [res.data, ...prev]);
        showToast(`Book "${res.data.title}" cataloged`);
        return;
      }
    } catch (err) {
      console.warn('API addBook error:', err);
    }

    const fallback: LibraryBook = { ...bookData, id: `bk-${Date.now()}` };
    setBooks(prev => [fallback, ...prev]);
    showToast(`Book "${fallback.title}" cataloged`);
  };

  const updateBook = async (id: string, updated: Partial<LibraryBook>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    showToast('Book details updated');
    try {
      await api.library.updateBook(id, updated);
    } catch (err) {
      console.warn('API updateBook error:', err);
    }
  };

  const deleteBook = async (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    showToast('Book removed from library');
    try {
      await api.library.deleteBook(id);
    } catch (err) {
      console.warn('API deleteBook error:', err);
    }
  };

  const issueBook = async (recordData: Omit<BookBorrowRecord, 'id'>) => {
    try {
      const res = await api.library.issueBook(recordData);
      if (res.success && res.data) {
        setBorrowRecords(prev => [res.data, ...prev]);
        setBooks(prev => prev.map(b => b.id === recordData.bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b));
        showToast(`Book issued to ${recordData.borrowerName}`);
        return;
      }
    } catch (err) {
      console.warn('API issueBook error:', err);
    }

    const fallback: BookBorrowRecord = { ...recordData, id: `brw-${Date.now()}` };
    setBorrowRecords(prev => [fallback, ...prev]);
    setBooks(prev => prev.map(b => b.id === recordData.bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b));
    showToast(`Book issued to ${recordData.borrowerName}`);
  };

  const returnBook = async (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;
    const today = new Date().toISOString().split('T')[0];
    setBorrowRecords(prev => prev.map(r => r.id === recordId ? { ...r, status: 'Returned', returnDate: today } : r));
    setBooks(prev => prev.map(b => b.id === record.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));
    showToast('Book returned successfully');
    try {
      await api.library.returnBook(recordId);
    } catch (err) {
      console.warn('API returnBook error:', err);
    }
  };

  // Transport
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const res = await api.transport.createVehicle(vehicleData);
      if (res.success && res.data) {
        setVehicles(prev => [...prev, res.data]);
        showToast(`Vehicle ${res.data.vehicleNumber} added`);
        return;
      }
    } catch (err) {
      console.warn('API addVehicle error:', err);
    }

    const fallback: Vehicle = { ...vehicleData, id: `veh-${Date.now()}` };
    setVehicles(prev => [...prev, fallback]);
    showToast(`Vehicle ${fallback.vehicleNumber} added`);
  };

  const updateVehicle = async (id: string, updated: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v));
    showToast('Vehicle updated');
    try {
      await api.transport.updateVehicle(id, updated);
    } catch (err) {
      console.warn('API updateVehicle error:', err);
    }
  };

  const deleteVehicle = async (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    showToast('Vehicle deleted');
    try {
      await api.transport.deleteVehicle(id);
    } catch (err) {
      console.warn('API deleteVehicle error:', err);
    }
  };

  const addRoute = async (routeData: Omit<TransportRoute, 'id'>) => {
    try {
      const res = await api.transport.createRoute(routeData);
      if (res.success && res.data) {
        setRoutes(prev => [...prev, res.data]);
        showToast(`Route "${res.data.routeName}" added`);
        return;
      }
    } catch (err) {
      console.warn('API addRoute error:', err);
    }

    const fallback: TransportRoute = { ...routeData, id: `rt-${Date.now()}` };
    setRoutes(prev => [...prev, fallback]);
    showToast(`Route "${fallback.routeName}" added`);
  };

  const updateRoute = async (id: string, updated: Partial<TransportRoute>) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    showToast('Route updated');
    try {
      await api.transport.updateRoute(id, updated);
    } catch (err) {
      console.warn('API updateRoute error:', err);
    }
  };

  const deleteRoute = async (id: string) => {
    setRoutes(prev => prev.filter(r => r.id !== id));
    showToast('Route deleted');
    try {
      await api.transport.deleteRoute(id);
    } catch (err) {
      console.warn('API deleteRoute error:', err);
    }
  };

  // Announcements & Events
  const addAnnouncement = async (annData: Omit<Announcement, 'id'>) => {
    try {
      const res = await api.announcements.create(annData);
      if (res.success && res.data) {
        setAnnouncements(prev => [res.data, ...prev]);
        showToast(`Announcement "${res.data.title}" published`);
        return;
      }
    } catch (err) {
      console.warn('API addAnnouncement error:', err);
    }

    const fallback: Announcement = { ...annData, id: `anc-${Date.now()}` };
    setAnnouncements(prev => [fallback, ...prev]);
    showToast(`Announcement "${fallback.title}" published`);
  };

  const updateAnnouncement = async (id: string, updated: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    showToast('Announcement updated');
    try {
      await api.announcements.update(id, updated);
    } catch (err) {
      console.warn('API updateAnnouncement error:', err);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Announcement deleted');
    try {
      await api.announcements.delete(id);
    } catch (err) {
      console.warn('API deleteAnnouncement error:', err);
    }
  };

  const addEvent = async (eventData: Omit<SchoolEvent, 'id'>) => {
    try {
      const res = await api.announcements.createEvent(eventData);
      if (res.success && res.data) {
        setEvents(prev => [...prev, res.data]);
        showToast(`Event "${res.data.title}" added to calendar`);
        return;
      }
    } catch (err) {
      console.warn('API addEvent error:', err);
    }

    const fallback: SchoolEvent = { ...eventData, id: `evt-${Date.now()}` };
    setEvents(prev => [...prev, fallback]);
    showToast(`Event "${fallback.title}" added to calendar`);
  };

  const deleteEvent = async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    showToast('Event removed');
    try {
      await api.announcements.deleteEvent(id);
    } catch (err) {
      console.warn('API deleteEvent error:', err);
    }
  };

  // Settings
  const updateSettings = async (newSettings: Partial<SchoolSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('School settings saved successfully');
    try {
      await api.settings.update(newSettings);
    } catch (err) {
      console.warn('API updateSettings error:', err);
    }
  };

  const resetAllData = async () => {
    try {
      await api.settings.resetData();
      await refreshAllData();
      showToast('All system dummy data restored to default', 'info');
    } catch (err) {
      console.warn('API resetAllData error, falling back locally:', err);
      localStorage.clear();
      setStudents(initialStudents);
      setTeachers(initialTeachers);
      setClasses(initialClasses);
      setSubjects(initialSubjects);
      setAttendanceRecords(initialAttendanceRecords);
      setFeeVouchers(initialFeeVouchers);
      setExams(initialExams);
      setExamResults(initialExamResults);
      setTimetableSlots(initialTimetableSlots);
      setHomework(initialHomework);
      setBooks(initialBooks);
      setBorrowRecords(initialBorrowRecords);
      setVehicles(initialVehicles);
      setRoutes(initialRoutes);
      setAnnouncements(initialAnnouncements);
      setEvents(initialSchoolEvents);
      setNotifications(initialNotifications);
      setSettings(initialSettings);
      showToast('All system dummy data restored to default', 'info');
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        students,
        teachers,
        classes,
        subjects,
        attendanceRecords,
        feeVouchers,
        feeCategories,
        exams,
        examResults,
        timetableSlots,
        homework,
        books,
        borrowRecords,
        vehicles,
        routes,
        announcements,
        events,
        notifications,
        settings,
        toast,
        loading,
        showToast,
        hideToast,
        markNotificationRead,
        clearAllNotifications,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        saveAttendanceBatch,
        addFeeVoucher,
        updateFeeVoucher,
        payFeeVoucher,
        deleteFeeVoucher,
        addExam,
        updateExam,
        deleteExam,
        saveExamResult,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        addHomework,
        updateHomework,
        deleteHomework,
        addBook,
        updateBook,
        deleteBook,
        issueBook,
        returnBook,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addRoute,
        updateRoute,
        deleteRoute,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addEvent,
        deleteEvent,
        updateSettings,
        resetAllData,
        refreshAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
