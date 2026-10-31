import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import teacherRoutes from './teacherRoutes';
import classRoutes from './classRoutes';
import subjectRoutes from './subjectRoutes';
import attendanceRoutes from './attendanceRoutes';
import feeRoutes from './feeRoutes';
import examRoutes from './examRoutes';
import timetableRoutes from './timetableRoutes';
import homeworkRoutes from './homeworkRoutes';
import libraryRoutes from './libraryRoutes';
import transportRoutes from './transportRoutes';
import announcementRoutes from './announcementRoutes';
import dashboardRoutes from './dashboardRoutes';
import notificationRoutes from './notificationRoutes';
import reportRoutes from './reportRoutes';
import settingRoutes from './settingRoutes';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EduManage School Management Backend API',
    version: '1.0.0',
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/teachers', teacherRoutes);
apiRouter.use('/classes', classRoutes);
apiRouter.use('/subjects', subjectRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/fees', feeRoutes);
apiRouter.use('/exams', examRoutes);
apiRouter.use('/timetable', timetableRoutes);
apiRouter.use('/homework', homeworkRoutes);
apiRouter.use('/library', libraryRoutes);
apiRouter.use('/transport', transportRoutes);
apiRouter.use('/', announcementRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/settings', settingRoutes);

export default apiRouter;
