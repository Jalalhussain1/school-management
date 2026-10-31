import { Router } from 'express';
import {
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
} from '../controllers/timetableController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getTimetable);
router.post('/', createTimetableSlot);
router.put('/:id', updateTimetableSlot);
router.delete('/:id', deleteTimetableSlot);

export default router;
