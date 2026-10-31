import fs from 'fs';
import path from 'path';
import { DatabaseSchema } from '../types';
import { getInitialDefaultData } from './defaultData';
import { config } from '../config';

class SchoolDatabase {
  private data: DatabaseSchema;
  private filePath: string;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.filePath = config.dbPath;
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        // Verify key fields exist
        if (parsed.users && parsed.students && parsed.classes) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing default seed data:', err);
    }

    const initial = getInitialDefaultData();
    this.saveImmediate(initial);
    return initial;
  }

  private saveImmediate(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      const json = JSON.stringify(data, null, 2);
      const tempPath = `${this.filePath}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, json, 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('Failed to save database file atomically:', err);
    }
  }

  public save() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.saveImmediate();
      this.saveTimeout = null;
    }, 100);
  }

  public resetAll() {
    const initial = getInitialDefaultData();
    this.data = initial;
    this.saveImmediate(initial);
    return initial;
  }

  // --- USERS ---
  public getUsers() { return this.data.users; }
  public findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  public findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }
  public addUser(user: DatabaseSchema['users'][0]) {
    this.data.users.push(user);
    this.save();
    return user;
  }
  public updateUser(id: string, updates: Partial<DatabaseSchema['users'][0]>) {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // --- STUDENTS ---
  public getStudents() { return this.data.students; }
  public getStudentById(id: string) { return this.data.students.find((s) => s.id === id); }
  public addStudent(student: DatabaseSchema['students'][0]) {
    this.data.students.unshift(student);
    this.updateClassStudentCount(student.classId);
    this.save();
    return student;
  }
  public updateStudent(id: string, updates: Partial<DatabaseSchema['students'][0]>) {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const oldClassId = this.data.students[idx].classId;
    this.data.students[idx] = { ...this.data.students[idx], ...updates };
    if (updates.classId && updates.classId !== oldClassId) {
      this.updateClassStudentCount(oldClassId);
      this.updateClassStudentCount(updates.classId);
    }
    this.save();
    return this.data.students[idx];
  }
  public deleteStudent(id: string) {
    const idx = this.data.students.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    const classId = this.data.students[idx].classId;
    this.data.students.splice(idx, 1);
    this.updateClassStudentCount(classId);
    this.save();
    return true;
  }

  // --- TEACHERS ---
  public getTeachers() { return this.data.teachers; }
  public getTeacherById(id: string) { return this.data.teachers.find((t) => t.id === id); }
  public addTeacher(teacher: DatabaseSchema['teachers'][0]) {
    this.data.teachers.unshift(teacher);
    this.save();
    return teacher;
  }
  public updateTeacher(id: string, updates: Partial<DatabaseSchema['teachers'][0]>) {
    const idx = this.data.teachers.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.data.teachers[idx] = { ...this.data.teachers[idx], ...updates };
    this.save();
    return this.data.teachers[idx];
  }
  public deleteTeacher(id: string) {
    const idx = this.data.teachers.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.data.teachers.splice(idx, 1);
    this.save();
    return true;
  }

  // --- CLASSES ---
  public getClasses() { return this.data.classes; }
  public getClassById(id: string) { return this.data.classes.find((c) => c.id === id); }
  public addClass(cls: DatabaseSchema['classes'][0]) {
    this.data.classes.push(cls);
    this.save();
    return cls;
  }
  public updateClass(id: string, updates: Partial<DatabaseSchema['classes'][0]>) {
    const idx = this.data.classes.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.classes[idx] = { ...this.data.classes[idx], ...updates };
    this.save();
    return this.data.classes[idx];
  }
  public deleteClass(id: string) {
    const idx = this.data.classes.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.classes.splice(idx, 1);
    this.save();
    return true;
  }
  private updateClassStudentCount(classId?: string) {
    if (!classId) return;
    const cls = this.data.classes.find((c) => c.id === classId || c.name === classId);
    if (cls) {
      cls.studentCount = this.data.students.filter(
        (s) => (s.classId === cls.id || s.className === cls.name) && s.status === 'Active'
      ).length;
    }
  }

  // --- SUBJECTS ---
  public getSubjects() { return this.data.subjects; }
  public getSubjectById(id: string) { return this.data.subjects.find((s) => s.id === id); }
  public addSubject(subject: DatabaseSchema['subjects'][0]) {
    this.data.subjects.push(subject);
    this.save();
    return subject;
  }
  public updateSubject(id: string, updates: Partial<DatabaseSchema['subjects'][0]>) {
    const idx = this.data.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.subjects[idx] = { ...this.data.subjects[idx], ...updates };
    this.save();
    return this.data.subjects[idx];
  }
  public deleteSubject(id: string) {
    const idx = this.data.subjects.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.subjects.splice(idx, 1);
    this.save();
    return true;
  }

  // --- ATTENDANCE ---
  public getAttendance() { return this.data.attendanceRecords; }
  public batchSaveAttendance(records: DatabaseSchema['attendanceRecords']) {
    const map = new Map(this.data.attendanceRecords.map((r) => [`${r.date}_${r.studentId}`, r]));
    records.forEach((r) => {
      map.set(`${r.date}_${r.studentId}`, r);
    });
    this.data.attendanceRecords = Array.from(map.values());
    this.save();
    return this.data.attendanceRecords;
  }

  // --- FEES ---
  public getFeeCategories() { return this.data.feeCategories; }
  public getFeeVouchers() { return this.data.feeVouchers; }
  public getFeeVoucherById(id: string) { return this.data.feeVouchers.find((v) => v.id === id); }
  public addFeeVoucher(voucher: DatabaseSchema['feeVouchers'][0]) {
    this.data.feeVouchers.unshift(voucher);
    this.save();
    return voucher;
  }
  public updateFeeVoucher(id: string, updates: Partial<DatabaseSchema['feeVouchers'][0]>) {
    const idx = this.data.feeVouchers.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.data.feeVouchers[idx] = { ...this.data.feeVouchers[idx], ...updates };
    this.save();
    return this.data.feeVouchers[idx];
  }
  public payFeeVoucher(id: string, paymentMethod: DatabaseSchema['feeVouchers'][0]['paymentMethod'], txnId?: string) {
    const idx = this.data.feeVouchers.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    const today = new Date().toISOString().split('T')[0];
    this.data.feeVouchers[idx] = {
      ...this.data.feeVouchers[idx],
      status: 'Paid',
      paidDate: today,
      paymentMethod: paymentMethod || 'Cash',
      transactionId: txnId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
    this.save();
    return this.data.feeVouchers[idx];
  }
  public deleteFeeVoucher(id: string) {
    const idx = this.data.feeVouchers.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    this.data.feeVouchers.splice(idx, 1);
    this.save();
    return true;
  }

  // --- EXAMS & RESULTS ---
  public getExams() { return this.data.exams; }
  public getExamById(id: string) { return this.data.exams.find((e) => e.id === id); }
  public addExam(exam: DatabaseSchema['exams'][0]) {
    this.data.exams.unshift(exam);
    this.save();
    return exam;
  }
  public updateExam(id: string, updates: Partial<DatabaseSchema['exams'][0]>) {
    const idx = this.data.exams.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.data.exams[idx] = { ...this.data.exams[idx], ...updates };
    this.save();
    return this.data.exams[idx];
  }
  public deleteExam(id: string) {
    const idx = this.data.exams.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.data.exams.splice(idx, 1);
    this.save();
    return true;
  }
  public getExamResults() { return this.data.examResults; }
  public saveExamResult(result: DatabaseSchema['examResults'][0]) {
    const idx = this.data.examResults.findIndex(
      (r) => r.examId === result.examId && r.studentId === result.studentId
    );
    if (idx >= 0) {
      this.data.examResults[idx] = result;
    } else {
      this.data.examResults.push(result);
    }
    this.save();
    return result;
  }

  // --- TIMETABLE ---
  public getTimetableSlots() { return this.data.timetableSlots; }
  public addTimetableSlot(slot: DatabaseSchema['timetableSlots'][0]) {
    this.data.timetableSlots.push(slot);
    this.save();
    return slot;
  }
  public updateTimetableSlot(id: string, updates: Partial<DatabaseSchema['timetableSlots'][0]>) {
    const idx = this.data.timetableSlots.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.timetableSlots[idx] = { ...this.data.timetableSlots[idx], ...updates };
    this.save();
    return this.data.timetableSlots[idx];
  }
  public deleteTimetableSlot(id: string) {
    const idx = this.data.timetableSlots.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.timetableSlots.splice(idx, 1);
    this.save();
    return true;
  }

  // --- HOMEWORK ---
  public getHomework() { return this.data.homework; }
  public getHomeworkById(id: string) { return this.data.homework.find((h) => h.id === id); }
  public addHomework(hw: DatabaseSchema['homework'][0]) {
    this.data.homework.unshift(hw);
    this.save();
    return hw;
  }
  public updateHomework(id: string, updates: Partial<DatabaseSchema['homework'][0]>) {
    const idx = this.data.homework.findIndex((h) => h.id === id);
    if (idx === -1) return null;
    this.data.homework[idx] = { ...this.data.homework[idx], ...updates };
    this.save();
    return this.data.homework[idx];
  }
  public deleteHomework(id: string) {
    const idx = this.data.homework.findIndex((h) => h.id === id);
    if (idx === -1) return false;
    this.data.homework.splice(idx, 1);
    this.save();
    return true;
  }

  // --- LIBRARY ---
  public getBooks() { return this.data.books; }
  public getBookById(id: string) { return this.data.books.find((b) => b.id === id); }
  public addBook(book: DatabaseSchema['books'][0]) {
    this.data.books.unshift(book);
    this.save();
    return book;
  }
  public updateBook(id: string, updates: Partial<DatabaseSchema['books'][0]>) {
    const idx = this.data.books.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.data.books[idx] = { ...this.data.books[idx], ...updates };
    this.save();
    return this.data.books[idx];
  }
  public deleteBook(id: string) {
    const idx = this.data.books.findIndex((b) => b.id === id);
    if (idx === -1) return false;
    this.data.books.splice(idx, 1);
    this.save();
    return true;
  }
  public getBorrowRecords() { return this.data.borrowRecords; }
  public issueBook(record: DatabaseSchema['borrowRecords'][0]) {
    this.data.borrowRecords.unshift(record);
    const book = this.data.books.find((b) => b.id === record.bookId);
    if (book) {
      book.availableCopies = Math.max(0, book.availableCopies - 1);
    }
    this.save();
    return record;
  }
  public returnBook(recordId: string) {
    const record = this.data.borrowRecords.find((r) => r.id === recordId);
    if (!record) return null;
    record.status = 'Returned';
    record.returnDate = new Date().toISOString().split('T')[0];
    const book = this.data.books.find((b) => b.id === record.bookId);
    if (book) {
      book.availableCopies += 1;
    }
    this.save();
    return record;
  }

  // --- TRANSPORT ---
  public getVehicles() { return this.data.vehicles; }
  public getVehicleById(id: string) { return this.data.vehicles.find((v) => v.id === id); }
  public addVehicle(vehicle: DatabaseSchema['vehicles'][0]) {
    this.data.vehicles.unshift(vehicle);
    this.save();
    return vehicle;
  }
  public updateVehicle(id: string, updates: Partial<DatabaseSchema['vehicles'][0]>) {
    const idx = this.data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.data.vehicles[idx] = { ...this.data.vehicles[idx], ...updates };
    this.save();
    return this.data.vehicles[idx];
  }
  public deleteVehicle(id: string) {
    const idx = this.data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return false;
    this.data.vehicles.splice(idx, 1);
    this.save();
    return true;
  }
  public getRoutes() { return this.data.routes; }
  public getRouteById(id: string) { return this.data.routes.find((r) => r.id === id); }
  public addRoute(route: DatabaseSchema['routes'][0]) {
    this.data.routes.unshift(route);
    this.save();
    return route;
  }
  public updateRoute(id: string, updates: Partial<DatabaseSchema['routes'][0]>) {
    const idx = this.data.routes.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.routes[idx] = { ...this.data.routes[idx], ...updates };
    this.save();
    return this.data.routes[idx];
  }
  public deleteRoute(id: string) {
    const idx = this.data.routes.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.data.routes.splice(idx, 1);
    this.save();
    return true;
  }

  // --- ANNOUNCEMENTS & EVENTS ---
  public getAnnouncements() { return this.data.announcements; }
  public addAnnouncement(announcement: DatabaseSchema['announcements'][0]) {
    this.data.announcements.unshift(announcement);
    this.save();
    return announcement;
  }
  public updateAnnouncement(id: string, updates: Partial<DatabaseSchema['announcements'][0]>) {
    const idx = this.data.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.announcements[idx] = { ...this.data.announcements[idx], ...updates };
    this.save();
    return this.data.announcements[idx];
  }
  public deleteAnnouncement(id: string) {
    const idx = this.data.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.data.announcements.splice(idx, 1);
    this.save();
    return true;
  }
  public getEvents() { return this.data.events; }
  public addEvent(event: DatabaseSchema['events'][0]) {
    this.data.events.unshift(event);
    this.save();
    return event;
  }
  public deleteEvent(id: string) {
    const idx = this.data.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.data.events.splice(idx, 1);
    this.save();
    return true;
  }

  // --- NOTIFICATIONS ---
  public getNotifications() { return this.data.notifications; }
  public markNotificationRead(id: string) {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
    return notif;
  }
  public clearAllNotifications() {
    this.data.notifications.forEach((n) => {
      n.read = true;
    });
    this.save();
    return this.data.notifications;
  }

  // --- SETTINGS ---
  public getSettings() { return this.data.settings; }
  public updateSettings(updates: Partial<DatabaseSchema['settings']>) {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }
}

export const db = new SchoolDatabase();
