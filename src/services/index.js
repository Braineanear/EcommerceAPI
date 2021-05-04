import {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
} from './auth.service';

import {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
} from './token.service';

import {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendAfterResetPasswordMessage,
  sendVerificationEmail
} from './email.service';

import {
  createUser,
  queryUsers,
  updateUserById,
  deleteUserById
} from './user.service';

import { set, get, generateCacheKey } from './redis.service';

const authService = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail
};

const emailService = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendAfterResetPasswordMessage,
  sendVerificationEmail
};

const tokenService = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken
};

const userService = {
  createUser,
  queryUsers,
  updateUserById,
  deleteUserById
};

const redisService = { set, get, generateCacheKey };

export { authService, tokenService, userService, emailService, redisService };
