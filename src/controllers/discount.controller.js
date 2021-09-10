// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { discountService } from '../services';

/**
 * @desc      Verify Discount Code Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.discountCode - Discount code
 * @property  { Object } req.user - An object contains logged in user data
 * @return    { JSON } - A JSON object representing the type, message and the code
 */
export const verifyDiscountCode = catchAsync(async (req, res) => {
  // 1) Verify discount code
  const { type, message, statusCode, discount } =
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
    discount
  });
});

/**
 * @desc    Verify Discount Code Controller
 * @param   { Object } req - Request object
 * @param   { Object } res - Response object
 * @return  { JSON } - A JSON object representing the type, message and the codes
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
 * @desc      Verify Discount Code Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Number } req.body.codeLength - Length of the discount code
 * @property  { Number } req.body.discountStart - Start of the discount code
 * @property  { Number } req.body.discountEnd - End of the discount code
 * @property  { Number } req.body.availableStart - The begin number of available discount code
 * @property  { Number } req.body.availableEnd - The end number of available discount code
 * @return    { JSON } - A JSON object representing the type, message and the discount code
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
