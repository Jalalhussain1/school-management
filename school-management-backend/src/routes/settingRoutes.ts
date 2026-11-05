import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  resetAllData,
} from '../controllers/settingController';
import { optionalAuth, authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// Anyone can read settings (school info, etc.)
router.get('/', optionalAuth, getSettings);

// Only Admin can update settings or reset data
router.put('/', authenticateToken, requireRoles('Admin'), updateSettings);
router.post('/reset', authenticateToken, requireRoles('Admin'), resetAllData);

export default router;
