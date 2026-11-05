import { Router } from 'express';
import {
  getAttendance,
  batchSaveAttendance,
  getAttendanceSummary,
} from '../controllers/attendanceController';
import { authenticateToken, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getAttendance);
router.get('/summary', optionalAuth, getAttendanceSummary);

// Attendance marking: Only Admin and Teachers can mark and submit registers
router.post('/batch', authenticateToken, requireRoles('Admin', 'Teacher'), batchSaveAttendance);

export default router;
