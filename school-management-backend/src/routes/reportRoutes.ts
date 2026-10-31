import { Router } from 'express';
import {
  getEnrollmentReport,
  getFinancialReport,
  getAcademicReport,
} from '../controllers/reportController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/enrollment', getEnrollmentReport);
router.get('/financial', getFinancialReport);
router.get('/academic', getAcademicReport);

export default router;
