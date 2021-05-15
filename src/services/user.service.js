// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Models
import { User } from '../models/index';

/**
 * Create New User
 * @param     {Object} body
 * @param     {Object} profileImage
 * @returns   {Promise<User>}
 */
export const createUser = catchAsync(async (body, profileImage) => {
  const { name, username, email, password, passwordConfirmation, role } = body;
  let address, companyName, phone;
  if (body.companyName === '') {
    companyName = '';
  } else {
    companyName = body.companyName;
  }

  if (body.address === '') {
    address = '';
  } else {
    address = body.address;
  }

  if (body.phone === '') {
    phone = '';
  } else {
    phone = body.phone;
  }

  if (
    !name ||
    !username ||
    !email ||
    !password ||
    !passwordConfirmation ||
    !role ||
    profileImage.length === 0
  ) {
    throw new AppError('All fields are required', 400);
  }

  // 1) Check if The Email Already Taken
  const isEmailTaken = await User.isEmailTaken(email);

  // 2) If The Email Taken
  if (isEmailTaken) {
    throw new AppError('Email already taken', 400);
  }

  // 3) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Users/${name.trim().split(' ').join('')}`;

  // 4) Upload Image to Cloudinary
  const image = await uploadFile(
    dataUri(profileImage).content,
    folderName,
    600
  );

  // 3) Create New User
  const user = await User.create({
    name,
    username,
    email,
    password,
    passwordConfirmation,
    role,
    companyName,
    address,
    phone,
    profileImage: image.secure_url,
    profileImageId: image.public_id
  });

  // 4) If Everything is OK, Send User Data
  return user;
});

/**
 * Query Users
 * @param     {Object} req - Request
 * @returns   {Promise<Users>}
 */
export const queryUsers = catchAsync(async (req) => {
  // 1) Get All Users
  const users = await APIFeatures(req, User);

  // 2) Check if No Users
  if (users.length === 0) {
    throw new AppError('Users Not Found', 404);
  }

  // 3) If Everything is OK, Send Users Data
  return users;
});

/**
 * Query User
 * @param     {Object} id - User ID
 * @return    {Promise<User>}
 */
export const queryUser = catchAsync(async (id) => {
  // 1) Get User Using It's ID
  const user = await User.findById(id);

  // 2) Check If User Doesn't Exist
  if (!user) {
    throw new AppError(`No User Found With This ID: ${id}`, 404);
  }

  // 3) If Everything is OK, Send User Data;
  return user;
});

/**
 * Update User Details Using It's ID
 * @param     {ObjectId}  id - User ID
 * @param     {Object}    body - Updated Body
 * @returns   {Promise<User>}
 */
export const updateUserDetails = catchAsync(async (id, body) => {
  let user = await User.findById(id);

  // 1) Check If User Doesn't Exist
  if (!user) {
    throw new AppError(`No User Found With This ID: ${id}`, 404);
  }

  // 2) Check if Email Taken Or Not
  const isEmailTaken = await User.isEmailTaken(body.email, id);

  if (body.email && isEmailTaken) {
    throw new AppError('Email already taken', 400);
  }

  // 3) Find User Document and Update it
  user = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 4) If Everything is OK, Send User Data
  return user;
});

/**
 * Update User Profile Image Using It's ID
 * @param     {ObjectId}  id - User ID
 * @param     {Object}    profileImage - Updated Profile Image
 * @returns   {Promise<User>}
 */
export const updateUserProfileImage = catchAsync(async (id, profileImage) => {
  let user = await User.findById(id);

  // 1) Check If User Doesn't Exist
  if (!user) {
    throw new AppError(`No User Found With This ID: ${id}`, 404);
  }

  // 2) Specifiy Folder Name Where The Profile Image Is Going To Be Uploaded In Cloudinary
  const folderName = `Users/${user.name.trim().split(' ').join('')}`;

  // 3) Destroy Image From Cloudinary
  destroyFile(user.profileImageId);

  // 4) Upload Image to Cloudinary
  const image = await uploadFile(
    dataUri(profileImage).content,
    folderName,
    600
  );

  // 5) Find User Document and Update it
  user = await User.findByIdAndUpdate(
    id,
    {
      profileImage: image.secure_url,
      profileImageId: image.public_id
    },
    {
      new: true,
      runValidators: true
    }
  );

  // 6) If Everything is OK, Send User Data
  return user;
});

/**
 * Delete Using It's ID
 * @param     {ObjectId} id - User ID
 */
export const deleteUser = catchAsync(async (id) => {
  // 1) Find User Document and Delete it
  const user = await User.findByIdAndDelete(id);

  // 2) Check if User Already Exist
  if (!user) {
    throw new AppError(`Not User Found With This ID: ${id}`, 404);
  }

  // 3) Delete User Profile Image
  destroyFile(user.profileImageId);
});
