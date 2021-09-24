// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Models
import { Review } from '../models/index';

/**
 * @desc    Create New Review
 * @param   { Object } body - Body object data
 * @param   { String } product - Product ID
 * @param   { Object } user - An object contains logged in user data
 * @returns { Object<type|message|statusCode|review> }
 */
export const createReview = catchAsync(async (product, user, body) => {
  const { review, rating } = body;

  // 1) Check if user entered all fields
  if (!review || !rating) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  if (rating < 1) {
    return {
      type: 'Error',
      message: 'ratingLessThanOne',
      statusCode: 400
    };
  }

  const checkUser = await Review.find({ user, product });

  // 2) Check if the user make a review before on that product
  if (checkUser.length !== 0) {
    return {
      type: 'Error',
      message: 'onlyOneReview',
      statusCode: 400
    };
  }

  // 3) Create review
  const newReview = await Review.create({
    product,
    user,
    review,
    rating
  });

  // 4) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulReviewCreate',
    statusCode: 201,
    newReview
  };
});

/**
 * @desc    Query All Reviews
 * @param   { Object } req - Request object
 * @returns { Object<type|message|statusCode|reviews> }
 */
export const queryReviews = catchAsync(async (req) => {
  let reviews = await APIFeatures(req, Review);

  // 1) Check if reviews doesn't exist
  if (reviews.length === 0) {
    return {
      type: 'Error',
      message: 'noReviewsFound',
      statusCode: 404
    };
  }

  // 2) Filter review to select only reviews of the product only
  reviews = reviews.filter(
    (review) => review.product.toString() === req.params.productId.toString()
  );

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulReviewsFound',
    statusCode: 200,
    reviews
  };
});

/**
 * @desc    Query Review Using It's ID
 * @param   { String } id - Review ID
 * @returns { Object<type|message|statusCode|review> }
 */
export const queryReviewById = catchAsync(async (id) => {
  const review = await Review.findById(id);

  // 1) Check if review doesn't exist
  if (!review) {
    return {
      type: 'Error',
      message: 'noReviewFound',
      statusCode: 404
    };
  }

  // 2) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulReviewFound',
    statusCode: 200,
    review
  };
});

/**
 * @desc    Update Review Using It's ID
 * @param   { String } id - Review ID
 * @param   { Object } body - Body object data
 * @param   { Object } user - An object contains logged in user data
 * @returns { Object<type|message|statusCode|review> }
 */
export const updateReview = catchAsync(async (user, id, body) => {
  const review = await Review.findById(id);

  // 1) Check if review doesn't exist
  if (!review) {
    return {
      type: 'Error',
      message: 'noReviewFound',
      statusCode: 404
    };
  }

  // 2) Check if the one who want to update review is the review creator
  if (user.id.toString() !== review.user.toString()) {
    return {
      type: 'Error',
      statusCode: 400,
      message: 'notReviewCreator'
    };
  }

  // 3) Check if review rating less than 1
  if (body.rating < 1) {
    return {
      type: 'Error',
      statusCode: 400,
      message: 'ratingLessThanOne'
    };
  }

  // 4) Update review
  const result = await Review.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 5) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulReviewUpdate',
    statusCode: 200,
    result
  };
});

/**
 * @desc    Delete Review Using It's ID
 * @param   { String } id - Review ID
 * @returns { Object<type|message|statusCode> }
 */
export const deleteReview = catchAsync(async (user, id) => {
  const review = await Review.findById(id);

  // 1) Check if review doesn't exist
  if (!review) {
    return {
      type: 'Error',
      message: 'noReviewFound',
      statusCode: 404
    };
  }

  // 2) Check if the user is the creator of the review to delete it
  if (user._id.toString() !== review.user.toString()) {
    return {
      type: 'Error',
      statusCode: 400,
      message: 'notReviewCreator'
    };
  }

  // 4) Delete review
  await Review.findByIdAndDelete(id);

  // 5) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulReviewDelete',
    statusCode: 200
  };
});
