import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import verifyTokenOptional from '../middleware/verifyTokenOptional.js';
import { getUserBasket, addItemToBasket, removeItemFromBasket, clearBasket } from '../controllers/basketController.js';

// Get user Basket (authenticated)
router.get('/', verifyToken, getUserBasket); // GET /api/Basket

// Add item to Basket (authenticated or guest)
router.post('/add', addItemToBasket); // POST /api/Basket/add

// Remove item from Basket (authenticated or guest)
router.delete('/remove', verifyTokenOptional, removeItemFromBasket); // DELETE /api/Basket/remove

// Clear Basket (authenticated)
router.delete('/clear', verifyToken, clearBasket); // DELETE /api/Basket/clear

export default router;