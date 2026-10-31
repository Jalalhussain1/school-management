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
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/categories', getFeeCategories);
router.get('/', getFeeVouchers);
router.get('/:id', getFeeVoucherById);
router.post('/', createFeeVoucher);
router.put('/:id', updateFeeVoucher);
router.post('/:id/pay', payFeeVoucher);
router.delete('/:id', deleteFeeVoucher);

export default router;
