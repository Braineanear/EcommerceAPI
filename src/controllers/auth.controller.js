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
export const register = async (req, res, next) => {
  const { username, name, email, password, passwordConfirmation } = req.body;
  let err, user, tokens, verifyEmailToken;

  // 1) Create User
  [err, user] = await catchAsync(
    userService.createUser({
      username,
      name,
      email,
      password,
      passwordConfirmation
    })
  );

  // 2) Handling createUser Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) Generate Tokens [Access Token / Refresh Token]
  [err, tokens] = await catchAsync(tokenService.generateAuthTokens(user));

  // 4) Handling generateAuthTokens Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 5) Generate Verification Email Token
  [err, verifyEmailToken] = await catchAsync(
    tokenService.generateVerifyEmailToken(user)
  );

  // 6) Handling generateVerifyEmailToken Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 7) Sending Verification Email
  [err] = await catchAsync(
    emailService.sendVerificationEmail(user.email, verifyEmailToken)
  );

  // 8) Handling sendVerificationEmail Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 9) If Everything OK, Send User Data With Tokens
  return res.status(200).json({
    status: 'success',
    message: 'Registeration Done Successfully & Email Verification Sent',
    user,
    tokens
  });
};

/**
 * Login
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let err, user, tokens;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Login User Email & Password
  [err, user] = await catchAsync(
    authService.loginUserWithEmailAndPassword(email, password)
  );

  // 3) Handling loginUserWithEmailAndPassword Method Errors (Incorrect Email or Passsword | User doesn't exist)
  if (err) {
    return next(new AppError(err, 500));
  }

  // 4) Generate Auth Tokens
  [err, tokens] = await catchAsync(tokenService.generateAuthTokens(user));

  // 5) Handling generateAuthTokens Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 6) If Everything is OK, Send User's Data & Tokens
  return res.status(200).json({
    status: 'success',
    message: 'User Logged in Successfully',
    user,
    tokens
  });
};

/**
 * Logout
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const logout = async (req, res, next) => {
  // 1) Logging Out User From System
  const [err] = await catchAsync(authService.logout(req.body.refreshToken));

  // 2) Handling logout Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'User Logged out Successfully'
  });
};

/**
 * Generate Refresh Token
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const refreshTokens = async (req, res, next) => {
  // 1) Generating Refresh Token
  const [err, tokens] = await catchAsync(
    authService.refreshAuth(req.body.refreshToken)
  );

  // 2) Handling refreshToken Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) If Everything is OK, Send Tokens
  return res.status(200).json({
    status: 'success',
    message: 'Refresh Token Generated Successfully',
    ...tokens
  });
};

/**
 * Forgot Password
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const forgotPassword = async (req, res, next) => {
  let err, resetPasswordToken;

  // 1) Generate Reset Password Token
  [err, resetPasswordToken] = await catchAsync(
    tokenService.generateResetPasswordToken(req.body.email)
  );

  // 2) Handling generateResetPasswordToken Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) Sending Reset Link to User Email
  [err] = await catchAsync(
    emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken)
  );

  // 4) Handling sendResetPasswordEmail Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 5) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Reset Password Link Sent Successfully'
  });
};

/**
 * Reset Password
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const resetPassword = async (req, res, next) => {
  const { password, passwordConfirmation } = req.body;
  const { token } = req.query;

  // 1) Reseting Password
  const [err] = await catchAsync(
    authService.resetPassword(token, password, passwordConfirmation)
  );

  // 2) Handling resetPassword Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Password Reset Successfully'
  });
};

/**
 * Send Verification Email
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const sendVerificationEmail = async (req, res, next) => {
  let err, verifyEmailToken;

  // 1) Generate Verification Token
  [err, verifyEmailToken] = await catchAsync(
    tokenService.generateVerifyEmailToken(req.user)
  );

  // 2) Handling generateVerifyEmailToken Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) Sending Verification Email to User Email
  [err] = await catchAsync(
    emailService.sendVerificationEmail(req.user.email, verifyEmailToken)
  );

  // 4) Handling sendVerificationEmail Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 5) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Verification Email Sent Successfully'
  });
};

/**
 * Verify Email
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const verifyEmail = async (req, res, next) => {
  // 1) Verifying User Email
  const [err] = await catchAsync(authService.verifyEmail(req.query.token));

  // 2) Handling verifyEmail Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Email Verified Successfully'
  });
};
