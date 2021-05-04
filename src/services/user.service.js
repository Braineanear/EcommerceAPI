// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

// Models
import { User } from '../models/index';

/**
 * Create new user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
export const createUser = async (userBody) => {
  let err, isEmailTaken, user;

  // 1) Check if The Email Already Taken
  [err, isEmailTaken] = await catchAsync(User.isEmailTaken(userBody.email));

  // 2) Handling isEmailTaken Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 3) If The Email Taken
  if (isEmailTaken) {
    throw new AppError('Email already taken', 400);
  }

  // 4) Create New User
  [err, user] = await catchAsync(User.create(userBody));

  // 5) Handling Create Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter, options) => {
  // 1) Get All Users
  const [err, users] = await catchAsync(User.paginate(filter, options));

  // 2) Check if No Users
  if (!users) {
    throw new AppError('No Users Found', 404);
  }

  // 3) Handling Paginate Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 4) If Everything is OK, Send Users Data
  return users;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
export const updateUserById = async (userId, updateBody) => {
  let err, isEmailTaken, user;

  // 1) Check if Email Already Taken
  [err, isEmailTaken] = await catchAsync(
    User.isEmailTaken(updateBody.email, userId)
  );

  // 2) Handling isEmailTaken Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 3) If Email Taken
  if (updateBody.email && isEmailTaken) {
    throw new AppError('Email already taken', 400);
  }

  // 4) Find User Document and Update it
  [err, user] = await catchAsync(
    User.findByIdAndUpdate(userId, updateBody, {
      new: true,
      runValidators: true
    })
  );

  // 5) Check if User Already Exist
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // 6) Handling findByIdAndUpdate Method Errors
  if (err) {
    throw new AppError(err, 500);
  }

  // 7) If Everything is OK, Send User Data
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
export const deleteUserById = async (userId) => {
  // 1) Find User Document and Delete it
  const [err, user] = await catchAsync(User.findByIdAndDelete(userId));

  // 2) Check if User Already Exist
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // 3) Handling findByIdAndDelete Method Errors
  if (err) {
    throw new AppError(err, 500);
  }
};
