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
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

router.get('/borrows', getBorrowRecords);
router.post('/borrows/issue', issueBook);
router.post('/borrows/:recordId/return', returnBook);

export default router;
