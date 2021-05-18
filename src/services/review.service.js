// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Models
import { Review } from '../models/index';

/**
 * Create New Review
 * @param   {Object} body
 * @returns {Object<type|message|statusCode|review>}
 */
export const createReview = catchAsync(async (body) => {
  const { product, user, review, rating } = body;

  // 1) Check If User Entered All Fields
  if (!product || !user || !review || !rating) {
    return {
      type: 'Error',
      message: 'All Fields Are Required',
      statusCode: 400
    };
  }

  // 2) Create Review
  const newReview = await Review.create({
    product,
    user,
    review,
    rating
  });

  // 3) If Everything is OK, Send Review
  return {
    type: 'Success',
    message: 'Review Created Successfully',
    statusCode: 201,
    newReview
  };
});

/**
 * Query All Reviews
 * @param   {Object} req
 * @returns {Object<type|message|statusCode|reviews>}
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

  // 2) Check if Reviews Doesn't Exist
  if (reviews.length === 0) {
    return {
      type: 'Error',
      message: 'No Reviews Found',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Reviews
  return {
    type: 'Success',
    message: 'Reviews Found Successfully',
    statusCode: 200,
    reviews
  };
});

/**
 * Query Review Using It's ID
 * @param   {ObjectId} id
 * @returns {Object<type|message|statusCode|review>}
 */
export const queryReviewById = catchAsync(async (id) => {
  // 1) Get Review Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Doesn't Exist
  if (!review) {
    return {
      type: 'Error',
      message: `No Review Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Review
  return {
    type: 'Success',
    message: 'Review Found Successfully',
    statusCode: 200,
    review
  };
});

/**
 * Update Review Using It's ID
 * @param   {ObjectId} id
 * @param   {Object} body
 * @returns {Object<type|message|statusCode|review>}
 */
export const updateReview = catchAsync(async (id, body) => {
  // 1) Get Review Document Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Doesn't Exist
  if (!review) {
    return {
      type: 'Error',
      message: `No Review Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Update Review
  const result = await Review.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 4) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'Review Updated Successfully',
    statusCode: 200,
    result
  };
});

/**
 * Delete Review Using It's ID'
 * @param   {ObjectId} id
 * @returns   {Object<type|message|statusCode>}
 */
export const deleteReview = catchAsync(async (id) => {
  // 1) Get Review Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Already Exist
  if (!review) {
    return {
      type: 'Error',
      message: `No Review Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Delete Review
  await Review.findByIdAndDelete(id);

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'Review Deleted Successfully',
    statusCode: 200
  };
});
