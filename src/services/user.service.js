// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Models
import { User } from '../models/index';

/**
 * Create New User
 * @param     {Object} body
 * @param     {Object} profileImage
 * @returns   {Object<type|message|statusCode|user>}
 */
export const createUser = catchAsync(async (body, profileImage) => {
  const { name, username, email, password, passwordConfirmation, role } = body;
  let { companyName, address, phone } = body;

  if (!companyName) companyName = '';

  if (!address) address = '';

  if (!phone) phone = '';

  if (
    !name ||
    !username ||
    !email ||
    !password ||
    !passwordConfirmation ||
    !role ||
    profileImage.length === 0
  ) {
    return {
      type: 'Error',
      message: 'All Fields Are Required',
      statusCode: 400
    };
  }

  // 1) Check if The Email Already Taken
  const isEmailTaken = await User.isEmailTaken(email);

  // 2) If The Email Taken
  if (isEmailTaken) {
    return {
      type: 'Error',
      message: `Email Is Already Taken: ${email}`,
      statusCode: 409
    };
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
  return {
    type: 'Success',
    message: 'Account Created Successfully',
    statusCode: 201,
    user
  };
});

/**
 * Query Users
 * @param     {Object} req - Request
 * @returns   {Object<type|message|statusCode|users>}
 */
export const queryUsers = catchAsync(async (req) => {
  // 1) Get All Users
  const users = await APIFeatures(req, User);

  // 2) Check If Users Doesn't Exist'
  if (users.length === 0) {
    return {
      type: 'Error',
      message: 'No Users Found',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Users Data
  return {
    type: 'Success',
    message: 'Users Found Successfully',
    statusCode: 200,
    users
  };
});

/**
 * Query User
 * @param     {Object} id - User ID
 * @return    {Object<type|message|statusCode|user>}
 */
export const queryUser = catchAsync(async (id) => {
  // 1) Get User Using It's ID
  const user = await User.findById(id);

  // 2) Check If User Doesn't Exist
  if (!user) {
    return {
      type: 'Error',
      message: `No User Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send User Data;
  return {
    type: 'Success',
    message: 'Found User Successfully',
    statusCode: 200,
    user
  };
});

/**
 * Update User Details Using It's ID
 * @param     {ObjectId}  id - User ID
 * @param     {Object}    body - Updated Body
 * @returns   {Object<type|message|statusCode|user>}
 */
export const updateUserDetails = catchAsync(async (id, body) => {
  let user = await User.findById(id);

  // 1) Check If User Doesn't Exist
  if (!user) {
    return {
      type: 'Error',
      message: `No User Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  if (body.password || body.passwordConfirmation) {
    return {
      type: 'Error',
      message:
        'Cannot Update Password From Here, Please Go To Update Passwor Route',
      statusCode: 400
    };
  }

  // 2) Check if Email Taken Or Not
  const isEmailTaken = await User.isEmailTaken(body.email, id);

  if (body.email && isEmailTaken) {
    return {
      type: 'Error',
      message: `This Email Is Already Taken: ${body.email}`,
      statusCode: 409
    };
  }

  // 3) Find User Document and Update it
  user = await User.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 4) If Everything is OK, Send User Data
  return {
    type: 'Success',
    message: 'User Details Updated Successfully',
    statusCode: 200,
    user
  };
});

/**
 * Update User Profile Image Using It's ID
 * @param     {ObjectId}  id - User ID
 * @param     {Object}    profileImage - Updated Profile Image
 * @returns   {Object<type|message|statusCode|user>}
 */
export const updateUserProfileImage = catchAsync(async (id, profileImage) => {
  let user = await User.findById(id);

  // 1) Check If User Doesn't Exist
  if (!user) {
    return {
      type: 'Error',
      message: `No User Found With This ID: ${id}`,
      statusCode: 404
    };
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
  return {
    type: 'Success',
    message: 'User Image Updated Successfully',
    statusCode: 200
  };
});

/**
 * Delete Using It's ID
 * @param     {ObjectId} id - User ID,
 * @returns   {Object<type|message|statusCode>}
 */
export const deleteUser = catchAsync(async (id) => {
  // 1) Find User Document and Delete it
  const user = await User.findByIdAndDelete(id);

  // 2) Check if User Already Exist
  if (!user) {
    return {
      type: 'Error',
      message: `No User Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Delete User Profile Image
  destroyFile(user.profileImageId);

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'Account Deleted Successfully',
    statusCode: 200
  };
});
