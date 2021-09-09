// Utils
import catchAsync from '../utils/catchAsync';

// Models
import { Favorite, Product } from '../models';

/**
 * Add product to favorite list service
 * @param     { Object } user
 * @property  { String } productId
 * @returns   { JSON }
 */
export const addFavoriteProduct = catchAsync(async (userId, productId) => {
  // 1) Get product data from database
  const product = await Product.findById(productId);

  // 2) Check if product already exist
  if (!product) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'noProductFound'
    };
  }

  // 3) Get favorite data from database
  let favorite = await Favorite.findOne({ user: userId });

  // 4) Check if favorite document exists
  if (favorite) {
    // 5) Check if product already exist in favorite list
    if (favorite.products.includes(productId)) {
      return {
        type: 'Error',
        statusCode: 400,
        message: 'productExist'
      };
    }

    // 6) Push the productId into the new favorite products array
    favorite.products.push(productId);

    await favorite.save();

    // 7) If everything is OK, send data
    return {
      type: 'Success',
      statusCode: 200,
      message: 'successfulFavoriteAdd'
    };
  }

  await Favorite.create({
    products: [productId],
    user: userId
  });

  // 7) If everything is OK, send data
  return {
    type: 'Success',
    statusCode: 200,
    message: 'successfulFavoriteAdd'
  };
});

/**
 * Get product's favorite list service
 * @param     { Object } user
 * @returns   { JSON }
 */
export const getFavoriteList = catchAsync(async (userId) => {
  // 1) get favorite data from database
  const favorite = await Favorite.findOne({ user: userId });

  // 2) Check if favorite document already exists
  if (!favorite) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'noFavoriteListFound'
    };
  }

  // 3) Check if favorite products already exist
  if (favorite.length === 0) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'noProductsInFavorite'
    };
  }

  // 4) If everything is OK, send data
  return {
    type: 'Success',
    statusCode: 200,
    message: 'successfulFavoriteGet',
    favorite
  };
});

/**
 * Remove product from favorite list service
 * @param     { ObjectId } productId
 * @param     { Object }   user
 * @returns   { JSON }
 */
export const deleteProductFromFavorite = catchAsync(
  async (userId, productId) => {
    // 1) Get favorite data from database
    const favorite = await Favorite.findOne({ user: userId });

    // 2) Check if favorite document already exists
    if (!favorite) {
      return {
        type: 'Error',
        statusCode: 404,
        message: 'noFavoriteListFound'
      };
    }

    // 3) Check if favorite list includes the productId
    if (favorite.products.includes(productId)) {
      favorite.products = favorite.products.filter(
        (item) => item.toString() !== productId.toString()
      );
    } else {
      return {
        type: 'Error',
        statusCode: 404,
        message: 'notFoundInFavoriteList'
      };
    }

    await favorite.save();

    // 4) If everything is OK, send data
    return {
      type: 'Success',
      statusCode: 200,
      message: 'successfulDeleteProductFromFavorite'
    };
  }
);

/**
 * Check if product in favorite list service
 * @param     { ObjectId } productId
 * @param     { Object }   user
 * @returns   { JSON }
 */
export const checkProductInFavoriteList = catchAsync(
  async (userId, productId) => {
    // 1) Get favorite data from database
    const favorite = await Favorite.findOne({ user: userId });

    // 2) Check if favorite document already exists
    if (!favorite) {
      return {
        type: 'Error',
        statusCode: 404,
        message: 'noFavoriteListFound'
      };
    }

    // 3) Check if favorite list includes the productId
    if (!favorite.products.includes(productId)) {
      return {
        type: 'Error',
        statusCode: 404,
        message: 'notFoundInFavoriteList'
      };
    }

    // 4) If everything is OK, send data
    return {
      type: 'Success',
      statusCode: '200',
      message: 'successfulProductFoundInFavorite'
    };
  }
);
