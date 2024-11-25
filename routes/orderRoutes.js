import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import { addOrder, fetchOrders, getOrderById, deleteOrder } from '../controllers/orderController.js';

// Create new order (authenticated)
router.post('/add', verifyToken, addOrder); // POST /api/orders

// Get all orders for a user (authenticated)
router.get('/fetch', verifyToken, fetchOrders); // GET /api/orders

// Get order by ID (authenticated)
router.get('/:id', verifyToken, getOrderById); // GET /api/orders/:id

router.delete('/delete/:id', verifyToken, deleteOrder); // DELETE /api/orders/:id

export default router;
