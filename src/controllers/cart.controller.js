// Configs
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { cartService, redisService } from '../services/index';

/**
 * Add Product To Cart.
 * @param     {Object} req
 * @param     {Object} res
 * @param     {Object} next
 * @property  {String} req.body.email
 * @property  {String} req.body.productId
 * @property  {Number} req.body.quantity
 * @returns   {JSON<Cart>}
 */
export const addItemToCart = catchAsync(async (req, res, next) => {
  // 1) Get email & productId & quantity From Body
  const { email, productId, quantity } = req.body;

  // 2) Add Product To Cart
  const cart = await cartService.addProductToCart(email, productId, quantity);

  // 3) If Everything is OK, Send Cart
  return res.status(200).json({
    status: 'success',
    message: 'Product Added To Cart Successfully',
    cart
  });
});

/**
 * Subtract Quantity From Product In Cart.
 * @param     {Obejct} req
 * @param     {Object} res
 * @param     {Object} next
 * @property  {String} req.body.email
 * @property  {String} req.body.productId
 * @property  {Number} req.body.quantity
 * @returns   {JSON<Cart>}
 */
export const subtractItemFromCart = catchAsync(async (req, res, next) => {
  // 1) Get email & productId & quanitity From Body
  const { email, productId, quantity } = req.body;

  // 2) Subtract Product From Cart
  const cart = await cartService.subtractItemFromCart(
    email,
    productId,
    quantity
  );

  // 3) If Everything is OK, Send Cart
  return res.status(200).json({
    status: 'success',
    message: 'Process Done Successfully',
    cart
  });
});

/**
 * Reduce Product By One.
 * @param     {Object} req
 * @param     {Object} res
 * @param     {Object} next
 * @property  {String} req.body.email
 * @property  {String} req.body.productId
 * @returns   {JSON<Cart>}
 */
export const reduceByOne = catchAsync(async (req, res, next) => {
  // 1) Get Email & Product ID From Body
  const { email, productId } = req.body;

  // 2) Reduce Product Quantity By One From Cart
  const cart = await cartService.reduceByOne(email, productId);

  // 3) If Everything is OK, Send Cart
  return res.status(200).json({
    status: 'success',
    message: 'Proccess Done Successfully',
    cart
  });
});

/**
 * Increase Product By One.
 * @param     {Object} req
 * @param     {Object} res
 * @param     {Object} next
 * @property  {String} req.body.email
 * @property  {String} req.body.productId
 * @returns   {JSON<Cart>}
 */
export const increaseByOne = catchAsync(async (req, res, next) => {
  // 1) Get Email & Product ID From Body
  const { email, productId } = req.body;

  // 2) Increase Product By One
  const cart = await cartService.increaseByOne(email, productId);

  // 3) If Everything is OK, Send Cart
  return res.status(200).json({
    status: 'success',
    message: 'Proccess Done Successfully',
    cart
  });
});

/**
 * Get Cart By User Email.
 * @param     {Object} req
 * @param     {Object} res
 * @param     {Object} next
 * @property  {String} req.query.email
 * @returns   {JSON<Cart>}
 */
export const getCart = catchAsync(async (req, res, next) => {
  const { email } = req.query;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('cart', `email:${email}`);

  // 2) Getting Cached Data From Redis
  let cart = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!cart) {
    logger.error('No Caching Data');
  }

  cart = JSON.parse(cart);

  // 5) If Cached Data Exit Return it
  if (cart) {
    return res.status(200).json({
      status: 'success',
      message: 'Proccess Done Successfully',
      cart
    });
  }

  // 6) Get Cart Using User Email
  cart = await cartService.queryCart(email);

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(cart), 'EX', 60);

  // 8) If Everything is OK, Send Cart
  return res.status(200).json({
    status: 'success',
    message: 'Proccess Done Successfully',
    cart
  });
});

/**
 * Delete Cart By User Email.
 * @param     {Object} req
 * @param     {Object} res
 * @param     {Object} next
 * @property  {String} req.query.email
 * @returns   {JSON<Cart>}
 */
export const deleteCart = catchAsync(async (req, res, next) => {
  const { email } = req.query;

  await cartService.deleteCart(email);

  return res.status(200).json({
    status: 'success',
    message: 'Proccess Done Successfully'
  });
});

/**
 * Delete Product From Cart
 * @param     {Object} req
 * @param     {Object} res
 * @param     {Object} next
 * @property  {String} req.params.productId
 * @property  {String} req.query.email
 * @returns   {JSON<Cart>}
 */
export const deleteItem = catchAsync(async (req, res, next) => {
  const { email } = req.query;
  const { productId } = req.params;

  // 1) Delete Product From Cart
  const cart = await cartService.deleteItem(email, productId);

  // 2) If Everything is OK, Send Cart
  return res.status(200).json({
    status: 'success',
    message: 'Proccess Done Successfully',
    cart
  });
});
