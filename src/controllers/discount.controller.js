// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { discountService } from '../services';

/**
 * Verify Discount Code Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { Object } req.body
 * @property  { Object } req.user
 * @return    { JSON }
 */
export const verifyDiscountCode = catchAsync(async (req, res) => {
  // 1) Verify discount code
  const { type, message, statusCode, code } =
    await discountService.verifyDiscountCode(req.body.discountCode, req.user);

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
    code
  });
});

/**
 * Verify Discount Code Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { Object } req
 * @return    { JSON }
 */
export const getAllDiscountCodes = catchAsync(async (req, res) => {
  // 1) Verify discount code
  const { type, message, statusCode, codes } =
    await discountService.getAllDiscountCodes(req);

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
    codes
  });
});

/**
 * Verify Discount Code Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { Object } req
 * @return    { JSON }
 */
export const generateDiscountCode = catchAsync(async (req, res) => {
  const {
    codeLength,
    discountStart,
    discountEnd,
    availableStart,
    availableEnd
  } = req.body;
  // 1) Verify discount code
  const { type, message, statusCode, discountCode } =
    await discountService.generateDiscountCode(
      codeLength,
      discountStart,
      discountEnd,
      availableStart,
      availableEnd
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
    discountCode
  });
});
