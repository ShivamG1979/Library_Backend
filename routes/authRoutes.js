// routes/authRoutes.js
import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile); // Correct route for fetching profile
router.put('/profile', auth, updateProfile); // Correct route for updating profile

export default router;
