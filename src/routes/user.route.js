import express from 'express';

// Middlewares
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
    singleFile('image'),
    createUser
  )
  .get(validate(getUsersValidate), getUsers);

router
  .route('/:id')
  .get(validate(getUserValidate), getUser)
  .delete(validate(deleteUserValidate), deleteUser);

router.patch(
  '/:id/details',
  validate(updateUserValidate),
  updateUserDetails
);
router.patch(
  '/:id/profile-image',
  singleFile('image'),
  updateUserProfileImage
);
export default router;
