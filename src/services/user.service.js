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
export const createUser = catchAsync(async (userBody) => {
  // 1) Check if The Email Already Taken
  const isEmailTaken = await User.isEmailTaken(userBody.email);

  // 2) If The Email Taken
  if (isEmailTaken) {
    throw new AppError('Email already taken', 400);
  }

  // 3) Create New User
  const user = await User.create(userBody);

  // 4) If Everything is OK, Send User Data
  return user;
});

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = catchAsync(async (filter, options) => {
  // 1) Get All Users
  const users = await User.paginate(filter, options);

  // 2) Check if No Users
  if (!users) {
    throw new AppError('No Users Found', 404);
  }

  // 3) If Everything is OK, Send Users Data
  return users;
});

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
export const updateUserById = catchAsync(async (userId, updateBody) => {
  // 1) Check if Email Already Taken
  const isEmailTaken = await User.isEmailTaken(updateBody.email, userId);

  // 2) If Email Taken
  if (updateBody.email && isEmailTaken) {
    throw new AppError('Email already taken', 400);
  }

  // 3) Find User Document and Update it
  const user = await User.findByIdAndUpdate(userId, updateBody, {
    new: true,
    runValidators: true
  });

  // 4) Check if User Already Exist
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // 5) If Everything is OK, Send User Data
  return user;
});

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
export const deleteUserById = catchAsync(async (userId) => {
  // 1) Find User Document and Delete it
  const user = await User.findByIdAndDelete(userId);

  // 2) Check if User Already Exist
  if (!user) {
    throw new AppError('User not found', 404);
  }
});
