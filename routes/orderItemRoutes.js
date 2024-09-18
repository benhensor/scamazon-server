import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { getOrderItemById, updateOrderItem } from '../controllers/orderItemController.js';

// Get order item details (authenticated)
router.get('/:orderItemId', verifyToken, getOrderItemById); // GET /api/order-items/:orderItemId

// Update order item (Admin only)
router.put('/:orderItemId', verifyToken, isAdmin, updateOrderItem); // PUT /api/order-items/:orderItemId

export default router;
