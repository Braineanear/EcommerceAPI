// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { authService, emailService, tokenService } from '../services/index';

/**
 * Sign Up Controller
 * @param   { Object } req
 * @param   { Object } res
 * @returns { JSON }
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
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    user,
    tokens
  });
});

/**
 * Sign In Controller
 * @param   { Object } req
 * @param   { Object } res
 * @returns { JSON }
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
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    user,
    tokens
  });
});

/**
 * Logout Controller
 * @param   { Object } req
 * @param   { Object } res
 * @returns { JSON }
 */
export const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  // 1) Calling log out service
  const { type, message, statusCode } = await authService.logout(refreshToken);

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message
  });
});

/**
 * Generate Refresh Token Controller
 * @param   { Object } req
 * @param   { Object } res
 * @returns { JSON }
 */
export const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  // 1) Calling refresh token service
  const { type, message, statusCode, tokens } = await authService.refreshAuth(
    refreshToken
  );

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    tokens
  });
});

/**
 * Forgot Password Controller
 * @param   { Object } req
 * @param   { Object } res
 * @returns { JSON }
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  // 1) Generate reset password token
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    email
  );

  // 2) Sending reset link to user email
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);

  // 3) If everything is OK, send data
  return res.status(200).json({
    status: 'success',
    type: 'Success',
    message: 'Reset Password Link Sent Successfully'
  });
});

/**
 * Reset Password Controller
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { password, passwordConfirmation } = req.body;
  const { token } = req.query;

  // 1) Calling reset password service
  const { type, message, statusCode } = await authService.resetPassword(
    token,
    password,
    passwordConfirmation
  );

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message
  });
});

/**
 * Send Verification Email Controller
 * @param   { Object } req
 * @param   { Object } res
 * @returns { JSON }
 */
export const sendVerificationEmail = catchAsync(async (req, res) => {
  const { user } = req;

  // 1) Check if user email is already verified
  if (user.isEmailVerified) {
    return res.status(400).json({
      type: 'Error',
      message: 'Email is already verified'
    });
  }

  // 2) Generate verification token
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);

  // 3) Sending verification email to user email
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  // 4) If everything is OK, send data
  return res.status(200).json({
    status: 'success',
    type: 'Success',
    message: 'Verification Email Sent Successfully'
  });
});

/**
 * Verify Email Controller
 * @param   { Object } req
 * @param   { Object } res
 * @returns { JSON }
 */
export const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  // 1) Calling verify email service
  const { type, message, statusCode } = await authService.verifyEmail(token);

  // 2) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message
  });
});
