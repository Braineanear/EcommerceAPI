// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

// Config
import tokenTypes from '../config/tokens';

// Services
import { updateUserById } from './user.service';
import { sendAfterResetPasswordMessage } from './email.service';
import { verifyToken, generateAuthTokens } from './token.service';

// Models
import { Token, User, Seller } from '../models/index';

/**
 * Login As User with Email & Password
 * @param {Object} body
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = catchAsync(async (body) => {
  const { email, password } = body;

  // 1) Check Email & Password
  if (!email || !password) {
    throw new AppError('All fields are required', 400);
  }
  // 2) Get User With Specific Email and Password
  const user = await User.findOne({ email }).select('+password');

  // 3) Check if Passwords are The Same
  const isMatch = await user.isPasswordMatch(password);

  // 4) If Email or Passwords isn't Correct
  if (!user || !isMatch) {
    throw new AppError('Incorrect email or password', 403);
  }

  // 5) If Everything OK, Send User
  return user;
});

/**
 * Login As Seller with Email & Password
 * @param {Object} body
 * @returns {Promise<Seller>}
 */
export const loginSellerWithEmailAndPassword = catchAsync(async (body) => {
  const { email, password } = body;

  // 1) Check Email & Password
  if (!email || !password) {
    throw new AppError('All fields are required', 400);
  }
  // 2) Get Seller With Specific Email and Password
  const seller = await Seller.findOne({ email }).select('+password');

  // 3) Check if Passwords are The Same
  const isMatch = await seller.isPasswordMatch(password);

  // 4) If Email or Passwords isn't Correct
  if (!seller || !isMatch) {
    throw new AppError('Incorrect email or password', 403);
  }

  // 5) If Everything OK, Send Seller
  return seller;
});

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = catchAsync(async (refreshToken) => {
  // 1) Find Token Document and Delete it
  const refreshTokenDoc = await Token.findOneAndDelete({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false
  });

  // 2) Check if Token Already Exist
  if (!refreshTokenDoc) {
    throw new AppError('Not found', 404);
  }
});

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = catchAsync(async (refreshToken) => {
  // 1) Verify Refresh Token
  const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);

  // 2) Find User Document and Delete it
  const user = await User.findByIdAndDelete(refreshTokenDoc.user);

  // 3) Check if User Already Exist
  if (!user) {
    throw new AppError('No User Found', 404);
  }

  // 4) If Everything is OK, Send Generate Tokens
  return generateAuthTokens(user);
});

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = catchAsync(
  async (resetPasswordToken, newPassword, newPasswordConfirmation) => {
    // 1) Verify Reset Password Token
    const resetPasswordTokenDoc = await verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );

    if (resetPasswordTokenDoc.user.role === 'seller') {
      // 2) Find User and Update it's Password
      const user = await User.findByIdAndUpdate(resetPasswordTokenDoc.user, {
        password: newPassword,
        passwordConfirmation: newPasswordConfirmation
      });

      // 3) Check if User Already Exist
      if (!user) {
        throw new AppError('No User Found', 404);
      }

      // 4) Sending After Reset Password Mail
      await sendAfterResetPasswordMessage(user.email);

      // 5) Deleteing User Reset Token
      await Token.deleteMany({
        user: user.id,
        type: tokenTypes.RESET_PASSWORD
      });
    } else {
      // 2) Find Seller and Update it's Password
      const seller = await Seller.findByIdAndUpdate(
        resetPasswordTokenDoc.user,
        {
          password: newPassword,
          passwordConfirmation: newPasswordConfirmation
        }
      );

      // 3) Check if Seller Doesn't Exist
      if (!seller) {
        throw new AppError('Seller Not Found', 404);
      }

      // 4) Sending After Reset Password Mail
      await sendAfterResetPasswordMessage(seller.email);

      // 5) Deleteing Seller Reset Token
      await Token.deleteMany({
        user: seller.id,
        type: tokenTypes.RESET_PASSWORD
      });
    }
  }
);

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = catchAsync(async (verifyEmailToken) => {
  // 1) Verify Email Token
  const verifyEmailTokenDoc = await verifyToken(
    verifyEmailToken,
    tokenTypes.VERIFY_EMAIL
  );

  if (verifyEmailTokenDoc.user.role === 'user') {
    // 2) Find User
    const user = await User.findById(verifyEmailTokenDoc.user);

    // 3) Check if User Already Exist
    if (!user) {
      throw new AppError('No User Found', 404);
    }

    // 4) Deleting User Verify Email Token
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });

    // 5) Update User isEmailVerified Filed (Set True)
    await updateUserById(user.id, { isEmailVerified: true });
  } else {
    // 2) Find Seller
    const seller = await Seller.findById(verifyEmailTokenDoc.user);

    // 3) Check if Seller Doesn't Exist
    if (!seller) {
      throw new AppError('Seller Not Found', 404);
    }

    // 4) Deleting Seller Verify Email Token
    await Token.deleteMany({ user: seller.id, type: tokenTypes.VERIFY_EMAIL });

    // 5) Update Seller isEmailVerified Filed (Set True)
    await updateUserById(seller.id, { isEmailVerified: true });
  }
});
