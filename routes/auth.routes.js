import express from 'express';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', verifyToken, getCurrentUser);

export default router;
