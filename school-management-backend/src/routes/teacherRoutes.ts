import { Router } from 'express';
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  inviteTeacher,
} from '../controllers/teacherController';
import { authenticateToken, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getTeachers);
router.get('/:id', optionalAuth, getTeacherById);

// Admin-only faculty operations: Hiring, Inviting, Editing, Deleting
router.post('/', authenticateToken, requireRoles('Admin'), createTeacher);
router.post('/:id/invite', authenticateToken, requireRoles('Admin'), inviteTeacher);
router.put('/:id', authenticateToken, requireRoles('Admin'), updateTeacher);
router.delete('/:id', authenticateToken, requireRoles('Admin'), deleteTeacher);

export default router;
