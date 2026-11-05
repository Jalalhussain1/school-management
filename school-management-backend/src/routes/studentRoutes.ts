import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  inviteStudent,
} from '../controllers/studentController';
import { authenticateToken, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getStudents);
router.get('/:id', optionalAuth, getStudentById);

// Admin-only operations: Admission, Inviting, Editing, Deleting
router.post('/', authenticateToken, requireRoles('Admin'), createStudent);
router.post('/:id/invite', authenticateToken, requireRoles('Admin'), inviteStudent);
router.put('/:id', authenticateToken, requireRoles('Admin'), updateStudent);
router.delete('/:id', authenticateToken, requireRoles('Admin'), deleteStudent);

export default router;
