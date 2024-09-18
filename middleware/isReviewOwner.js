import Review from '../models/Review.js'; // Adjust path based on your structure

const isReviewOwner = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const userId = req.user?.id;

  try {
    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    if (review.user_id === userId) {
      return next(); // User is the owner of the review
    }

    return res.status(403).json({ error: 'Forbidden: You are not the owner of this review' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

export default isReviewOwner;
