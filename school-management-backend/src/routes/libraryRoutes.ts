import { Router } from 'express';
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBorrowRecords,
  issueBook,
  returnBook,
} from '../controllers/libraryController';
import { optionalAuth, authenticateToken, requireRoles } from '../middleware/auth';

const router = Router();

// All roles can read books and borrow records
router.get('/books', optionalAuth, getBooks);
router.get('/books/:id', optionalAuth, getBookById);
router.get('/borrows', optionalAuth, getBorrowRecords);

// Only Admin can manage books and issue/return
router.post('/books', authenticateToken, requireRoles('Admin'), createBook);
router.put('/books/:id', authenticateToken, requireRoles('Admin'), updateBook);
router.delete('/books/:id', authenticateToken, requireRoles('Admin'), deleteBook);

router.post('/borrows/issue', authenticateToken, requireRoles('Admin'), issueBook);
router.post('/borrows/:recordId/return', authenticateToken, requireRoles('Admin'), returnBook);

export default router;
