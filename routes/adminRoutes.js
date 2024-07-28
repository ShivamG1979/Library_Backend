import express from 'express';
import { registerAdmin, loginAdmin, getAdminProfile, updateAdminProfile } from '../controllers/adminController.js';
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

export default router;
