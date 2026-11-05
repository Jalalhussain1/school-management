import { Router } from 'express';
import {
  getFeeCategories,
  getFeeVouchers,
  getFeeVoucherById,
  createFeeVoucher,
  updateFeeVoucher,
  payFeeVoucher,
  deleteFeeVoucher,
} from '../controllers/feeController';
import { authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// Financial Management: Only Admin manages structures; Admin & Parent view and settle vouchers
router.get('/categories', authenticateToken, requireRoles('Admin'), getFeeCategories);
router.get('/', authenticateToken, requireRoles('Admin', 'Parent'), getFeeVouchers);
router.get('/:id', authenticateToken, requireRoles('Admin', 'Parent'), getFeeVoucherById);

// Admin-only billing actions
router.post('/', authenticateToken, requireRoles('Admin'), createFeeVoucher);
router.put('/:id', authenticateToken, requireRoles('Admin'), updateFeeVoucher);
router.delete('/:id', authenticateToken, requireRoles('Admin'), deleteFeeVoucher);

// Payment settlement: Both Admin and Parent can pay
router.post('/:id/pay', authenticateToken, requireRoles('Admin', 'Parent'), payFeeVoucher);

export default router;
