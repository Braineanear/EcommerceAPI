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
import { Token, User } from '../models/index';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
  let err, user, isMatch;

  // 1) Get User With Specific Email and Password
  [err, user] = await catchAsync(User.findOne({ email }).select('+password'));

  // 2) Check if Passwords are The Same
  [err, isMatch] = await catchAsync(user.isPasswordMatch(password));

  // 3) If Email or Passwords isn't Correct
  if (!user || !isMatch) {
    throw new AppError('Incorrect email or password', 403);
  }

  // 4) Handling findOne or isPasswordMatch Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 5) If Everything OK, Send User's Data
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken) => {
  // 1) Find Token Document and Delete it
  const [err, refreshTokenDoc] = await catchAsync(
    Token.findOneAndDelete({
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false
    })
  );

  // 2) Check if Token Already Exist
  if (!refreshTokenDoc) {
    throw new AppError('Not found', 404);
  }

  // 3) Handling findOneAndDelete Method Errors
  if (err) {
    throw new AppError(err);
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
  let err, refreshTokenDoc, user;

  // 1) Verify Refresh Token
  [err, refreshTokenDoc] = await catchAsync(
    verifyToken(refreshToken, tokenTypes.REFRESH)
  );

  // 2) Handling verifyToken Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 3) Find User Document and Delete it
  [err, user] = await catchAsync(User.findByIdAndDelete(refreshTokenDoc.user));

  // 4) Check if User Already Exist
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // 5) Handling findByIdAndDelete Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 6) If Everything is OK, Send Generate Tokens
  return generateAuthTokens(user);
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = async (
  resetPasswordToken,
  newPassword,
  newPasswordConfirmation
) => {
  let err, resetPasswordTokenDoc, user;

  // 1) Verify Reset Password Token
  [err, resetPasswordTokenDoc] = await catchAsync(
    verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD)
  );

  // 2) Handling verifyToken Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 3) Find User and Update it's Password
  [err, user] = await catchAsync(
    User.findByIdAndUpdate(resetPasswordTokenDoc.user, {
      password: newPassword,
      passwordConfirmation: newPasswordConfirmation
    })
  );

  // 4) Check if User Already Exist
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // 5) Handling findByIdAndUpdate Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 6) Sending After Reset Password Mail
  [err] = await catchAsync(sendAfterResetPasswordMessage(user.email));

  // 7) Handling sendAfterResetPasswordMessage Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 8) Deleteing User Reset Token
  [err] = await catchAsync(
    Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD })
  );

  // 9) Handling deleteMany Method Errors
  if (err) {
    throw new AppError(err);
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken) => {
  let err, verifyEmailTokenDoc, user;

  // 1) Verify Email Token
  [err, verifyEmailTokenDoc] = await catchAsync(
    verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL)
  );

  // 2) Handling verifyToken Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 3) Find User
  [err, user] = await catchAsync(User.findById(verifyEmailTokenDoc.user));

  // 4) Check if User Already Exist
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // 5) Handling findById Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 6) Deleting User Verify Email Token
  [err] = await catchAsync(
    Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL })
  );

  // 7) Handling deleteMany Method Errors
  if (err) {
    throw new AppError(err);
  }

  // 8) Update User isEmailVerified Filed (Set True)
  [err] = await catchAsync(updateUserById(user.id, { isEmailVerified: true }));

  // 9) Handling updateUserById Method Errors
  if (err) {
    throw new AppError(err);
  }
};
