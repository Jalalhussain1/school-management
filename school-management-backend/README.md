# EduManage School Management System - Backend API

A complete, clean, scalable, and maintainable RESTful API backend service built with **Express**, **TypeScript**, **JWT authentication**, and persistent data models matching the EduManage School Management System frontend.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js (>= 18.x) & TypeScript
- **Web Framework**: Express.js
- **Data Layer**: Atomic, ACID-compliant persistent JSON Document Database (`data/school_data.json`)
- **Authentication**: JSON Web Tokens (JWT) with password hashing via `bcryptjs`
- **Validation**: Schema-level type validation with `zod`
- **Security & Logging**: `cors`, `morgan` HTTP logger, centralized error handling

---

## 📁 Project Structure

```text
school-management-backend/
├── data/                       # Persistent JSON database storage
│   └── school_data.json
├── dist/                       # Compiled production JavaScript bundle
├── src/
│   ├── config/
│   │   └── index.ts            # Environment variables and system defaults
│   ├── controllers/            # Controller layer with business logic
│   │   ├── announcementController.ts
│   │   ├── attendanceController.ts
│   │   ├── authController.ts
│   │   ├── classController.ts
│   │   ├── dashboardController.ts
│   │   ├── examController.ts
│   │   ├── feeController.ts
│   │   ├── homeworkController.ts
│   │   ├── libraryController.ts
│   │   ├── notificationController.ts
│   │   ├── reportController.ts
│   │   ├── settingController.ts
│   │   ├── studentController.ts
│   │   ├── subjectController.ts
│   │   ├── teacherController.ts
│   │   ├── timetableController.ts
│   │   └── transportController.ts
│   ├── database/
│   │   ├── db.ts               # Atomic document database engine
│   │   └── defaultData.ts      # Seed data matching frontend mock datasets
│   ├── middleware/
│   │   ├── auth.ts             # JWT token authentication & role authorization
│   │   └── errorHandler.ts     # Centralized 404 & error handling
│   ├── routes/                 # Express router modules
│   │   ├── announcementRoutes.ts
│   │   ├── attendanceRoutes.ts
│   │   ├── authRoutes.ts
│   │   ├── classRoutes.ts
│   │   ├── dashboardRoutes.ts
│   │   ├── examRoutes.ts
│   │   ├── feeRoutes.ts
│   │   ├── homeworkRoutes.ts
│   │   ├── index.ts            # Aggregated /api router
│   │   ├── libraryRoutes.ts
│   │   ├── notificationRoutes.ts
│   │   ├── reportRoutes.ts
│   │   ├── settingRoutes.ts
│   │   ├── studentRoutes.ts
│   │   ├── subjectRoutes.ts
│   │   ├── teacherRoutes.ts
│   │   ├── timetableRoutes.ts
│   │   └── transportRoutes.ts
│   ├── types/
│   │   └── index.ts            # Domain TypeScript models
│   └── server.ts               # Server bootstrap & entry point
├── .env                        # Environment configuration
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd school-management-backend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@edumanage.org` | `admin123` | Dr. Sarah Jenkins |
| **Teacher** | `teacher@edumanage.org` | `teacher123` | Dr. Robert Vance |
| **Student** | `student@edumanage.org` | `student123` | Alexander Wright |
| **Parent** | `parent@edumanage.org` | `parent123` | Marcus Wright |

---

## 📡 API Reference

### Health Check
- `GET /api/health`: Service status and timestamp

### Authentication
- `POST /api/auth/login`: Login with email & password, returns JWT token & user profile
- `POST /api/auth/register`: Register a new user with role
- `GET /api/auth/me`: Retrieve current authenticated profile
- `POST /api/auth/forgot-password`: Send password reset link
- `GET /api/auth/demo-credentials`: Get demo login accounts
- `POST /api/auth/switch-role`: Quick role switching

### Students
- `GET /api/students`: List students with search, class filter, status filter, and pagination
- `GET /api/students/:id`: Get student by ID
- `POST /api/students`: Create new student (auto-assigns admissionNo and rollNo)
- `PUT /api/students/:id`: Update student record
- `DELETE /api/students/:id`: Delete student record

### Teachers
- `GET /api/teachers`: List faculty members with search and department filters
- `GET /api/teachers/:id`: Get faculty member by ID
- `POST /api/teachers`: Create new faculty member
- `PUT /api/teachers/:id`: Update faculty member
- `DELETE /api/teachers/:id`: Delete faculty member

### Classes & Subjects
- `GET /api/classes`, `POST /api/classes`, `PUT /api/classes/:id`, `DELETE /api/classes/:id`
- `GET /api/subjects`, `POST /api/subjects`, `PUT /api/subjects/:id`, `DELETE /api/subjects/:id`

### Attendance
- `GET /api/attendance`: Filter by date, classId, section, studentId
- `POST /api/attendance/batch`: Bulk save daily attendance records
- `GET /api/attendance/summary`: Percentage present, absent, late, and on leave

### Fees & Accounting
- `GET /api/fees/categories`: Tuition & fee breakdown categories
- `GET /api/fees`: List fee vouchers with status and search filters
- `POST /api/fees`: Generate new fee voucher
- `PUT /api/fees/:id`: Update fee voucher
- `POST /api/fees/:id/pay`: Record payment with paymentMethod and transactionId
- `DELETE /api/fees/:id`: Delete voucher

### Examinations & Grades
- `GET /api/exams`, `POST /api/exams`, `PUT /api/exams/:id`, `DELETE /api/exams/:id`
- `GET /api/exams/results`: Filter exam results by examId, studentId, or classId
- `POST /api/exams/results`: Save marks, auto-calculates percentages, letter grades (A+, A, B, etc.) and pass/fail

### Timetable & Homework
- `GET /api/timetable`, `POST /api/timetable`, `PUT /api/timetable/:id`, `DELETE /api/timetable/:id`
- `GET /api/homework`, `POST /api/homework`, `PUT /api/homework/:id`, `DELETE /api/homework/:id`

### Library & Circulation
- `GET /api/library/books`, `POST /api/library/books`, `PUT /api/library/books/:id`, `DELETE /api/library/books/:id`
- `GET /api/library/borrows`: View circulation history
- `POST /api/library/borrows/issue`: Issue book (decrements available stock)
- `POST /api/library/borrows/:recordId/return`: Return book (increments available stock)

### Transport
- `GET /api/transport/vehicles`, `POST /api/transport/vehicles`, `PUT /api/transport/vehicles/:id`, `DELETE /api/transport/vehicles/:id`
- `GET /api/transport/routes`, `POST /api/transport/routes`, `PUT /api/transport/routes/:id`, `DELETE /api/transport/routes/:id`

### Announcements & Calendar Events
- `GET /api/announcements`, `POST /api/announcements`, `PUT /api/announcements/:id`, `DELETE /api/announcements/:id`
- `GET /api/events`, `POST /api/events`, `DELETE /api/events/:id`

### Dashboard & Analytics
- `GET /api/dashboard/stats`: Aggregated campus statistics, real-time activities, enrollment and fee charts
- `GET /api/notifications`: Notifications list
- `PUT /api/notifications/:id/read`: Mark notification read
- `PUT /api/notifications/clear-all`: Clear all notifications
- `GET /api/reports/enrollment`: Student demographics & enrollment breakdown
- `GET /api/reports/financial`: Revenue, fee collection, and payment methods
- `GET /api/reports/academic`: Exam grade distributions and pass rates

### Settings & Reset
- `GET /api/settings`: Get institution preferences
- `PUT /api/settings`: Update institution preferences
- `POST /api/settings/reset`: Reset all system data back to default demo seed data
