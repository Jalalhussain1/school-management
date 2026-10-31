export type StudentStatus = 'Active' | 'Inactive' | 'Graduated';
export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: string;
  classId: string;
  className: string;
  section: string;
  address: string;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentEmail: string;
  admissionDate: string;
  status: StudentStatus;
  avatar?: string;
  emergencyContact: string;
  attendanceRate?: number;
  totalFeeDue?: number;
}

export type TeacherStatus = 'Active' | 'On Leave' | 'Resigned';

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  designation: string;
  department: string;
  qualification: string;
  joiningDate: string;
  salary: number;
  status: TeacherStatus;
  subjects: string[];
  avatar?: string;
  address?: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  numericGrade: number;
  sections: string[];
  classTeacherId: string;
  classTeacherName: string;
  roomNumber: string;
  capacity: number;
  studentCount: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  type: 'Core' | 'Elective';
  weeklyHours: number;
  assignedTeacherIds: string[];
  assignedClassIds: string[];
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classId: string;
  section: string;
  status: AttendanceStatus;
  remarks?: string;
}

export type FeeStatus = 'Paid' | 'Unpaid' | 'Overdue' | 'Partial';
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Credit Card' | 'Cheque' | 'Online Gateway';

export interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  frequency: 'Monthly' | 'Per Term' | 'Annual';
  description: string;
}

export interface FeeVoucher {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  feeType: string;
  amount: number;
  discount: number;
  netAmount: number;
  dueDate: string;
  paidDate?: string;
  status: FeeStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  academicTerm: string;
}

export type ExamStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Published';

export interface Exam {
  id: string;
  title: string;
  term: string;
  startDate: string;
  endDate: string;
  classes: string[];
  status: ExamStatus;
  description?: string;
}

export interface SubjectMark {
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  admissionNo: string;
  classId: string;
  className: string;
  marks: SubjectMark[];
  totalMarks: number;
  obtainedTotal: number;
  percentage: number;
  grade: string;
  status: 'Passed' | 'Failed';
  remarks?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  section: string;
  subjectCode: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
}

export type HomeworkStatus = 'Active' | 'Overdue' | 'Closed';

export interface Homework {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  section: string;
  subjectName: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  totalSubmissions: number;
  maxSubmissions: number;
  status: HomeworkStatus;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  publicationYear: number;
}

export interface BookBorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerType: 'Student' | 'Teacher';
  borrowerId: string;
  borrowerName: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  registrationNumber: string;
  vehicleModel: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  routeName: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface TransportRoute {
  id: string;
  routeName: string;
  vehicleId: string;
  vehicleNumber: string;
  startPoint: string;
  endPoint: string;
  stopsCount: number;
  morningPickupTime: string;
  afternoonDropTime: string;
  monthlyFee: number;
  assignedStudentsCount: number;
}

export type AnnouncementCategory = 'Academic' | 'Sports' | 'Holiday' | 'Emergency' | 'General';
export type AudienceType = 'All' | 'Teachers' | 'Students' | 'Parents';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  targetAudience: AudienceType;
  author: string;
  publishDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  eventType: 'Sports' | 'Academic' | 'Meeting' | 'Cultural' | 'Holiday';
  organizer: string;
}

export interface SchoolSettings {
  schoolName: string;
  schoolCode: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  principalName: string;
  currentAcademicYear: string;
  currencySymbol: string;
  dateFormat: string;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  primaryColor: string;
  darkMode: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'danger';
  link?: string;
}
