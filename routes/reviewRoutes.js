import express from 'express';
const router = express.Router();
import { verifyToken } from '../middleware/verifyToken.js';
import { isReviewOwner } from '../middleware/isReviewOwner.js';
import { getProductReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';

// Get all reviews for a product
router.get('/:productId', getProductReviews); // GET /api/reviews/:productId

// Create new review (authenticated)
router.post('/:productId', verifyToken, createReview); // POST /api/reviews/:productId

// Update review (authenticated and owner of review)
router.put('/:reviewId', verifyToken, isReviewOwner, updateReview); // PUT /api/reviews/:reviewId

// Delete review (authenticated and owner of review)
router.delete('/:reviewId', verifyToken, isReviewOwner, deleteReview); // DELETE /api/reviews/:reviewId

export default router;