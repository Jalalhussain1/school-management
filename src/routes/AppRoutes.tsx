import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRolePermission } from '../types/auth';

// Auth Pages
import { LoginPage } from '../modules/auth/LoginPage';
import { RegisterPage } from '../modules/auth/RegisterPage';
import { ForgotPasswordPage } from '../modules/auth/ForgotPasswordPage';
import { AccessDeniedPage } from '../modules/auth/AccessDeniedPage';

// Academic & Administrative Pages
import { DashboardPage } from '../modules/dashboard/DashboardPage';
import { StudentsPage } from '../modules/students/StudentsPage';
import { TeachersPage } from '../modules/teachers/TeachersPage';
import { ClassesPage } from '../modules/classes/ClassesPage';
import { SubjectsPage } from '../modules/subjects/SubjectsPage';
import { AttendancePage } from '../modules/attendance/AttendancePage';
import { FeesPage } from '../modules/fees/FeesPage';
import { ExaminationsPage } from '../modules/examinations/ExaminationsPage';
import { TimetablePage } from '../modules/timetable/TimetablePage';
import { HomeworkPage } from '../modules/homework/HomeworkPage';
import { LibraryPage } from '../modules/library/LibraryPage';
import { TransportPage } from '../modules/transport/TransportPage';
import { AnnouncementsPage } from '../modules/announcements/AnnouncementsPage';
import { ReportsPage } from '../modules/reports/ReportsPage';
import { SettingsPage } from '../modules/settings/SettingsPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  path: string;
}

const RoleProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, path }) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = hasRolePermission(currentUser?.role, path);
  if (!hasAccess) {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Role-Protected Application Routes */}
      <Route
        path="/"
        element={
          <RoleProtectedRoute path="/">
            <DashboardPage />
          </RoleProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />

      <Route
        path="/students"
        element={
          <RoleProtectedRoute path="/students">
            <StudentsPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <RoleProtectedRoute path="/teachers">
            <TeachersPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <RoleProtectedRoute path="/classes">
            <ClassesPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <RoleProtectedRoute path="/subjects">
            <SubjectsPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <RoleProtectedRoute path="/attendance">
            <AttendancePage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/fees"
        element={
          <RoleProtectedRoute path="/fees">
            <FeesPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/examinations"
        element={
          <RoleProtectedRoute path="/examinations">
            <ExaminationsPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/timetable"
        element={
          <RoleProtectedRoute path="/timetable">
            <TimetablePage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/homework"
        element={
          <RoleProtectedRoute path="/homework">
            <HomeworkPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <RoleProtectedRoute path="/library">
            <LibraryPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/transport"
        element={
          <RoleProtectedRoute path="/transport">
            <TransportPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <RoleProtectedRoute path="/announcements">
            <AnnouncementsPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <RoleProtectedRoute path="/reports">
            <ReportsPage />
          </RoleProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <RoleProtectedRoute path="/settings">
            <SettingsPage />
          </RoleProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
