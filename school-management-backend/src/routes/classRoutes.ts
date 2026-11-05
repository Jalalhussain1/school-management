import { Router } from 'express';
import {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from '../controllers/classController';
import { authenticateToken, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getClasses);
router.get('/:id', optionalAuth, getClassById);

// Admin-only: Create class/section, Update, Delete
router.post('/', authenticateToken, requireRoles('Admin'), createClass);
router.put('/:id', authenticateToken, requireRoles('Admin'), updateClass);
router.delete('/:id', authenticateToken, requireRoles('Admin'), deleteClass);

export default router;
