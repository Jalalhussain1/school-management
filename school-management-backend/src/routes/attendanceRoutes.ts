import { Router } from 'express';
import {
  getAttendance,
  batchSaveAttendance,
  getAttendanceSummary,
} from '../controllers/attendanceController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getAttendance);
router.post('/batch', batchSaveAttendance);
router.get('/summary', getAttendanceSummary);

export default router;
