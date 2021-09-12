// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { orderService } from '../services/index';

/**
 * @desc      Create New Order Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @property  { Object } req.user - An object contains logged in user data
 * @return    { JSON } - A JSON object representing the type, message and the order
 */
export const createOrder = catchAsync(async (req, res) => {
  // 1) Create new order
  const { type, message, statusCode, order } = await orderService.createOrder(
    req.body,
    req.user
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
    order
  });
});

/**
 * @desc      Update order status Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.status - Order status
 * @property  { String } req.params.id - Order ID
 * @return    { JSON } - A JSON object representing the type, message and the order
 */
export const orderStatus = catchAsync(async (req, res) => {
  // 1) Update order status
  const { type, message, statusCode } = await orderService.orderStatus(
    req.body.status,
    req.params.id
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
 * @desc      Get All Orders Controller
 * @param     { Object }  req - Request object
 * @param     { Object }  res - Response object
 * @property  { String }  req.query.sort - Sort returned data
 * @property  { String }  req.query.select - Select specific fields
 * @property  { Number }  req.query.page - Page number
 * @property  { Number }  req.query.limit - Limit number of items
 * @return    { JSON } - A JSON object representing the type, message and the orders
 */
export const getAllOrders = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting default params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 1) Get all orders
  const { type, message, statusCode, orders } = await orderService.queryOrders(
    req
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
    orders
  });
});

/**
 * @desc      Get Order Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - Order ID
 * @return    { JSON } - A JSON object representing the type, message and the order
 */
export const getOrder = catchAsync(async (req, res) => {
  // 1) Get order using it's ID
  const { type, message, statusCode, order } = await orderService.queryOrder(
    req.params.id
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
    order
  });
});

/**
 * @desc      Cancel Order Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - Order ID
 * @return    { JSON } - A JSON object representing the type and message
 */
export const cancelOrder = catchAsync(async (req, res) => {
  // 1) Cancel order using it's ID
  const { type, message, statusCode } = await orderService.cancelOrder(
    req.params.id
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
