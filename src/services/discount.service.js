// Packages
import crypto from 'crypto';

// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Models
import { User, Discount } from '../models';

/**
 * @desc    Get all discount codes
 * @param   { Object } req - Request object
 * @returns { Object<type|message|statusCode|codes> }
 */
export const getAllDiscountCodes = catchAsync(async (req) => {
  const codes = await APIFeatures(req, Discount);

  // 1) Check if codes doesn't exist
  if (!codes) {
    return {
      type: 'Error',
      message: 'noDiscountCodesFound',
      statusCode: 404
    };
  }

  // 2) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulDiscountCodesFound',
    statusCode: 200,
    codes
  };
});

/**
 * @desc    Get Discount
 * @param   { String } code - Discount code
 * @return  { Object<type|message|statusCode|discount> }
 */
export const getDiscount = catchAsync(async (code) => {
  const discountCode = await Discount.findOne({ code });

  // 1) Check if discount code doesn't exist
  if (!discountCode) {
    return {
      type: 'Error',
      message: 'noDiscountCodeFound',
      statusCode: 404
    };
  }

  // 2) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulGetDiscount',
    statusCode: 200,
    discount: discountCode.discount
  };
});

/**
 * @desc    Verfiy discount code
 * @param   { Object } body - Body object data
 * @param   { Object } user - User object data
 * @returns { Object<type|message|statusCode|code> }
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

  if (user.discountCode) {
    return {
      type: 'Error',
      message: 'haveDiscountCode',
      statusCode: 400
    };
  }

  const discount = await Discount.findOne({ code: discountCode });

  // 2) Check if discount document doesn't exist
  if (!discount) {
    return {
      type: 'Error',
      message: 'noDiscountCodeFound',
      statusCode: 404
    };
  }

  // 3) Update discount document with the new avalanche field
  discount.available -= 1;

  await discount.save();

  // 4) Add code into user document
  await User.findByIdAndUpdate(user._id, { discountCode: discount.code });

  // 5) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulCodeVerification',
    statusCode: 201,
    discount: discount.discount
  };
});

/**
 * @desc    Generate Discount Code
 * @param   { Number }  codeLength - Discount code length
 * @param   { Number }  discountStart - Discount number start
 * @param   { Number }  discountEnd - Discount number end
 * @param   { Number }  availableStart - Available codes number start
 * @param   { Number }  availableEnd - Available codes number end
 * @returns { Object<type|message|statusCode|code> }
 */
export const generateDiscountCode = catchAsync(
  async (
    codeLength,
    discountStart,
    discountEnd,
    availableStart,
    availableEnd
  ) => {
    // 1) Check input fields
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

    // 2) Generate discount code
    let rb = crypto.randomBytes(codeLength);
    let code = '';

    for (let i = 0; i < codeLength; i += 1) {
      rb[i] %= All.length;
      code += All[rb[i]];
    }

    const generateRandomNumber = (min, max) =>
      Math.floor(Math.random() * (max - min) + min);

    // 3) Create new discount document
    const discountCode = await Discount.create({
      code,
      discount: generateRandomNumber(discountStart, discountEnd),
      available: generateRandomNumber(availableStart, availableEnd)
    });

    // 4) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulCodeGeneration',
      statusCode: 200,
      discountCode
    };
  }
);

/**
 * @desc    Delete Discount Code
 * @param   { String } codeId - ID of discount code
 * @return  { Object<type|message|statusCode> }
 */
export const deleteDiscountCode = catchAsync(async (codeId) => {
  const discountCode = await Discount.findById(codeId);

  // 1) Check if discount code doesn't exist
  if (!discountCode) {
    return {
      type: 'Error',
      message: 'noDiscountCodeFound',
      statusCode: 404
    };
  }

  // 2) Delete discount code document
  await Discount.findByIdAndDelete(codeId);

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'discountCodeDeleted',
    statusCode: 200
  };
});

/**
 * @desc    Cancel Discount Code
 * @param   { String } code - Discount code
 * @param   { String } userId - ID of user
 * @return  { Object<type|message|statusCode> }
 */
export const cancelDiscountCode = catchAsync(async (code, userId) => {
  const discountCode = await Discount.findOne({ code });

  // 1) Check if discount code doesn't exist
  if (!discountCode) {
    return {
      type: 'Error',
      message: 'noDiscountCodeFound',
      statusCode: 404
    };
  }

  const user = await User.findById(userId);

  // 2) Check if user doesn't exist
  if (!user) {
    return {
      type: 'Error',
      message: 'noUserFound',
      statusCode: 404
    };
  }

  // 3) Update user and discount code documents
  user.discountCode = '';
  discountCode.available += 1;

  await user.save();
  await discountCode.save();

  // 4) If everything is OK, send data
  return {
    type: 'Success',
    message: 'discountCodeCanceled',
    statusCode: 200
  };
});
