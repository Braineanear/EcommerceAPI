import {
  signin,
  signup,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail
} from './auth.controller';

import {
  getAllProducts,
  getProduct,
  addProduct,
  updateProductDetails,
  updateProductMainImage,
  updateProductImages,
  deleteProduct,
  top5Cheap,
  productStats
} from './product.controller';

import {
  createUser,
  getUsers,
  getUser,
  updateUserDetails,
  updateUserProfileImage,
  deleteUser
} from './user.controller';

import {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
} from './category.controller';

import {
  getAllReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} from './review.controller';

import {
  addItemToCart,
  subtractItemFromCart,
  reduceByOne,
  increaseByOne,
  getCart,
  deleteCart,
  deleteItem
} from './cart.controller';

import {
  createOrder,
  getAllOrders,
  getOrder,
  cancelOrder
} from './order.controller';

const authController = {
  signin,
  signup,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail
};

const userController = {
  createUser,
  getUsers,
  getUser,
  updateUserDetails,
  updateUserProfileImage,
  deleteUser
};

const categoryController = {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
};

const productController = {
  getAllProducts,
  getProduct,
  addProduct,
  updateProductDetails,
  updateProductMainImage,
  updateProductImages,
  deleteProduct,
  top5Cheap,
  productStats
};

const reviewController = {
  getAllReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
};

const cartController = {
  addItemToCart,
  subtractItemFromCart,
  reduceByOne,
  increaseByOne,
  getCart,
  deleteCart,
  deleteItem
};

const orderController = {
  createOrder,
  getAllOrders,
  getOrder,
  cancelOrder
};

export {
  authController,
  userController,
  productController,
  categoryController,
  reviewController,
  cartController,
  orderController
};
