import express from 'express';
const router = express.Router();
// import verifyTokenOptional from '../middleware/verifyTokenOptional.js';
import { getBasketItems, addBasketItem, updateBasketItemQuantity, removeBasketItem } from '../controllers/basketItemController.js';

// Get all items in a user's Basket (authenticated)
router.get('/', getBasketItems); // GET /api/Basket-items

// Add a product to the Basket (authenticated or guest)
router.post('/', addBasketItem); // POST /api/Basket-items

// Update quantity of a product in the Basket (authenticated or guest)
router.put('/:id', updateBasketItemQuantity); // PUT /api/Basket-items/:id

// Remove a product from the Basket (authenticated or guest)
router.delete('/:id', removeBasketItem); // DELETE /api/Basket-items/:id

export default router;