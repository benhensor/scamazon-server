import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

// Get all categories
router.get('/', getAllCategories); // GET /api/categories

// Create new category (Admin only)
router.post('/', verifyToken, isAdmin, createCategory); // POST /api/categories

// Update category (Admin only)
router.put('/:id', verifyToken, isAdmin, updateCategory); // PUT /api/categories/:id

// Delete category (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteCategory); // DELETE /api/categories/:id

export default router;
