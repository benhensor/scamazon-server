import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
// import verifyTokenOptional from '../middleware/verifyTokenOptional.js';
import { fetchBasket, updateBasket, toggleItemSelected, updateItemQuantity } from '../controllers/basketController.js';
// import { getUserBasket, createUserBasket, addItemToBasket, toggleItemSelected, selectAllItems, deselectAllItems, updateItemQuantity, removeItemFromBasket, clearBasket } from '../controllers/basketController.js';

router.get('/', verifyToken, fetchBasket); // GET /api/Basket
router.put('/updatebasket', verifyToken, updateBasket); // PUT /api/Basket/update
router.patch('/toggleselected/:id', verifyToken, toggleItemSelected); // PUT /api/Basket/toggle
router.patch('/updatequantity/:id', verifyToken, updateItemQuantity); // PUT /api/Basket/update
// Get user Basket (authenticated)
router.get('/', verifyToken, getUserBasket); // GET /api/Basket
// Sync Basket with user account (authenticated)
router.post('/sync', verifyToken, createUserBasket); // POST /api/Basket/sync
// Add item to Basket (authenticated or guest)
router.post('/add', verifyToken, addItemToBasket); // POST /api/Basket/add
// Toggle item selected status in Basket (authenticated or guest)
router.put('/select/:id', verifyTokenOptional, toggleItemSelected); // PUT /api/Basket/toggle
// Select all items in Basket (authenticated or guest)
router.put('/select-all', verifyTokenOptional, selectAllItems); // PUT /api/Basket/select-all
// Deselect all items in Basket (authenticated or guest)
router.put('/deselect-all', verifyTokenOptional, deselectAllItems); // PUT /api/Basket/deselect-all
// Update item quantity in Basket (authenticated or guest)
router.put('/update/:id', verifyTokenOptional, updateItemQuantity); // PUT /api/Basket/update
// Remove item from Basket (authenticated or guest)
router.delete('/remove/:id', verifyTokenOptional, removeItemFromBasket); // DELETE /api/Basket/remove
// Clear Basket (authenticated)
router.delete('/clear', verifyToken, clearBasket); // DELETE /api/Basket/clear

export default router;