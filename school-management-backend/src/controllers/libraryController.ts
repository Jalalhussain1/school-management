import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../database/db';
import { LibraryBook, BookBorrowRecord } from '../types';

const bookCreateSchema = z.object({
  isbn: z.string().min(1),
  title: z.string().min(1),
  author: z.string().min(1),
  category: z.string().min(1),
  publisher: z.string().min(1),
  totalCopies: z.number().int().positive(),
  availableCopies: z.number().int().nonnegative().optional(),
  shelfLocation: z.string().min(1),
  publicationYear: z.number().int(),
});

const issueBookSchema = z.object({
  bookId: z.string(),
  bookTitle: z.string(),
  borrowerType: z.enum(['Student', 'Teacher']),
  borrowerId: z.string(),
  borrowerName: z.string(),
  issueDate: z.string(),
  dueDate: z.string(),
});

export const getBooks = async (req: Request, res: Response) => {
  const { search, category } = req.query as Record<string, string>;

  let books = db.getBooks();

  if (search) {
    const q = search.toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'ALL') {
    books = books.filter((b) => b.category === category);
  }

  return res.json({
    success: true,
    total: books.length,
    data: books,
  });
};

export const getBookById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const book = db.getBookById(id);

  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }

  return res.json({ success: true, data: book });
};

export const createBook = async (req: Request, res: Response) => {
  const data = bookCreateSchema.parse(req.body);

  const newBook: LibraryBook = {
    ...data,
    id: `bk-${Date.now()}`,
    availableCopies: data.availableCopies ?? data.totalCopies,
  };

  db.addBook(newBook);

  return res.status(201).json({
    success: true,
    message: `Book "${newBook.title}" cataloged successfully`,
    data: newBook,
  });
};

export const updateBook = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updated = db.updateBook(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }

  return res.json({
    success: true,
    message: 'Book details updated successfully',
    data: updated,
  });
};

export const deleteBook = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const success = db.deleteBook(id);

  if (!success) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }

  return res.json({
    success: true,
    message: 'Book removed from library',
  });
};

export const getBorrowRecords = async (_req: Request, res: Response) => {
  const records = db.getBorrowRecords();
  return res.json({ success: true, total: records.length, data: records });
};

export const issueBook = async (req: Request, res: Response) => {
  const data = issueBookSchema.parse(req.body);

  const book = db.getBookById(data.bookId);
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }

  if (book.availableCopies <= 0) {
    return res.status(400).json({ success: false, message: 'No available copies left to issue' });
  }

  const record: BookBorrowRecord = {
    ...data,
    id: `brw-${Date.now()}`,
    status: 'Borrowed',
  };

  db.issueBook(record);

  return res.status(201).json({
    success: true,
    message: `Book issued to ${record.borrowerName}`,
    data: record,
  });
};

export const returnBook = async (req: Request, res: Response) => {
  const recordId = req.params.recordId as string;
  const returned = db.returnBook(recordId);

  if (!returned) {
    return res.status(404).json({ success: false, message: 'Borrow record not found' });
  }

  return res.json({
    success: true,
    message: 'Book returned successfully',
    data: returned,
  });
};
