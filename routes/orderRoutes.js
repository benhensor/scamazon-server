import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';

// Create new order (authenticated)
router.post('/', verifyToken, createOrder); // POST /api/orders

// Get all orders for a user (authenticated)
router.get('/', verifyToken, getUserOrders); // GET /api/orders

// Get order by ID (authenticated)
router.get('/:id', verifyToken, getOrderById); // GET /api/orders/:id

// Update order status (Admin only)
router.put('/:id', verifyToken, isAdmin, updateOrderStatus); // PUT /api/orders/:id

export default router;
