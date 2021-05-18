// Utils
import catchAsync from '../utils/catchAsync';

// Services
import {
  authService,
  userService,
  tokenService,
  emailService
} from '../services/index';

/**
 * Registeration As User
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const register = catchAsync(async (req, res, next) => {
  const {
    username,
    name,
    email,
    password,
    passwordConfirmation,
    address,
    companyName,
    phone,
    role
  } = req.body;

  const profileImage = req.file;

  if (role === 'admin') {
    return res.status(400).json({
      type: 'Error',
      message: 'Role Cannot Be Admin, Select [user | seller]'
    });
  }

  // 1) Create User
  const { type, message, statusCode, user } = await userService.createUser(
    {
      username,
      name,
      email,
      password,
      passwordConfirmation,
      address,
      companyName,
      phone,
      role
    },
    profileImage
  );

  // 2) Generate Tokens [Access Token / Refresh Token]
  const tokens = await tokenService.generateAuthTokens(user);

  // 3) Generate Verification Email Token
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);

  // 4) Sending Verification Email
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  // 5) If Everything OK, Send User Data With Tokens
  return res.status(statusCode).json({
    type,
    message,
    user,
    tokens
  });
});

/**
 * Login
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // 1) Login User Email & Password
  const { type, message, statusCode, user } =
    await authService.loginWithEmailAndPassword({
      email,
      password
    });

  // 2) Generate Auth Tokens
  const tokens = await tokenService.generateAuthTokens(user);

  // 3) If Everything is OK, Send User's Data & Tokens
  return res.status(statusCode).json({
    type,
    message,
    user,
    tokens
  });
});

/**
 * Logout
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const logout = catchAsync(async (req, res) => {
  // 1) Logging Out User / Seller From System
  const { type, message, statusCode } = await authService.logout(
    req.body.refreshToken
  );

  // 2) If Everything is OK, Send Message
  return res.status(statusCode).json({
    type,
    message
  });
});

/**
 * Generate Refresh Token
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  // 1) Generating Refresh Token
  const { type, message, statusCode, tokens } = await authService.refreshAuth(
    refreshToken
  );

  // 2) If Everything is OK, Send Tokens
  return res.status(statusCode).json({
    type,
    message,
    ...tokens
  });
});

/**
 * Forgot Password
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  // 1) Generate Reset Password Token
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    email
  );

  // 2) Sending Reset Link to User Email
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    type: 'Success',
    message: 'Reset Password Link Sent Successfully'
  });
});

/**
 * Reset Password
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const resetPassword = catchAsync(async (req, res) => {
  const { password, passwordConfirmation } = req.body;
  const { token } = req.query;

  // 1) Reseting Password
  const { type, message, statusCode } = await authService.resetPassword(
    token,
    password,
    passwordConfirmation
  );

  // 2) If Everything is OK, Send Message
  return res.status(statusCode).json({
    type,
    message
  });
});

/**
 * Send Verification Email
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const sendVerificationEmail = catchAsync(async (req, res) => {
  const { user } = req;

  // 1) Generate Verification Token
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);

  // 2) Sending Verification Email to User Email
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    type: 'Success',
    message: 'Verification Email Sent Successfully'
  });
});

/**
 * Verify Email
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  // 1) Verifying User Email
  const { type, message, statusCode } = await authService.verifyEmail(token);

  // 2) If Everything is OK, Send Message
  return res.status(statusCode).json({
    type,
    message
  });
});
