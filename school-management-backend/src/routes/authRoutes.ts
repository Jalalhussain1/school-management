import { Router } from 'express';
import {
  login,
  register,
  getCurrentUser,
  updateProfile,
  forgotPassword,
  getDemoCredentials,
  switchRole,
  inviteUser,
  getInvitations,
  getAllUsers,
  verifyInvitation,
  setupAccount,
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

// Invitations & Setup Account
router.post('/invite', authenticateToken, inviteUser);
router.get('/invitations', authenticateToken, getInvitations);
router.get('/users', authenticateToken, getAllUsers);
router.get('/verify-invite', verifyInvitation);
router.post('/setup-account', setupAccount);

export default router;
