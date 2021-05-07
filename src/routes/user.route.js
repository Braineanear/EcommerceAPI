import express from 'express';

import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import {
  createUserValidate,
  getUsersValidate,
  getUserValidate,
  updateUserValidate,
  deleteUserValidate
} from '../validations/user.validation';
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller';

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(createUserValidate), createUser)
  .get(validate(getUsersValidate), getUsers);

router
  .route('/:userId')
  .get(validate(getUserValidate), getUser)
  .patch(auth('admin'), validate(updateUserValidate), updateUser)
  .delete(auth('admin'), validate(deleteUserValidate), deleteUser);

export default router;
