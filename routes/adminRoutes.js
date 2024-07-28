import express from 'express';
import { 
    registerAdmin, 
    loginAdmin, 
    getAdminProfile, 
    updateAdminProfile, 
    getAllUsers, 
    getAllBooks, 
    deleteBook, 
    issueBook, 
    updateBook, 
    deleteUser, 
    updateUser,
    addUser, // Import the addUser handler
    addBook
} from '../controllers/adminController.js';
import { auth, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register route
router.post('/register', registerAdmin);

// Login route
router.post('/login', loginAdmin);

// Get profile route (protected)
router.get('/profile', auth, isAdmin, getAdminProfile);
 
// Update profile route (protected)
router.put('/profile', auth, isAdmin, updateAdminProfile);

// Get all users (protected)
router.get('/users', auth, isAdmin, getAllUsers);

// Add user (protected)
router.post('/users', auth, isAdmin, addUser); // Add this line

// Delete user (protected)
router.delete('/users/:id', auth, isAdmin, deleteUser);

// Update user (protected)
router.put('/users/:id', auth, isAdmin, updateUser);

// Get all books (protected)
router.get('/books', auth, isAdmin, getAllBooks);

// Delete book (protected)
router.delete('/books/:id', auth, isAdmin, deleteBook);

// Issue book (protected)
router.put('/books/issue/:id', auth, isAdmin, issueBook);

// Update book route (protected)
router.put('/books/:id', auth, isAdmin, updateBook);

// Add book route (protected)
router.post('/books', auth, isAdmin, addBook);


export default router;
