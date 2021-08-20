// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { reviewService } from '../services/index';

/**
 * Create New Review Controller
 * @param       { Object }    req
 * @param       { Object }    res
 * @property    { ObjectId }  req.params.id
 * @property    { ObjectId }  req.user.id
 * @returns     { JSON }
 */
export const addReview = catchAsync(async (req, res) => {
  // 1) Create new review
  const { type, message, statusCode, review } =
    await reviewService.createReview(req.params.id, req.user.id, req.body);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

/**
 * Get All Reviews Controller
 * @param     { Object }  req
 * @param     { Object }  res
 * @property  { String }  req.query.sort
 * @property  { String }  req.query.select
 * @property  { Number }  req.query.page
 * @property  { Number }  req.query.limit
 * @return    { JSON }
 */
export const getAllReviews = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting default params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 1) Get all reviews
  const { type, message, statusCode, reviews } =
    await reviewService.queryReviews(req);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    reviews
  });
});

/**
 * Get Review Using It's ID Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.reviewId
 * @return    { JSON }
 */
export const getReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  // 1) Get review using it's ID
  const { type, message, statusCode, review } =
    await reviewService.queryReviewById(reviewId);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

/**
 * Update Review Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.reviewId
 * @return    { JSON }
 */
export const updateReview = catchAsync(async (req, res) => {
  // 1) Update review using it's ID
  const { type, message, statusCode, review } =
    await reviewService.updateReview(req.params.reviewId, req.body);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    review
  });
});

/**
 * Delete Review Controller
 * @param   { Object }    req
 * @param   { Object }    res
 * @param   { ObjectId }  req.params.reviewId
 * @return  { JSON }
 */
export const deleteReview = catchAsync(async (req, res) => {
  // 1) Delete review using it's ID
  const { type, message, statusCode } = await reviewService.deleteReview(
    req.params.reviewId
  );

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message
  });
});
