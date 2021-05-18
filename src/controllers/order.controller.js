// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { orderService } from '../services/index';

/**
 * Create New Order
 * @param   {Object} req
 * @param   {Object} res
 * @return  {JSON}
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
 * @param   {Object} req
 * @param   {Object} res
 * @return  {JSON}
 */
export const getAllOrders = catchAsync(async (req, res) => {
  // 1) Get All Orders
  const { type, message, statusCode, orders } = await orderService.queryOrders(
    req
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Orders
  return res.status(statusCode).json({
    type,
    message,
    orders
  });
});

/**
 * Get Order Using It's ID
 * @param   {Object} req
 * @param   {Object} res
 * @return  {JSON}
 */
export const getOrder = catchAsync(async (req, res) => {
  // 1) Get Order Using It's ID
  const { type, message, statusCode, order } = await orderService.queryOrder(
    req.params.id
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
 * Cancel Order
 * @param   {Object} req
 * @param   {Object} res
 * @return  {JSON}
 */
export const cancelOrder = catchAsync(async (req, res) => {
  // 1) Cancel Order Using It's ID
  const { type, message, statusCode } = await orderService.cancelOrder(
    req.params.id
  );

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
