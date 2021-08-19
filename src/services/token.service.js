// Packages
import jwt from 'jsonwebtoken';
import moment from 'moment';

// Configs
import config from '../config/config';
import tokenTypes from '../config/tokens';

// Models
import { User, Token } from '../models/index';

/**
 * Generate token
 * @param   { ObjectId }  userId
 * @param   { Date }      expires
 * @param   { String }    type
 * @returns { String }
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
 * @param   { String }    token
 * @param   { ObjectId }  userId
 * @param   { Date }      expires
 * @param   { String }    type
 * @returns { Promise <Token> }
 */
export const saveToken = async (token, userId, expires, type) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type
  });

  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param   { String } token
 * @param   { String } type
 * @returns { Promise <Token> }
 */
export const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);

  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub
  });

  if (!tokenDoc) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'Token not found.'
    };
  }

  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param   { Object } user
 * @returns { Promise <Tokens> }
 */
export const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes'
  );

  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days'
  );

  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    accessToken,
    refreshToken
  };
};

/**
 * Generate reset password token
 * @param   { String } email
 * @returns { Promise <Token> }
 */
export const generateResetPasswordToken = async (email) => {
  // 1) Extract user data from database
  const user = await User.findOne({ email });

  // 2) Check if user does not exist
  if (!user) {
    return {
      type: 'Error',
      statusCode: 404,
      message: `No user found with this email ${email}`
    };
  }

  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    'minutes'
  );

  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );

  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );

  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param   { Object } user
 * @returns { Promise <Token> }
 */
export const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    'minutes'
  );

  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );

  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);

  return verifyEmailToken;
};
