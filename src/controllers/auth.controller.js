// Utils
import catchAsync from '../utils/catchAsync';
import {
  sendResetPasswordEmail,
  sendVerificationEmail as sendVerifyEmail
} from '../utils/sendEmail';

// Middlewares
import {
  generateVerifyEmailToken,
  generateResetPasswordToken
} from '../middlewares/token';

// Services
import { authService } from '../services';

/**
 * @desc      Sign Up Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body data
 * @property  { Object } req.file - User image
 * @returns   { JSON } - A JSON object representing the type, message, user data, and tokens
 */
export const signup = catchAsync(async (req, res) => {
  // 1) Calling sign up service
  const { type, message, statusCode, user, tokens } = await authService.signup(
    req.body,
    req.file
  );

  // 2) Check if something went wrong
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
    user,
    tokens
  });
});

/**
 * @desc      Sign In Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.email - User email address
 * @property  { Object } req.body.password - User password
 * @returns   { JSON } - A JSON object representing the type, message, user data, and tokens
 */
export const signin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1) Calling sign in service
  const { type, message, statusCode, user, tokens } = await authService.signin(
    email,
    password
  );

  // 2) Check if something went wrong
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
    user,
    tokens
  });
});

/**
 * @desc      Logout Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.refreshToken - User refresh token
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const logout = catchAsync(async (req, res) => {
  // 1) Calling log out service
  const { type, message, statusCode } = await authService.logout(
    req.body.refreshToken
  );

  // 2) Check if something went wrong
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
 * @desc      Generate Refresh Token Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.refreshToken - User refresh token
 * @returns   { JSON } - A JSON object representing the type, message, and tokens
 */
export const refreshTokens = catchAsync(async (req, res) => {
  // 1) Calling refresh token service
  const { type, message, statusCode, tokens } = await authService.refreshAuth(
    req.body.refreshToken
  );

  // 2) Check if something went wrong
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
    tokens
  });
});

/**
 * @desc      Forgot Password Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.email - User email address
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  // 1) Generate reset password token
  const resetPasswordToken = await generateResetPasswordToken(email);

  // 2) Sending reset link to user email
  await sendResetPasswordEmail(email, resetPasswordToken);

  // 3) If everything is OK, send data
  return res.status(200).json({
    type: 'Success',
    message: req.polyglot.t('successfulResetLink')
  });
});

/**
 * @desc      Reset Password Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.query.token - Token from request query
 * @property  { String } req.body.password - The new user password
 * @property  { String } req.body.passwordConfirmation - The new user password confirmation
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const resetPassword = catchAsync(async (req, res) => {
  // 1) Calling reset password service
  const { type, message, statusCode } = await authService.resetPassword(
    req.query.token,
    req.body.password,
    req.body.passwordConfirmation
  );

  // 2) Check if something went wrong
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
 * @desc      Change Password Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.currentPassword - The user current password
 * @property  { String } req.body.password - The new user password
 * @property  { String } req.body.passwordConfirmation - The new user password confirmation
 * @property  { String } req.user.id - User ID
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, password, passwordConfirmation } = req.body;
  // 1) Calling reset password service
  const { type, message, statusCode } = await authService.changePassword(
    currentPassword,
    password,
    passwordConfirmation,
    req.user.id
  );

  // 2) Check if something went wrong
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
 * @desc      Send Verification Email Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.user - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const sendVerificationEmail = catchAsync(async (req, res) => {
  const { user } = req;

  // 1) Check if user email is already verified
  if (user.isEmailVerified) {
    return res.status(400).json({
      type: 'Error',
      message: req.polyglot.t('emailVerified')
    });
  }

  // 2) Generate verification token
  const verifyEmailToken = await generateVerifyEmailToken(user);

  // 3) Sending verification email to user email
  await sendVerifyEmail(user.email, verifyEmailToken);

  // 4) If everything is OK, send data
  return res.status(200).json({
    type: 'Success',
    message: req.polyglot.t('successfulSendVerificationEmail')
  });
});

/**
 * @desc      Verify Email Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.query.token - Verification token from request query
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const verifyEmail = catchAsync(async (req, res) => {
  // 1) Calling verify email service
  const { type, message, statusCode } = await authService.verifyEmail(
    req.query.token
  );

  // 2) Check if something went wrong
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
