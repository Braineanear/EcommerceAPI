// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { cartService } from '../services/index';

/**
 * Add Product To Cart Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.body.productId
 * @property  { Number } req.body.quantity
 * @returns   { JSON }
 */
export const addItemToCart = catchAsync(async (req, res) => {
  // 1) Get productId & quantity from dody
  const { productId, quantity } = req.body;

  // 2) Add product to cart
  const { type, message, statusCode, cart } =
    await cartService.addProductToCart(req.user.email, productId, quantity);

  // 3) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 4) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

/**
 * Reduce Product By One Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.body.productId
 * @returns   { JSON }
 */
export const reduceByOne = catchAsync(async (req, res) => {
  // 1) Reduce product quantity by one from cart
  const { type, message, statusCode, cart } = await cartService.reduceByOne(
    req.user.email,
    req.body.productId
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
    message,
    cart
  });
});

/**
 * Increase Product By One Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.body.productId
 * @returns   { JSON }
 */
export const increaseByOne = catchAsync(async (req, res) => {
  // 1) Increase product by one
  const { type, message, statusCode, cart } = await cartService.increaseByOne(
    req.user.email,
    req.body.productId
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
    message,
    cart
  });
});

/**
 * Get Cart By User Email Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.query.email
 * @returns   { JSON }
 */
export const getCart = catchAsync(async (req, res) => {
  // 1) Get cart using user email
  const { type, message, statusCode, cart } = await cartService.queryCart(
    req.user.email
  );

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 9) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    cart
  });
});

/**
 * Delete Cart By User Email Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.query.email
 * @returns   { JSON }
 */
export const deleteCart = catchAsync(async (req, res) => {
  // 1) Delete cart using user email
  const { type, message, statusCode } = await cartService.deleteCart(
    req.user.email
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

/**
 * Delete Product From Cart Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.params.productId
 * @property  { String } req.query.email
 * @returns   { JSON }
 */
export const deleteItem = catchAsync(async (req, res) => {
  const { productId } = req.params;

  // 1) Delete product from cart
  const { type, message, statusCode, cart } = await cartService.deleteItem(
    req.user.email,
    productId
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
    message,
    cart
  });
});
