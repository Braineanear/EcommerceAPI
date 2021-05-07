import express from 'express';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';

import { authValidation } from '../validations/index';
import { authController } from '../controllers/index';

const {
  registerValidate,
  loginValidate,
  logoutValidate,
  refreshTokensValidate,
  forgotPasswordValidate,
  resetPasswordValidate,
  verifyEmailValidate
} = authValidation;

const {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail
} = authController;

const router = express.Router();

router.post('/register', validate(registerValidate), register);
router.post('/login', validate(loginValidate), login);
router.post('/logout', validate(logoutValidate), logout);
router.post('/refresh-tokens', validate(refreshTokensValidate), refreshTokens);
router.post(
  '/forgot-password',
  validate(forgotPasswordValidate),
  forgotPassword
);
router.post('/reset-password', validate(resetPasswordValidate), resetPassword);
router.post('/send-verification-email', auth('user'), sendVerificationEmail);
router.post(
  '/verify-email',
  auth('user'),
  validate(verifyEmailValidate),
  verifyEmail
);

export default router;
