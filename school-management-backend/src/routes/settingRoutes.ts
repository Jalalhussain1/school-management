import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  resetAllData,
} from '../controllers/settingController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/reset', resetAllData);

export default router;
