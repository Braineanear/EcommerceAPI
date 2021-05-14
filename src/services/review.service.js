// Utils
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Models
import { Review } from '../models/index';

/**
 * Create New Review
 * @param {Object} body
 * @returns {Promise<Review>}
 */
export const createReview = catchAsync(async (body) => {
  // 1) Check All Fields Provieded
  if (!body.product || !body.user || !body.review || !body.rating) {
    throw new AppError('All fields are required', 400);
  }

  // 2) Create Review
  const review = Review.create(body);

  // 3) If Everything is OK, Send Review
  return review;
});

/**
 * Query All Reviews
 * @param {Object} req
 * @returns {Promise<Reviews>}
 */
export const queryReviews = catchAsync(async (req) => {
  // 1) Get All Reviews
  const reviews = await APIFeatures(req, Review, [
    {
      path: 'product',
      select: 'name mainImage images description price quantity'
    },
    {
      path: 'category',
      select: 'name description status image'
    }
  ]);

  // 2) Check if Reviews Already Exist
  if (reviews.length === 0) {
    throw new AppError('No Reviews Found', 404);
  }

  // 3) If Everything is OK, Send Reviews
  return reviews;
});

/**
 * Query Review Using It's ID
 * @param {String} id
 * @returns {Promise<Review>}
 */
export const queryReviewById = catchAsync(async (id) => {
  // 1) Get Review Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Already Exist
  if (!review) {
    throw new AppError(`No Review Found With This ID: ${id}`, 404);
  }

  // 3) If Everything is OK, Send Review
  return review;
});

/**
 * Update Review Using It's ID
 * @param {String} id
 * @param {Object} body
 * @returns {Promise<Review>}
 */
export const updateReview = catchAsync(async (id, body) => {
  // 1) Get Review Document Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Already Exist
  if (!review) {
    throw new AppError(`No Review Found With This ID: ${id}`, 404);
  }

  // 3) Update Review
  const result = await Review.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 4) If Everything is OK, Send Result
  return result;
});

/**
 * Delete Review Using It's ID'
 * @param {String} id
 */
export const deleteReview = catchAsync(async (id) => {
  // 1) Get Review Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Already Exist
  if (!review) {
    throw new AppError(`No Review Found With This ID: ${id}`, 404);
  }

  // 3) Delete Review
  await Review.findByIdAndDelete(id);
});
