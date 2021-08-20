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
    await cartService.addProductToCart(req.user, productId, quantity);

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
 * Subtract Quantity From Product In Cart Controller
 * @param     { Obejct } req
 * @param     { Object } res
 * @property  { String } req.body.productId
 * @property  { Number } req.body.quantity
 * @returns   { JSON }
 */
export const subtractItemFromCart = catchAsync(async (req, res) => {
  // 1) Get productId & quanitity from body
  const { productId, quantity } = req.body;

  // 2) Subtract product from cart
  const { type, message, statusCode, cart } =
    await cartService.subtractItemFromCart(productId, quantity);

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
  const { email } = req.query;

  // 1) Get cart using user email
  const { type, message, statusCode, cart } = await cartService.queryCart(
    email
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
  const { email } = req.query;

  // 1) Delete cart using user email
  const { type, message, statusCode } = await cartService.deleteCart(email);

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
  const { email } = req.query;
  const { productId } = req.params;

  // 1) Delete product from cart
  const { type, message, statusCode, cart } = await cartService.deleteItem(
    email,
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
