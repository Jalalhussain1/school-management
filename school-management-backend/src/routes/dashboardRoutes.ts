import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/stats', getDashboardStats);

export default router;
