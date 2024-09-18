import express from 'express';
const router = express.Router();
import { verifyTokenOptional } from '../middleware/verifyTokenOptional.js';
import { getCartItems, addCartItem, updateCartItemQuantity, removeCartItem } from '../controllers/cartItemController.js';

// Get all items in a user's cart (authenticated)
router.get('/', verifyTokenOptional, getCartItems); // GET /api/cart-items

// Add a product to the cart (authenticated or guest)
router.post('/', verifyTokenOptional, addCartItem); // POST /api/cart-items

// Update quantity of a product in the cart (authenticated or guest)
router.put('/:id', verifyTokenOptional, updateCartItemQuantity); // PUT /api/cart-items/:id

// Remove a product from the cart (authenticated or guest)
router.delete('/:id', verifyTokenOptional, removeCartItem); // DELETE /api/cart-items/:id

export default router;