// External Packages
import jwt from 'jsonwebtoken';
import moment from 'moment';

// Config
import config from '../config/config';
import tokenTypes from '../config/tokens';

// Utils
import AppError from '../utils/appError';
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
export const saveToken = async (token, userId, expires, type) => {
  // 1) Create New Token Document
  const [err, tokenDoc] = await catchAsync(
    Token.create({
      token,
      user: userId,
      expires: expires.toDate(),
      type
    })
  );

  // 2) Handling create Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 3) If Everything is OK, Send Token Data
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token, type) => {
  // 1) Verify Token
  const payload = jwt.verify(token, config.jwt.secret);

  // 2) Get Token Data
  const [err, tokenDoc] = await catchAsync(
    Token.findOne({
      token,
      type,
      user: payload.sub
    })
  );

  // 3) Check if Token Already Exist or not
  if (!tokenDoc) {
    throw new AppError('Token not found', 404);
  }

  // 4) Handling findOne Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 5) If Everything is OK, Send Token
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user) => {
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
  const [err] = await catchAsync(
    saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH)
  );

  // 6) Handling saveToken Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // If Everything is OK, Send Access Token & Refresh Token
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
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email) => {
  let err, user;

  // 1) Get User's Data
  [err, user] = await catchAsync(User.findOne({ email }));

  // 2) Check if User Exist or not
  if (!user) {
    throw new AppError('No users found with this email', 404);
  }

  // 3) Set Reset Token Expire Time
  const resetTokenExpires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    'minutes'
  );

  // 4) Generate Reset Token
  const resetPasswordToken = generateToken(
    user.id,
    resetTokenExpires,
    tokenTypes.RESET_PASSWORD
  );

  // 5) Save Reset Token
  [err] = await catchAsync(
    saveToken(
      resetPasswordToken,
      user.id,
      resetTokenExpires,
      tokenTypes.RESET_PASSWORD
    )
  );

  // 6) Handling saveToken Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 7) If Everything is OK, Send Reset Password Token
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user) => {
  // 1) Set Verify Email Token Expire Time
  const verifyEmailTokenExpires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    'minutes'
  );

  // 2) Generate Verify Email Token
  const verifyEmailToken = generateToken(
    user.id,
    verifyEmailTokenExpires,
    tokenTypes.VERIFY_EMAIL
  );

  // 3) Save Verify Email Token
  const [err] = await catchAsync(
    saveToken(
      verifyEmailToken,
      user.id,
      verifyEmailTokenExpires,
      tokenTypes.VERIFY_EMAIL
    )
  );

  // 4) Handling saveToken Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 5) If Everything is OK, Send Verify Email Token
  return verifyEmailToken;
};
