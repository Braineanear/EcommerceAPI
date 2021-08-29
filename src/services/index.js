import {
  signin,
  signup,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
} from './auth.service';

import {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
} from './token.service';

import {
  createReview,
  queryReviews,
  queryReviewById,
  updateReview,
  deleteReview
} from './review.service';

import {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendAfterResetPasswordMessage,
  sendVerificationEmail
} from './email.service';

import {
  createUser,
  queryUsers,
  queryUser,
  updateUserDetails,
  updateUserProfileImage,
  deleteUser,
  deleteMyAccount
} from './user.service';

import {
  createCategory,
  queryCategories,
  queryCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategoryById
} from './category.service';

import {
  queryProducts,
  queryProductById,
  createProduct,
  updateProductDetails,
  updateProductMainImage,
  updateProductImages,
  deleteProduct,
  getProductStats,
  addFavoriteProduct,
  getFavoriteList,
  deleteProductFromFavorite,
  checkProductInFavoriteList
} from './product.service';

import {
  addProductToCart,
  reduceByOne,
  increaseByOne,
  queryCart,
  deleteCart,
  deleteItem
} from './cart.service';

import {
  createOrder,
  queryOrders,
  queryOrder,
  cancelOrder
} from './order.service';

const authService = {
  signin,
  signup,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};

const tokenService = {
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};

const reviewService = {
  createReview,
  queryReviews,
  queryReviewById,
  updateReview,
  deleteReview
};

const emailService = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendAfterResetPasswordMessage,
  sendVerificationEmail
};

const userService = {
  createUser,
  queryUsers,
  queryUser,
  updateUserDetails,
  updateUserProfileImage,
  deleteUser,
  deleteMyAccount
};

const categoryService = {
  createCategory,
  queryCategories,
  queryCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategoryById
};

const productService = {
  queryProducts,
  queryProductById,
  createProduct,
  updateProductDetails,
  updateProductMainImage,
  updateProductImages,
  deleteProduct,
  getProductStats,
  addFavoriteProduct,
  getFavoriteList,
  deleteProductFromFavorite,
  checkProductInFavoriteList
};

const cartService = {
  addProductToCart,
  reduceByOne,
  increaseByOne,
  queryCart,
  deleteCart,
  deleteItem
};

const orderService = {
  createOrder,
  queryOrders,
  queryOrder,
  cancelOrder
};

export {
  authService,
  tokenService,
  userService,
  emailService,
  categoryService,
  productService,
  reviewService,
  cartService,
  orderService
};
