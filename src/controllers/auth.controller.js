// Utils
import catchAsync from '../utils/catchAsync';

// Services
import {
  authService,
  userService,
  sellerService,
  tokenService,
  emailService
} from '../services/index';

/**
 * Registeration As User
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const registerAsUser = catchAsync(async (req, res) => {
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
 * Login As User
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const loginAsUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // 1) Login User Email & Password
  const user = await authService.loginUserWithEmailAndPassword({
    email,
    password
  });

  // 2) Generate Auth Tokens
  const tokens = await tokenService.generateAuthTokens(user);

  // 3) If Everything is OK, Send User's Data & Tokens
  return res.status(200).json({
    status: 'success',
    message: 'User Logged in Successfully',
    user,
    tokens
  });
});

/**
 * Registeration As Seller
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const registerAsSeller = catchAsync(async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    passwordConfirmation,
    companyName,
    phone,
    address
  } = req.body;

  // 1) Create Seller
  const seller = await sellerService.createSeller(
    {
      name,
      username,
      email,
      password,
      passwordConfirmation,
      companyName,
      phone,
      address
    },
    req.file
  );

  // 2) Generate Tokens [Access Token / Refresh Token]
  const tokens = await tokenService.generateAuthTokens(seller);

  // 3) Generate Verification Email Token
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(seller);

  // 4) Sending Verification Email
  await emailService.sendVerificationEmail(seller.email, verifyEmailToken);

  // 5) If Everything OK, Send Seller Data With Tokens
  return res.status(200).json({
    status: 'success',
    message: 'Registeration Done Successfully & Email Verification Sent',
    seller,
    tokens
  });
});

/**
 * Login As Seller
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const loginAsSeller = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1) Login Seller Email & Password
  const seller = await authService.loginSellerWithEmailAndPassword({
    email,
    password
  });

  // 2) Generate Auth Tokens
  const tokens = await tokenService.generateAuthTokens(seller);

  // 3) If Everything is OK, Send Seller's Data & Tokens
  return res.status(200).json({
    status: 'success',
    message: 'Seller Logged in Successfully',
    seller,
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
  await authService.logout(req.body.refreshToken);

  // 2) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Account Logged out Successfully'
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
  const tokens = await authService.refreshAuth(refreshToken);

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
    status: 'success',
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
    status: 'success',
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
  await authService.verifyEmail(token);

  // 2) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Email Verified Successfully'
  });
});
