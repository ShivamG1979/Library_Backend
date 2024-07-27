import express from 'express';
import { getBooks, addBook, deleteBook, getBooksByUser, issueBook } from '../controllers/bookController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all books
router.get('/', getBooks);

// Protected route to add a new book
router.post('/', authMiddleware, addBook);

// Protected route to delete a book
router.delete('/:id', authMiddleware, deleteBook);

// Protected route to get books by user
router.get('/user', authMiddleware, getBooksByUser);

// Protected route to issue a book
router.put('/issue/:id', authMiddleware, issueBook);

export default router;
