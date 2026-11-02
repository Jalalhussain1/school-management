import { Router } from 'express';
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  inviteTeacher,
} from '../controllers/teacherController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', createTeacher);
router.post('/:id/invite', inviteTeacher);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

export default router;
