import { Router } from 'express';
import {
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
} from '../controllers/notificationController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/clear-all', clearAllNotifications);

export default router;
