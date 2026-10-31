import { Router } from 'express';
import {
  login,
  register,
  getCurrentUser,
  updateProfile,
  forgotPassword,
  getDemoCredentials,
  switchRole,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);
router.get('/demo-credentials', getDemoCredentials);
router.post('/switch-role', switchRole);

export default router;
