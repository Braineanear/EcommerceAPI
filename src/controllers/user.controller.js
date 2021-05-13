// Config
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { userService, redisService } from '../services/index';

// Models
import { User } from '../models/index';

/**
 * Create New User
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const createUser = catchAsync(async (req, res, next) => {
  // 1) Create User Document
  const user = await userService.createUser(req.body);

  // 2) If Everything is OK, Send User Data
  return res.status(201).json({
    status: 'success',
    message: 'Account Created Successfully',
    user
  });
});

/**
 * Get All Users
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const getUsers = catchAsync(async (req, res, next) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'users',
    `page:${page}-sortBy:${sort}-limit:${limit}-select:${select}`
  );

  // 3) Getting Cached Data From Redis
  let data = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!data) {
    logger.error('No Caching Data');
  }

  data = JSON.parse(data);

  // 5) If Cached Data Exit Return it
  if (data) {
    return res.status(200).json({
      data
    });
  }

  // 6) Get All Users
  data = await userService.queryUsers(req);

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(data), 'EX', 60);

  // 8) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Found Users',
    data
  });
});

/**
 * Get User Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  // 1) Generating Redis key
  const key = redisService.generateCacheKey('user', userId);

  // 2) Getting Cached Data From Redis
  let user = await redisService.get(key);

  // 3) Check If Cached Data Already Exist
  if (!user) {
    logger.error('No Caching Data');
  }

  user = JSON.parse(user);

  // 4) If Cached Data Exit Return it
  if (user) {
    return res.status(200).json({
      user
    });
  }

  // 5) Find User Document By It's ID
  user = await User.findById(req.params.userId);

  // 6) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(user), 'EX', 60);

  // 7) If Everything is OK, Send User's Data
  return res.status(200).json({
    status: 'success',
    user
  });
});

/**
 * Update User's Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const updateUser = catchAsync(async (req, res, next) => {
  // 1) Find User Document and Update it
  const user = await userService.updateUserById(req.params.userId, req.body);

  // 2) If Everything is OK, Send User's Data
  return res.status(200).json({
    status: 'success',
    message: 'User Account Updated Successfully',
    user
  });
});

/**
 * Delete User's Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const deleteUser = catchAsync(async (req, res, next) => {
  // 1) Find User Document and Delete it
  await userService.deleteUserById(req.params.userId);

  // 2) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'User Account Deleted Successfully'
  });
});
