// External Packages
import jwt from 'jsonwebtoken';
import moment from 'moment';

// Config
import config from '../config/config';
import tokenTypes from '../config/tokens';

// Utils
import catchAsync from '../utils/catchAsync';

// Models
import { Token, User } from '../models/index';

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId,
  expires,
  type,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };

  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const saveToken = catchAsync(async (token, id, expires, type) => {
  // 1) Create New Token Document
  const tokenDoc = await Token.create({
    token,
    user: id,
    expires: expires.toDate(),
    type
  });

  // 2) If Everything is OK, Send Token Data
  return tokenDoc;
});

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param   {String} token
 * @param   {String} type
 * @returns {Object<type|message|statusCode|token>}
 */
export const verifyToken = catchAsync(async (token, type) => {
  // 1) Verify Token
  const payload = jwt.verify(token, config.jwt.secret);

  // 2) Get Token Data
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub
  });

  // 3) Check if Token Already Exist or not
  if (!tokenDoc) {
    return {
      type: 'Error',
      message: 'Token Not Found',
      statusCode: 404
    };
  }

  // 4) If Everything is OK, Send Token
  return {
    type: 'Success',
    message: 'Token Verified Successfully',
    statusCode: 200,
    tokenDoc
  };
});

/**
 * Generate auth tokens
 * @param   {User} user
 * @returns {Object<tokens>}
 */
export const generateAuthTokens = catchAsync(async (user) => {
  // 1) Set Access Token Expire Time
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );

  // 2) Generate Access Token
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  // 3) Set Refresh Token Expire Time
  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days'
  );

  // 4) Generate Refresh Token
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  // 5) Save Tokens
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  // 6) If Everything is OK, Send Access Token & Refresh Token
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
});

/**
 * Generate reset password token
 * @param   {String} email
 * @returns {Object<type|message|statusCode|>}
 */
export const generateResetPasswordToken = catchAsync(async (email) => {
  // 1) Get User's Data
  const user = await User.findOne({ email });

  // 2) Set Reset Token Expire Time
  const resetTokenExpires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    'minutes'
  );

  // 3) Generate Reset Token
  const resetPasswordToken = generateToken(
    user.id,
    resetTokenExpires,
    tokenTypes.RESET_PASSWORD
  );

  // 4) Save Reset Token
  await saveToken(
    resetPasswordToken,
    user.id,
    resetTokenExpires,
    tokenTypes.RESET_PASSWORD
  );

  // 5) If Everything is OK, Send Reset Password Token
  return resetPasswordToken;
});

/**
 * Generate verify email token
 * @param   {String} email
 * @returns {Object<token>}
 */
export const generateVerifyEmailToken = catchAsync(async (id) => {
  // 1) Set Verify Email Token Expire Time
  const verifyEmailTokenExpires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    'minutes'
  );

  // 2) Generate Verify Email Token
  const verifyEmailToken = generateToken(
    id,
    verifyEmailTokenExpires,
    tokenTypes.VERIFY_EMAIL
  );

  // 3) Save Verify Email Token
  await saveToken(
    verifyEmailToken,
    id,
    verifyEmailTokenExpires,
    tokenTypes.VERIFY_EMAIL
  );

  // 4) If Everything is OK, Send Verify Email Token
  return verifyEmailToken;
});
