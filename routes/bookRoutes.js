//routes/bookRoutes.js
import express from 'express';
import { getBooks, addBook, deleteBook, getBooksByUser, issueBook } from '../controllers/bookController.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Public route to get all books
router.get('/', getBooks);

// Protected route to add a new book
router.post('/', auth, addBook); // Ensure only admin can add books

// Protected route to delete a book
router.delete('/:id', auth,  deleteBook); // Ensure only admin can delete books

// Protected route to get books by user
router.get('/user', auth, getBooksByUser);

// Protected route to issue a book
router.put('/issue/:id', auth,isAdmin, issueBook);

// Admin route to get all users
router.get('/admin/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
