// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { orderService } from '../services/index';

/**
 * Create New Order Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { Object } req.body
 * @property  { Object } req.user
 * @return    { JSON }
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
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    order
  });
});

/**
 * Get All Orders Controller
 * @param     { Object }  req
 * @param     { Object }  res
 * @property  { String }  req.query.sort
 * @property  { String }  req.query.select
 * @property  { Number }  req.query.page
 * @property  { Number }  req.query.limit
 * @return    { JSON }
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
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    orders
  });
});

/**
 * Get Order Using It's ID Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @return    { JSON }
 */
export const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Get order using it's ID
  const { type, message, statusCode, order } = await orderService.queryOrder(
    id
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
    order
  });
});

/**
 * Cancel Order Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @return    { JSON }
 */
export const cancelOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Cancel order using it's ID
  const { type, message, statusCode } = await orderService.cancelOrder(id);

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
