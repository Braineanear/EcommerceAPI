// Configs
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { orderService, redisService } from '../services/index';

/**
 * Create New Order
 * @param     {Object} req
 * @param     {Object} res
 * @property  {Object} req.body
 * @property  {Object} req.user
 * @return    {JSON}
 */
export const createOrder = catchAsync(async (req, res) => {
  // 1) Create New Order
  const { type, message, statusCode, order } = await orderService.createOrder(
    req.body,
    req.user
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Order
  return res.status(statusCode).json({
    type,
    message,
    order
  });
});

/**
 * Get All Orders
 * @param     {Object}  req
 * @param     {Object}  res
 * @property  {String}  req.query.sort
 * @property  {String}  req.query.select
 * @property  {Number}  req.query.page
 * @property  {Number}  req.query.limit
 * @return    {JSON}
 */
export const getAllOrders = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;
  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'orders',
    `page:${page}-sort:${sort}-limit:${limit}-select:${select}`
  );

  // 3) Getting Cached Data From Redis
  let cached = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!cached) {
    logger.error('No Caching Data');
  }

  cached = JSON.parse(cached);

  // 5) If Cached Data Exit Return it
  if (cached) {
    return res.status(200).json({
      type: 'Success',
      message: 'Orders Found Successfully',
      orders: cached
    });
  }

  // 6) Get All Orders
  const { type, message, statusCode, orders } = await orderService.queryOrders(
    req
  );

  // 7) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 8) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(orders), 'EX', 60);

  // 9) If Everything is OK, Send Orders
  return res.status(statusCode).json({
    type,
    message,
    orders
  });
});

/**
 * Get Order Using It's ID
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.id
 * @return    {JSON}
 */
export const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('order', `id:${id}`);

  // 2) Getting Cached Data From Redis
  let cached = await redisService.get(key);

  // 3) Check If Cached Data Already Exist
  if (!cached) {
    logger.error('No Caching Data');
  }

  cached = JSON.parse(cached);

  // 4) If Cached Data Exit Return it
  if (cached) {
    return res.status(200).json({
      type: 'Success',
      message: 'Order Found Successfully',
      order: cached
    });
  }

  // 5) Get Order Using It's ID
  const { type, message, statusCode, order } = await orderService.queryOrder(
    id
  );

  // 6) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(order), 'EX', 60);

  // 8) If Everything is OK, Send Order
  return res.status(statusCode).json({
    type,
    message,
    order
  });
});

/**
 * Cancel Order
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.id
 * @return    {JSON}
 */
export const cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Cancel Order Using It's ID
  const { type, message, statusCode } = await orderService.cancelOrder(id);

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
