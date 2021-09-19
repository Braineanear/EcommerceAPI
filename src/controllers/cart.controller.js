// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { cartService } from '../services/index';

/**
 * @desc      Add Product To Cart Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.user.email - User email
 * @property  { String } req.body.productId - Product ID
 * @property  { Number } req.body.quantity - Product quantity
 * @property  { String } req.body.selectedColor - Selected color
 * @property  { String } req.body.selectedSize - Selected size
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
export const addItemToCart = catchAsync(async (req, res) => {
  const { productId, quantity, selectedColor, selectedSize } = req.body;

  // 1) Add product to cart
  const { type, message, statusCode, cart } =
    await cartService.addProductToCart(
      req.user.email,
      productId,
      quantity,
      selectedColor,
      selectedSize
    );

  // 2) Check if there is an error
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
    cart
  });
});

/**
 * @desc      Reduce Product By One Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.user - An object contains logged in user data
 * @property  { String } req.body.productId - Product ID
 * @property  { String } req.body.selectedColor - Selected color
 * @property  { String } req.body.selectedSize - Selected size
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
export const reduceByOne = catchAsync(async (req, res) => {
  const { productId, selectedColor, selectedSize } = req.body;

  // 1) Reduce product quantity by one from cart
  const { type, message, statusCode, cart } = await cartService.reduceByOne(
    req.user.email,
    productId,
    selectedColor,
    selectedSize
  );

  // 2) Check if there is an error
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
    cart
  });
});

/**
 * @desc      Increase Product By One Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.user - An object contains logged in user data
 * @property  { String } req.body.productId - Product ID
 * @property  { String } req.body.selectedColor - Selected color
 * @property  { String } req.body.selectedSize - Selected size
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
export const increaseByOne = catchAsync(async (req, res) => {
  const { productId, selectedColor, selectedSize } = req.body;

  // 1) Increase product by one
  const { type, message, statusCode, cart } = await cartService.increaseByOne(
    req.user.email,
    productId,
    selectedColor,
    selectedSize
  );

  // 2) Check if there is an error
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
    cart
  });
});

/**
 * @desc      Get Cart By User Email Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.user.email - User email address
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
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
      message: req.polyglot.t(message)
    });
  }

  // 9) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    cart
  });
});

/**
 * @desc      Delete Cart By User Email Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.user.email - User email address
 * @returns   { JSON } - A JSON object representing the type and message
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
 * @desc      Delete Product From Cart Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.user.email - User email address
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.body.selectedColor - Selected color
 * @property  { String } req.body.selectedSize - Selected size
 * @returns   { JSON } - A JSON object representing the type, message and the cart
 */
export const deleteItem = catchAsync(async (req, res) => {
  const { selectedColor, selectedSize } = req.body;

  // 1) Delete product from cart
  const { type, message, statusCode, cart } = await cartService.deleteItem(
    req.user.email,
    req.params.productId,
    selectedColor,
    selectedSize
  );

  // 2) Check if there is an error
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
    cart
  });
});
