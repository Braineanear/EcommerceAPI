// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { orderService } from '../services/index';

export const createOrder = catchAsync(async (req, res) => {
  const { type, message, statusCode, order } = await orderService.createOrder(
    req.body,
    req.user
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    order
  });
});

export const getAllOrders = catchAsync(async (req, res) => {
  const { type, message, statusCode, orders } = await orderService.queryOrders(
    req
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    orders
  });
});

export const getOrder = catchAsync(async (req, res) => {
  const { type, message, statusCode, order } = await orderService.queryOrder(
    req.params.id
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message,
    order
  });
});

export const cancelOrder = catchAsync(async (req, res) => {
  const { type, message, statusCode } = await orderService.cancelOrder(
    req.params.id
  );

  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  return res.status(statusCode).json({
    type,
    message
  });
});
