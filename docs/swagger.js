import {
  signUp,
  signIn,
  logout,
  generateTokens,
  forgotPassword,
  resetPassword
} from './auth.swagger';

import {
  getAllCategories,
  getCategory,
  addCategory,
  updateCategoryDetails,
  updateCategoryImage,
  deleteCategory
} from './category.swagger';

import {
  getAllProducts,
  getProduct,
  addProduct,
  top5Cheap,
  productStats,
  updateProductDetails,
  updateProductMainImage,
  updateProductImages,
  deleteProduct
} from './product.swagger';

import {
  getCart,
  addItemsToCart,
  increaseProductQuantityByOne,
  reduceProductQuantityByOne,
  deleteProductFromCart,
  deleteCart
} from './cart.swagger';

import {
  getAllProductReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} from './review.swagger';

import {
  getAllUsers,
  getUser,
  addUser,
  updateUserDetails,
  updateUserProfileImage,
  deleteUser,
  deleteMyAccount
} from './user.swagger';

import {
  createNewOrder,
  getAllOrders,
  getOrder,
  orderStatus,
  cancelOrder
} from './order.swagger';

import {
  addFavoriteProduct,
  deleteProductFromFavorite,
  checkProductInFavoriteList,
  getFavoriteList
} from './favorite.swagger';

import {
  verifyDiscountCode,
  getDiscount,
  getAllDiscountCodes,
  generateDiscountCode,
  deleteDiscountCode,
  cancelDiscountCode
} from './discount.swagger';

const docs = {
  openapi: '3.0.3',
  info: {
    title: 'Ecommerce API',
    description: 'An API for ecommerce works built using NodeJS & MongoDB',
    version: '1.0.0',
    contact: {
      name: 'Mahmoud Yasser',
      email: 'mle.mahmoud.yasser@gmail.com',
      url: 'https://github.com/Braineanear'
    }
  },
  servers: [
    {
      url: 'https://e-commerce-a-p-i.herokuapp.com/api',
      description: 'Production Server'
    },
    {
      url: 'http://localhost:8000/api',
      description: 'Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      jwt: []
    }
  ],
  paths: {
    '/auth/login': {
      post: signIn
    },
    '/auth/register': {
      post: signUp
    },
    '/auth/logout': {
      post: logout
    },
    '/auth/tokens': {
      post: generateTokens
    },
    '/auth/forgot-password': {
      post: forgotPassword
    },
    '/auth/reset-password': {
      post: resetPassword
    },
    '/user': {
      get: getAllUsers,
      post: addUser
    },
    '/user/:id': {
      get: getUser,
      delete: deleteUser
    },
    '/user/update-details': {
      patch: updateUserDetails
    },
    '/user/update-profile-image': {
      patch: updateUserProfileImage
    },
    '/user/me': {
      delete: deleteMyAccount
    },
    '/category': {
      get: getAllCategories,
      post: addCategory
    },
    '/category/{id}': {
      get: getCategory,
      patch: updateCategoryDetails,
      delete: deleteCategory
    },
    '/category/{id}/image': {
      patch: updateCategoryImage
    },
    '/product': {
      get: getAllProducts,
      post: addProduct
    },
    '/product/:id': {
      get: getProduct,
      delete: deleteProduct
    },
    '/product/top-5-cheap': {
      get: top5Cheap
    },
    '/product/product-stats': {
      get: productStats
    },
    '/product/{id}/details': {
      patch: updateProductDetails
    },
    '/product/{id}/main-image': {
      patch: updateProductMainImage
    },
    '/product/{id}/images': {
      patch: updateProductImages
    },
    '/favorite': {
      get: getFavoriteList,
      post: addFavoriteProduct
    },
    '/favorite/{id}': {
      delete: deleteProductFromFavorite
    },
    '/favorite/check/{id}': {
      get: checkProductInFavoriteList
    },
    '/discount': {
      get: getAllDiscountCodes
    },
    '/discount/verify': {
      post: verifyDiscountCode
    },
    '/discount/cancel': {
      delete: cancelDiscountCode
    },
    '/discount/find': {
      get: getDiscount
    },
    '/discount/generate': {
      post: generateDiscountCode
    },
    '/discount/{id}': {
      delete: deleteDiscountCode
    },
    '/cart': {
      get: getCart,
      post: addItemsToCart,
      delete: deleteCart
    },
    '/cart/increase-one': {
      patch: increaseProductQuantityByOne
    },
    '/cart/reduce-one': {
      patch: reduceProductQuantityByOne
    },
    '/cart/:id': {
      delete: deleteProductFromCart
    },
    '/order': {
      get: getAllOrders,
      post: createNewOrder
    },
    '/order/{id}': {
      get: getOrder,
      patch: orderStatus,
      delete: cancelOrder
    },
    '/product/{productId}/reviews': {
      get: getAllProductReviews,
      post: addReview
    },
    '/product/{productId}/reviews/{reviewId}': {
      get: getReview,
      patch: updateReview,
      delete: deleteReview
    }
  }
};

export default docs;
