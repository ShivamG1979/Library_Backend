import express from 'express';
import { register, login, getProfile,updateProfile } from '../controllers/authController.js';
import auth from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile); // Route to get user profile
router.put('/profile', auth, updateProfile);

export default router;
