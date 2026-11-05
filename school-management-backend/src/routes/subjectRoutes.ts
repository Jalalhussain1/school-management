import { Router } from 'express';
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController';
import { authenticateToken, optionalAuth, requireRoles } from '../middleware/auth';

const router = Router();

router.get('/', optionalAuth, getSubjects);
router.get('/:id', optionalAuth, getSubjectById);

// Admin-only: Curriculum & Subject management
router.post('/', authenticateToken, requireRoles('Admin'), createSubject);
router.put('/:id', authenticateToken, requireRoles('Admin'), updateSubject);
router.delete('/:id', authenticateToken, requireRoles('Admin'), deleteSubject);

export default router;
