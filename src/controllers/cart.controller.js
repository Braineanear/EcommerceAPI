// Configs
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { cartService } from '../services/index';

/**
 * Add Product To Cart.
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.body.productId
 * @property  {Number} req.body.quantity
 * @returns   {JSON<Cart>}
 */
export const addItemToCart = catchAsync(async (req, res) => {
  // 1) Get productId & quantity From Body
  const { productId, quantity } = req.body;

  // 2) Add Product To Cart
  const { type, message, statusCode, cart } =
    await cartService.addProductToCart(req.user, productId, quantity);

  // 3) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 4) If Everything is OK, Send Cart
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

/**
 * Subtract Quantity From Product In Cart.
 * @param     {Obejct} req
 * @param     {Object} res
 * @property  {String} req.body.productId
 * @property  {Number} req.body.quantity
 * @returns   {JSON<Cart>}
 */
export const subtractItemFromCart = catchAsync(async (req, res) => {
  // 1) Get productId & quanitity From Body
  const { productId, quantity } = req.body;

  // 2) Subtract Product From Cart
  const { type, message, statusCode, cart } =
    await cartService.subtractItemFromCart(productId, quantity);

  // 3) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 4) If Everything is OK, Send Cart
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

/**
 * Reduce Product By One.
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.body.productId
 * @returns   {JSON<Cart>}
 */
export const reduceByOne = catchAsync(async (req, res) => {
  // 1) Reduce Product Quantity By One From Cart
  const { type, message, statusCode, cart } = await cartService.reduceByOne(
    req.body.productId
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Cart
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

/**
 * Increase Product By One.
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.body.productId
 * @returns   {JSON<Cart>}
 */
export const increaseByOne = catchAsync(async (req, res) => {
  // 1) Increase Product By One
  const { type, message, statusCode, cart } = await cartService.increaseByOne(
    req.body.productId
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Cart
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

/**
 * Get Cart By User Email.
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.query.email
 * @returns   {JSON<Cart>}
 */
export const getCart = catchAsync(async (req, res) => {
  const { email } = req.query;

  // 1) Get Cart Using User Email
  const { type, message, statusCode, cart } = await cartService.queryCart(
    email
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 9) If Everything is OK, Send Cart
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

/**
 * Delete Cart By User Email.
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.query.email
 * @returns   {JSON<Cart>}
 */
export const deleteCart = catchAsync(async (req, res) => {
  const { email } = req.query;

  // 1) Delete Cart Using User Email
  const { type, message, statusCode } = await cartService.deleteCart(email);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Message
  return res.status(statusCode).json({
    type,
    message
  });
});

/**
 * Delete Product From Cart
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.params.productId
 * @property  {String} req.query.email
 * @returns   {JSON<Cart>}
 */
export const deleteItem = catchAsync(async (req, res) => {
  const { email } = req.query;
  const { productId } = req.params;

  // 1) Delete Product From Cart
  const { type, message, statusCode, cart } = await cartService.deleteItem(
    email,
    productId
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Cart
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});
