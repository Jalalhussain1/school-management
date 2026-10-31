import { Router } from 'express';
import {
  getHomeworkList,
  getHomeworkById,
  createHomework,
  updateHomework,
  deleteHomework,
} from '../controllers/homeworkController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getHomeworkList);
router.get('/:id', getHomeworkById);
router.post('/', createHomework);
router.put('/:id', updateHomework);
router.delete('/:id', deleteHomework);

export default router;
