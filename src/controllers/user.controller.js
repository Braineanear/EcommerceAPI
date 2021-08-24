// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { userService } from '../services/index';

/**
 * Create New User Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { Object } req.body
 * @property  { Object } req.file
 * @returns   { JSON }
 */
export const createUser = catchAsync(async (req, res) => {
  // 1) Create new user
  const { type, message, statusCode, user } = await userService.createUser(
    req.body,
    req.file
  );

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    user
  });
});

/**
 * Get All Users Controller
 * @param     { Object }  req
 * @param     { Object }  res
 * @property  { String }  req.query.sort
 * @property  { String }  req.query.select
 * @property  { Number }  req.query.page
 * @property  { Number }  req.query.limit
 * @returns   { JSON }
 */
export const getUsers = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting default params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Get all users
  const { type, message, statusCode, users } = await userService.queryUsers(
    req
  );

  // 3) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 4) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    users
  });
});

/**
 * Get User Data Using It's ID Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @returns   { JSON }
 */
export const getUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Find User Document By It's ID Controller
  const { type, message, statusCode, user } = await userService.queryUser(id);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    user
  });
});

/**
 * Update User Details Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { Object }    req.body
 * @property  { Object }  req.user
 * @returns   { JSON }
 */
export const updateUserDetails = catchAsync(async (req, res) => {
  // 1) Find user document and update it's details
  const { type, message, statusCode, user } =
    await userService.updateUserDetails(req.user, req.body);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    user
  });
});

/**
 * Update User Profile Image Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { Object }    req.file
 * @property  { Object }  req.user
 * @returns   { JSON }
 */
export const updateUserProfileImage = catchAsync(async (req, res) => {
  // 1) Find user document and update it's profile image
  const { type, message, statusCode, user } =
    await userService.updateUserProfileImage(req.user, req.file);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message,
    user
  });
});

/**
 * Delete User's Data Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @returns   { JSON }
 */
export const deleteUser = catchAsync(async (req, res) => {
  // 1) Find user document and delete it
  const { type, message, statusCode } = await userService.deleteUserById(
    req.params.id
  );

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message
  });
});
