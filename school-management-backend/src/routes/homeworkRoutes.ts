import { Router } from 'express';
import {
  getHomeworkList,
  getHomeworkById,
  createHomework,
  updateHomework,
  deleteHomework,
} from '../controllers/homeworkController';
import { optionalAuth, authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// All roles can read homework
router.get('/', optionalAuth, getHomeworkList);
router.get('/:id', optionalAuth, getHomeworkById);

// Only Admin and Teacher can create/update/delete homework
router.post('/', authenticateToken, requireRoles('Admin', 'Teacher'), createHomework);
router.put('/:id', authenticateToken, requireRoles('Admin', 'Teacher'), updateHomework);
router.delete('/:id', authenticateToken, requireRoles('Admin', 'Teacher'), deleteHomework);

export default router;
