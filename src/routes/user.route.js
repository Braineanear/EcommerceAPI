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
  .post(auth('manageUsers'), validate(createUserValidate), createUser)
  .get(auth('getUsers'), validate(getUsersValidate), getUsers);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(getUserValidate), getUser)
  .patch(auth('manageUsers'), validate(updateUserValidate), updateUser)
  .delete(auth('manageUsers'), validate(deleteUserValidate), deleteUser);

export default router;
