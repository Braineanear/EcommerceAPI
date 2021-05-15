import express from 'express';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';

import { authValidation } from '../validations/index';
import { authController } from '../controllers/index';

const {
  registerAsUserValidate,
  registerAsSellerValidate,
  loginValidate,
  logoutValidate,
  refreshTokensValidate,
  forgotPasswordValidate,
  resetPasswordValidate,
  verifyEmailValidate
} = authValidation;

const {
  registerAsUser,
  registerAsSeller,
  loginAsUser,
  loginAsSeller,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail
} = authController;

const router = express.Router();

router.post('/user/register', validate(registerAsUserValidate), registerAsUser);

router.post('/user/login', validate(loginValidate), loginAsUser);

router.post(
  '/seller/register',
  validate(registerAsSellerValidate),
  registerAsSeller
);

router.post('/seller/login', validate(loginValidate), loginAsSeller);

router.post('/logout', validate(logoutValidate), logout);

router.post('/refresh-tokens', validate(refreshTokensValidate), refreshTokens);

router.post(
  '/forgot-password',
  validate(forgotPasswordValidate),
  forgotPassword
);

router.post('/reset-password', validate(resetPasswordValidate), resetPassword);

router.post(
  '/send-verification-email',
  auth('user', 'seller'),
  sendVerificationEmail
);

router.post(
  '/verify-email',
  auth('user', 'seller'),
  validate(verifyEmailValidate),
  verifyEmail
);

export default router;
