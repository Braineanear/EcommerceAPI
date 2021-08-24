// Packages
import express from 'express';

// Middlewares
import protect from '../middlewares/protect';
import restrictedTo from '../middlewares/restrictedTo';
// Controllers
import {
  createUser,
  getUsers,
  getUser,
  updateUserDetails,
  updateUserProfileImage,
  deleteUser,
  deleteMyAccount
} from '../controllers/user.controller';

// Utils
import { singleFile } from '../utils/multer';

// Router Initialization
const router = express.Router();

// Get All Users Route
router.get('/', getUsers);

// Get User Route
router.get('/:id', getUser);

// Protect All Next Routes
router.use(protect);

// Create New User (Multer Middleware) Route
router.post('/', restrictedTo('admin'), singleFile('image'), createUser);

// Update User Details Route
router.patch('/update-details', updateUserDetails);

// Update User Profile Image (Multer Middleware) Route
router.patch(
  '/update-profile-image',
  singleFile('image'),
  updateUserProfileImage
);

// Delete LoggedIn User Account Route
router.delete('/me', deleteMyAccount);

// Delete User Route
router.delete('/:id', restrictedTo('admin'), deleteUser);

export default router;
