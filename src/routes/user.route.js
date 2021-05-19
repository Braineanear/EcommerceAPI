import express from 'express';

// Middlewares
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';

// Validations
import {
  createUserValidate,
  getUsersValidate,
  getUserValidate,
  updateUserValidate,
  deleteUserValidate
} from '../validations/user.validation';

// Controllers
import {
  createUser,
  getUsers,
  getUser,
  updateUserDetails,
  updateUserProfileImage,
  deleteUser
} from '../controllers/user.controller';

// Utils
import { singleFile } from '../utils/multer';

const router = express.Router();

router
  .route('/')
  .post(
    auth('admin'),
    singleFile('image'),
    createUser
  )
  .get(validate(getUsersValidate), getUsers);

router
  .route('/:id')
  .get(validate(getUserValidate), getUser)
  .delete(auth('admin'), validate(deleteUserValidate), deleteUser);

router.patch(
  '/:id/details',
  auth('admin'),
  validate(updateUserValidate),
  updateUserDetails
);
router.patch(
  '/:id/profile-image',
  auth('admin'),
  singleFile('image'),
  updateUserProfileImage
);
export default router;
