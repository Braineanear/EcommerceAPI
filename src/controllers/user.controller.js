// Config
import logger from '../config/logger';

// Utils
import pick from '../utils/pick';
import AppError from '../utils/appError';
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
export const createUser = async (req, res, next) => {
  // 1) Create User Document
  const [err, user] = await catchAsync(userService.createUser(req.body));

  // 2) Handling createUser Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) If Everything is OK, Send User Data
  return res.status(201).json({
    status: 'success',
    message: 'Account Created Successfully',
    user
  });
};

/**
 * Get All Users
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const getUsers = async (req, res, next) => {
  let { page, sortBy, limit } = req.query;
  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sortBy) sortBy = 'asc';
  if (!limit) limit = 10;

  let err, data;

  // 2) Generating Redis key
  const key = redisService.generateCacheKey('users', `page:${page}`);

  // 3) Getting Cached Data From Redis
  [err, data] = await catchAsync(redisService.get(key));

  // 4) Handling get Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 5) Check If Cached Data Already Exist
  if (!data) {
    logger.error('No Caching Data');
  }

  data = JSON.parse(data);

  // 7) If Cached Data Exit Return it
  if (data) {
    return res.status(200).json({
      data
    });
  }

  // 8) Setting Filter & Options
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // 9) Get All Users
  [err, data] = await catchAsync(userService.queryUsers(filter, options));

  // 10) Handling queryUsers Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 11) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(data), 'EX', 60);

  // 12) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Found Users',
    data
  });
};

/**
 * Get User Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const getUser = async (req, res, next) => {
  const { userId } = req.params;
  let err, user;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('user', userId);

  // 2) Getting Cached Data From Redis
  [err, user] = await catchAsync(redisService.get(key));

  // 3) Handling get Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 4) Check If Cached Data Already Exist
  if (!user) {
    logger.error('No Caching Data');
  }

  user = JSON.parse(user);

  // 5) If Cached Data Exit Return it
  if (user) {
    return res.status(200).json({
      user
    });
  }

  // 6) Find User Document By It's ID
  [err, user] = await catchAsync(User.findById(req.params.userId));

  // 7) Handling findById Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 8) Check if User Already Exist
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // 9) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(user), 'EX', 60);

  // 10) If Everything is OK, Send User's Data
  return res.status(200).json({
    status: 'success',
    user
  });
};

/**
 * Update User's Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const updateUser = async (req, res, next) => {
  // 1) Find User Document and Update it
  const [err, user] = await catchAsync(
    userService.updateUserById(req.params.userId, req.body)
  );

  // 2) Handling updateUserById Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) If Everything is OK, Send User's Data
  return res.status(200).json({
    status: 'success',
    message: 'User Account Updated Successfully',
    user
  });
};

/**
 * Delete User's Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const deleteUser = async (req, res, next) => {
  // 1) Find User Document and Delete it
  const [err] = await catchAsync(userService.deleteUserById(req.params.userId));

  // 2) Handling deleteUserById Method Errors
  if (err) {
    return next(new AppError(err, 500));
  }

  // 3) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'User Account Deleted Successfully'
  });
};
