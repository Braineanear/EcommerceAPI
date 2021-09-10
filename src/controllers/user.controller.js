// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { userService } from '../services/index';

/**
 * @desc      Create New User Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @property  { Object } req.file - User image
 * @returns   { JSON } - A JSON object representing the type, message and user data
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
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    user
  });
});

/**
 * @desc      Get All Users Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.query.sort - Sort returned data
 * @property  { String } req.query.select - Select specific fields
 * @property  { Number } req.query.page - Page number
 * @property  { Number } req.query.limit - Maximum number of users in page
 * @returns   { JSON } - A JSON object representing the type, message and users
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
      message: req.polyglot.t(message)
    });
  }

  // 4) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    users
  });
});

/**
 * @desc      Get User Data Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - User ID
 * @returns   { JSON } - A JSON object representing the type, message, and user data
 */
export const getUser = catchAsync(async (req, res) => {
  // 1) Find User Document By It's ID Controller
  const { type, message, statusCode, user } = await userService.queryUser(
    req.params.id
  );

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    user
  });
});

/**
 * @desc      Update User Details Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - Body object data
 * @property  { Object } req.user - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the type, message and user data
 */
export const updateUserDetails = catchAsync(async (req, res) => {
  // 1) Find user document and update it's details
  const { type, message, statusCode, user } =
    await userService.updateUserDetails(req.user, req.body);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    user
  });
});

/**
 * @desc      Update User Profile Image Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.file - User image
 * @property  { Object } req.user - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the type, message and user data
 */
export const updateUserProfileImage = catchAsync(async (req, res) => {
  // 1) Find user document and update it's profile image
  const { type, message, statusCode, user } =
    await userService.updateUserProfileImage(req.user, req.file);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    user
  });
});

/**
 * @desc      Delete User's Data Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - User ID
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const deleteUser = catchAsync(async (req, res) => {
  // 1) Find user document and delete it
  const { type, message, statusCode } = await userService.deleteUser(
    req.params.id
  );

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});

/**
 * @desc      Delete LoggedIn User's Data Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.user - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const deleteMyAccount = catchAsync(async (req, res) => {
  // 1) Find user document and delete it
  const { type, message, statusCode } = await userService.deleteMyAccount(
    req.user
  );

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});
