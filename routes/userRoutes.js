import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import { registerUser, loginUser, logoutUser, getCurrentUser, getUserProfile, updateUser, deleteUser } from '../controllers/userController.js';

// User registration
router.post('/register', registerUser); // POST /api/users/register

// User login
router.post('/login', loginUser); // POST /api/users/login

// User logout
router.post('/logout', verifyToken, logoutUser);

// Get current user (authenticated)
router.get('/current', verifyToken, getCurrentUser); // GET /api/users/validate

// Get user profile (authenticated)
router.get('/profile', verifyToken, getUserProfile); // GET /api/users/profile

// Update user profile (authenticated)
router.put('/profile', verifyToken, updateUser); // PUT /api/users/profile

// Delete user (authenticated)
router.delete('/profile', verifyToken, deleteUser); // DELETE /api/users/profile

export default router;