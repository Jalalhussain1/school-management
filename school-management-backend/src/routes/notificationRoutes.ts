import { Router } from 'express';
import {
  getNotifications,
  markNotificationRead,
  clearAllNotifications,
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All authenticated users can access their notifications
router.get('/', authenticateToken, getNotifications);
router.put('/:id/read', authenticateToken, markNotificationRead);
router.put('/clear-all', authenticateToken, clearAllNotifications);

export default router;
