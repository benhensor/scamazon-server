import express from 'express';
const router = express.Router();
import verifyToken from '../middleware/verifyToken.js';
import { fetchPaymentMethods, setDefaultPaymentMethod } from '../controllers/paymentMethodsController.js';

// Create payment for an order (authenticated)
router.get('/', verifyToken, fetchPaymentMethods); 

// Get payment details (authenticated)
router.put('/default/:paymentMethodId', verifyToken, setDefaultPaymentMethod);

export default router;