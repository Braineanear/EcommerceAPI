// Packages
import express from 'express';

// Controllers
import { authController } from '../controllers/index';

// Utils
import { singleFile } from '../utils/multer';

const {
  signin,
  signup,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail
} = authController;

// Router Initialization
const router = express.Router();

// Login Route
router.post('/login', signin);

// Register Route (Multer Middleware)
router.post('/register', singleFile('image'), signup);

// Logout Route
router.post('/logout', logout);

// Refresh Token Route
router.post('/tokens', refreshTokens);

// Forgot Password Route
router.post('/forgot-password', forgotPassword);

// Reset Password Route
router.post('/reset-password', resetPassword);

// Send Verification Email Route
router.post('/send-verification-email', sendVerificationEmail);

// Verify Email Route
router.post('/verify-email', verifyEmail);

export default router;
