import express from 'express';

// Middlewares
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';

// Validations
import { authValidation } from '../validations/index';

// Controllers
import { authController } from '../controllers/index';

// Utils
import { singleFile } from '../utils/multer';

const {
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

router.post('/register', singleFile('image'), register);

router.post('/login', validate(loginValidate), login);

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
