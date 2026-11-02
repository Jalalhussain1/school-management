import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  inviteStudent,
} from '../controllers/studentController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.post('/:id/invite', inviteStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
