// Config
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { reviewService, redisService } from '../services/index';

/**
 * Create New Review
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const addReview = catchAsync(async (req, res, next) => {
  // 1) Allow nested routes
  if (!req.body.product) req.body.product = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  // 2) Create Review
  const review = await reviewService.createReview(req.body);

  // 3) If Everything is OK, Send Review
  return res.status(200).json({
    status: 'success',
    message: 'Review Created Successfully',
    review
  });
});

/**
 * Get All Reviews
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @return  {JSON}
 */
export const getAllReviews = catchAsync(async (req, res, next) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'reviews',
    `page:${page}-sortBy:${sort}-limit:${limit}-select:${select}`
  );

  // 3) Getting Cached Data From Redis
  let reviews = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!reviews) {
    logger.error('No Caching Data');
  }

  reviews = JSON.parse(reviews);

  // 5) If Cached Data Exit Return it
  if (reviews) {
    return res.status(200).json({
      reviews
    });
  }

  // 6) Get All Reviews
  reviews = await reviewService.queryReviews(req);

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(reviews), 'EX', 60);

  // 8) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Found Reviews',
    reviews
  });
});

/**
 * Get Review Using It's ID
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @return  {JSON}
 */
export const getReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('review', `id:${reviewId}`);

  // 2) Getting Cached Data From Redis
  let review = await redisService.get(key);

  // 3) Check If Cached Data Already Exist
  if (!review) {
    logger.error('No Caching Data');
  }

  review = JSON.parse(review);

  // 4) If Cached Data Exit Return it
  if (review) {
    return res.status(200).json({
      review
    });
  }

  // 5) Get Review Using It's ID
  review = await reviewService.queryReviewById(reviewId);

  // 6) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(review), 'EX', 60);

  // 7) If Everything is OK, Send Review
  return res.status(200).json({
    status: 'success',
    message: 'Found Review',
    review
  });
});

/**
 * Update Review
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @return  {JSON}
 */
export const updateReview = catchAsync(async (req, res, next) => {
  // 1) Update Review Using It's ID
  const review = await reviewService.updateReview(req.params.reviewId);

  // 2) If Everything is OK, Send Review
  return res.status(200).json({
    status: 'success',
    message: 'Review Updated Successfully',
    review
  });
});

/**
 * Delete Review
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @return  {JSON}
 */
export const deleteReview = catchAsync(async (req, res, next) => {
  // 1) Delete Review
  await reviewService.deleteReview(req.params.reviewId);

  // 2) If Everything Is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Review Deleted Successfully'
  });
});
