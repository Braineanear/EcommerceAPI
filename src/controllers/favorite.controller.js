// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { favoriteService } from '../services';

/**
 * Get product's favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { Object }  req.user._id
 * @returns   { JSON }
 */
export const getFavoriteList = catchAsync(async (req, res) => {
  // 1) Calling addFavoriteProduct service
  const { type, message, statusCode, favorite } =
    await favoriteService.getFavoriteList(req.user._id);

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    favorite: favorite
  });
});

/**
 * Add product to favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.body.productId
 * @property  { Object }  req.user._id
 * @returns   { JSON }
 */
export const addFavoriteProduct = catchAsync(async (req, res) => {
  // 1) Calling addFavoriteProduct service
  const { type, message, statusCode } =
    await favoriteService.addFavoriteProduct(req.user._id, req.body.productId);

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});

/**
 * delete product from favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.params.id
 * @property  { Object }  req.user._id
 * @returns   { JSON }
 */
export const deleteProductFromFavorite = catchAsync(async (req, res) => {
  // 1) Calling deleteProductFromFavorite service
  const { type, message, statusCode } =
    await favoriteService.deleteProductFromFavorite(
      req.user._id,
      req.params.id
    );

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});

/**
 * Check if product in favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.params.id
 * @property  { Object }  req.user._id
 * @returns   { JSON }
 */
export const checkProductInFavoriteList = catchAsync(async (req, res) => {
  // 1) Calling checkProductInFavoriteList service
  const { type, message, statusCode } =
    await favoriteService.checkProductInFavoriteList(
      req.user._id,
      req.params.id
    );

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});
