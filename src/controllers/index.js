import {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
} from './auth.controller';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from './user.controller';

const authController = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail
};
const userController = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};

export { authController, userController };
