// Utils
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

// Services
import {
  authService,
  userService,
  tokenService,
  emailService
} from '../services/index';

/**
 * Registeration
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const register = catchAsync(async (req, res, next) => {
  const { username, name, email, password, passwordConfirmation } = req.body;

  // 1) Create User
  const user = await userService.createUser({
    username,
    name,
    email,
    password,
    passwordConfirmation
  });

  // 2) Generate Tokens [Access Token / Refresh Token]
  const tokens = await tokenService.generateAuthTokens(user);

  // 3) Generate Verification Email Token
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);

  // 4) Sending Verification Email
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  // 5) If Everything OK, Send User Data With Tokens
  return res.status(200).json({
    status: 'success',
    message: 'Registeration Done Successfully & Email Verification Sent',
    user,
    tokens
  });
});

/**
 * Login
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Login User Email & Password
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  // 3) Generate Auth Tokens
  const tokens = await tokenService.generateAuthTokens(user);

  // 4) If Everything is OK, Send User's Data & Tokens
  return res.status(200).json({
    status: 'success',
    message: 'User Logged in Successfully',
    user,
    tokens
  });
});

/**
 * Logout
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const logout = catchAsync(async (req, res, next) => {
  // 1) Logging Out User From System
  await authService.logout(req.body.refreshToken);

  // 2) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'User Logged out Successfully'
  });
});

/**
 * Generate Refresh Token
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const refreshTokens = catchAsync(async (req, res, next) => {
  // 1) Generating Refresh Token
  const tokens = await authService.refreshAuth(req.body.refreshToken);

  // 2) If Everything is OK, Send Tokens
  return res.status(200).json({
    status: 'success',
    message: 'Refresh Token Generated Successfully',
    ...tokens
  });
});

/**
 * Forgot Password
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Generate Reset Password Token
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );

  // 2) Sending Reset Link to User Email
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Reset Password Link Sent Successfully'
  });
});

/**
 * Reset Password
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirmation } = req.body;
  const { token } = req.query;

  // 1) Reseting Password
  await authService.resetPassword(token, password, passwordConfirmation);

  // 2) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Password Reset Successfully'
  });
});

/**
 * Send Verification Email
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const sendVerificationEmail = catchAsync(async (req, res, next) => {
  // 1) Generate Verification Token
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );

  // 2) Sending Verification Email to User Email
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Verification Email Sent Successfully'
  });
});

/**
 * Verify Email
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Verifying User Email
  await authService.verifyEmail(req.query.token);

  // 2) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Email Verified Successfully'
  });
});
