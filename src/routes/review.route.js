import express from 'express';

// Middlewares
import auth from '../middlewares/auth';

// Controllers
import { reviewController } from '../controllers/index';

const { getAllReviews, getReview, addReview, updateReview, deleteReview } =
  reviewController;

const router = express.Router({ mergeParams: true });

router.get('/', getAllReviews);
router.get('/:reviewId', getReview);

router.use(auth('user', 'admin', 'seller'));

router.post('/', addReview);

router.route('/:reviewId').patch(updateReview).delete(deleteReview);

export default router;
