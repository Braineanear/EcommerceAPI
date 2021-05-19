// Config
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { reviewService, redisService } from '../services/index';

/**
 * Create New Review
 * @param       {Object}    req
 * @param       {Object}    res
 * @property    {ObjectId}  req.params.id
 * @property    {ObjectId}  req.user.id
 * @returns     {JSON}
 */
export const addReview = catchAsync(async (req, res) => {
  // 1) Create Review
  const { type, message, statusCode, review } =
    await reviewService.createReview(req.params.id, req.user.id, req.body);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Review
  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

/**
 * Get All Reviews
 * @param     {Object}  req
 * @param     {Object}  res
 * @property  {String}  req.query.sort
 * @property  {String}  req.query.select
 * @property  {Number}  req.query.page
 * @property  {Number}  req.query.limit
 * @return    {JSON}
 */
export const getAllReviews = catchAsync(async (req, res) => {
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
  let cached = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!cached) {
    logger.error('No Caching Data');
  }

  cached = JSON.parse(cached);

  // 5) If Cached Data Exit Return it
  if (cached) {
    return res.status(200).json({
      type: 'Success',
      message: 'Reviews Found Successfully',
      reviews: cached
    });
  }

  // 6) Get All Reviews
  const { type, message, statusCode, reviews } =
    await reviewService.queryReviews(req);

  // 8) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 8) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(reviews), 'EX', 60);

  // 9) If Everything is OK, Send Data
  return res.status(statusCode).json({
    type,
    message,
    reviews
  });
});

/**
 * Get Review Using It's ID
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.reviewId
 * @return    {JSON}
 */
export const getReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('review', `id:${reviewId}`);

  // 2) Getting Cached Data From Redis
  let cached = await redisService.get(key);

  // 3) Check If Cached Data Already Exist
  if (!cached) {
    logger.error('No Caching Data');
  }

  cached = JSON.parse(cached);

  // 4) If Cached Data Exit Return it
  if (cached) {
    return res.status(200).json({
      type: 'Success',
      message: 'Review Found Successfully',
      review: cached
    });
  }

  // 5) Get Review Using It's ID
  const { type, message, statusCode, review } =
    await reviewService.queryReviewById(reviewId);

  // 6) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(review), 'EX', 60);

  // 8) If Everything is OK, Send Review
  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

/**
 * Update Review
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.reviewId
 * @return    {JSON}
 */
export const updateReview = catchAsync(async (req, res) => {
  // 1) Update Review Using It's ID
  const { type, message, statusCode, review } =
    await reviewService.updateReview(req.params.reviewId, req.body);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Review
  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

/**
 * Delete Review
 * @param   {Object}    req
 * @param   {Object}    res
 * @param   {ObjectId}  req.params.reviewId
 * @return  {JSON}
 */
export const deleteReview = catchAsync(async (req, res) => {
  // 1) Delete Review
  const { type, message, statusCode } = await reviewService.deleteReview(
    req.params.reviewId
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything Is OK, Send Message
  return res.status(statusCode).json({
    type,
    message
  });
});
