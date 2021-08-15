import express from 'express';

// Middlewares

// Controllers
import { reviewController } from '../controllers/index';

const { getAllReviews, getReview, addReview, updateReview, deleteReview } =
  reviewController;

const router = express.Router({ mergeParams: true });

router.get('/', getAllReviews);
router.get('/:reviewId', getReview);

router.post('/', addReview);

router.route('/:reviewId').patch(updateReview).delete(deleteReview);

export default router;
