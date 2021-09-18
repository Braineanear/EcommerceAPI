// Packages
import express from 'express';

// Controllers
import { authController } from '../controllers/index';

// Utils
import { singleFile } from '../utils/multer';

// Middlewares
import protect from '../middlewares/protect';

const {
  signin,
  signup,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  changePassword
} = authController;

const router = express.Router();

router.post('/login', signin);

router.post('/register', singleFile('image'), signup);

router.post('/logout', logout);

router.post('/tokens', refreshTokens);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/verify-email', verifyEmail);

router.use(protect);

router.post('/send-verification-email', sendVerificationEmail);

router.patch('/change-password', changePassword);

export default router;
