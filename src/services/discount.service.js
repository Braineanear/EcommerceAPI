// Packages
import crypto from 'crypto';

// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Models
import { User, Discount } from '../models';

/**
 * Verfiy discount code
 * @param   {Object} body
 * @param   {Object} user
 * @returns {Object<type|message|statusCode|code>}
 */
export const verifyDiscountCode = catchAsync(async (discountCode, user) => {
  // 1) Check If User Entered All Fields
  if (!discountCode) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 2) Get Discount Code
  const discount = await Discount.findOne({ code: discountCode });

  // 3) Check If discount document doesn't exist
  if (!discount) {
    return {
      type: 'Error',
      message: 'noDiscountCodeFound',
      statusCode: 404
    };
  }

  // 4) Update discount document with the new avalanche field
  discount.available -= 1;

  await discount.save();

  // 5) Add code into user document
  await User.findByIdAndUpdate(user._id, { discountCode: discount.code });

  // 6) If everything is OK, send order data
  return {
    type: 'Success',
    message: 'successfulCodeVerification',
    statusCode: 201,
    code: discount.code
  };
});

/**
 * Get all discount codes
 * @returns {Object<type|message|statusCode|codes>}
 */
export const getAllDiscountCodes = catchAsync(async (req) => {
  // 1) Get all discount codes
  const codes = await APIFeatures(req, Discount);

  // 2) Check if codes doesn't exist
  if (!codes) {
    return {
      type: 'Error',
      message: 'noDiscountCodesFound',
      statusCode: 404
    };
  }

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulDiscountCodesFound',
    statusCode: 200,
    codes
  };
});

/**
 * Generate Discount Code
 * @param   {Number}  codeLength
 * @param   {Number}  discountStart
 * @param   {Number}  discountEnd
 * @param   {Number}  availableStart
 * @param   {Number}  availableEnd
 * @returns {Object<type|message|statusCode|code>}
 */
export const generateDiscountCode = catchAsync(
  async (
    codeLength,
    discountStart,
    discountEnd,
    availableStart,
    availableEnd
  ) => {
    if (
      !codeLength ||
      !discountStart ||
      !discountEnd ||
      !availableStart ||
      !availableEnd
    ) {
      return {
        type: 'Error',
        statusCode: 400,
        message: 'fieldsRequired'
      };
    }

    const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const All = lowercaseAlphabet + uppercaseAlphabet + numbers;

    // 1) Generate discount code
    let rb = crypto.randomBytes(codeLength);
    let code = '';

    for (let i = 0; i < codeLength; i += 1) {
      rb[i] %= All.length;
      code += All[rb[i]];
    }

    const generateRandomNumber = (min, max) =>
      Math.floor(Math.random() * (max - min) + min);

    // 2) Create new discount document
    const discountCode = await Discount.create({
      code,
      discount: generateRandomNumber(discountStart, discountEnd),
      available: generateRandomNumber(availableStart, availableEnd)
    });

    // 3) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulCodeGeneration',
      statusCode: 200,
      discountCode
    };
  }
);
