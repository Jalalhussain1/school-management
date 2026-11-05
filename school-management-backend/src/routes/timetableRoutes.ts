import { Router } from 'express';
import {
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
} from '../controllers/timetableController';
import { authenticateToken, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getTimetable);

// Admin-only: Timetable period slot creation, editing, deletion
router.post('/', authenticateToken, requireRoles('Admin'), createTimetableSlot);
router.put('/:id', authenticateToken, requireRoles('Admin'), updateTimetableSlot);
router.delete('/:id', authenticateToken, requireRoles('Admin'), deleteTimetableSlot);

export default router;
