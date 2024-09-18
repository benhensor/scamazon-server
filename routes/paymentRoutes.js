import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { processPayment, getPaymentById } from '../controllers/paymentController.js';

// Create payment for an order (authenticated)
router.post('/', verifyToken, processPayment); // POST /api/payments

// Get payment details (authenticated)
router.get('/:paymentId', verifyToken, getPaymentById); // GET /api/payments/:paymentId

export default router;