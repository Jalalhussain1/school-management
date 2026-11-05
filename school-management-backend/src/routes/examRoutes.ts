import { Router } from 'express';
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamResults,
  saveExamResult,
} from '../controllers/examController';
import { optionalAuth, authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// All roles can read exams and results
router.get('/', optionalAuth, getExams);
router.get('/results', optionalAuth, getExamResults);
router.get('/:id', optionalAuth, getExamById);

// Only Admin can create/update/delete exams
router.post('/', authenticateToken, requireRoles('Admin'), createExam);
router.put('/:id', authenticateToken, requireRoles('Admin'), updateExam);
router.delete('/:id', authenticateToken, requireRoles('Admin'), deleteExam);

// Admin and Teacher can save/grade results
router.post('/results', authenticateToken, requireRoles('Admin', 'Teacher'), saveExamResult);

export default router;
