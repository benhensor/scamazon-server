import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyTokenOptional } from '../middleware/verifyTokenOptional.js';
import { getUserCart, addItemToCart, removeItemFromCart, clearCart } from '../controllers/cartController.js';

// Get user cart (authenticated)
router.get('/', verifyToken, getUserCart); // GET /api/cart

// Add item to cart (authenticated or guest)
router.post('/add', verifyTokenOptional, addItemToCart); // POST /api/cart/add

// Remove item from cart (authenticated or guest)
router.delete('/remove', verifyTokenOptional, removeItemFromCart); // DELETE /api/cart/remove

// Clear cart (authenticated)
router.delete('/clear', verifyToken, clearCart); // DELETE /api/cart/clear

export default router;