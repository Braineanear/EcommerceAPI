// Configs
import tokenTypes from '../config/tokens';

// Utils
import catchAsync from '../utils/catchAsync';
import dataUri from '../utils/datauri';
import { uploadFile } from '../utils/cloudinary';

// Services
import {
  sendAfterResetPasswordMessage,
  sendVerificationEmail
} from './email.service';
import {
  verifyToken,
  generateAuthTokens,
  generateVerifyEmailToken
} from './token.service';

// Models
import { User, Token } from '../models/index';

/**
 * Sign Up Service
 * @param { Object } body
 * @param { Object } profileImage
 */
export const signup = catchAsync(async (body, profileImage) => {
  // 1) Check if profile image not provided
  if (profileImage === undefined) {
    return {
      type: 'Error',
      message: 'profileImageRequired',
      statusCode: 400
    };
  }

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
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  if (password.length < 8) {
    return {
      type: 'Error',
      message: 'passwordLength',
      statusCode: 400
    };
  }

  if (!['user', 'seller'].includes(role)) {
    return {
      type: 'Error',
      message: 'roleRestriction',
      statusCode: 400
    };
  }

  // 2) Check if the email already taken
  const isEmailTaken = await User.isEmailTaken(email);

  if (isEmailTaken) {
    return {
      type: 'Error',
      message: 'emailTaken',
      statusCode: 409
    };
  }

  // 3) Specifiy folder name where the images are going to be uploaded in cloudinary
  const folderName = `Users/${name.trim().split(' ').join('')}`;

  // 4) Upload image to cloudinary
  const image = await uploadFile(
    dataUri(profileImage).content,
    folderName,
    600
  );

  // 5) Create new user account
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

  // 9) Generate tokens (access token & refresh token)
  const tokens = await generateAuthTokens(user);

  // 10) Generate Verification Email Token
  const verifyEmailToken = await generateVerifyEmailToken(user);

  // 11) Sending Verification Email
  await sendVerificationEmail(user.email, verifyEmailToken);

  // 12) Remove the password from the output
  user.password = undefined;

  // 13) If everything is OK, send user data
  return {
    type: 'Success',
    statusCode: 201,
    message: 'successfullSignUp',
    user,
    tokens
  };
});

/**
 * Sign In Service
 * @param { String } email
 * @param { String } password
 */
export const signin = catchAsync(async (email, password) => {
  // 1) Check if email and password exist
  if (!email || !password) {
    return {
      statusCode: 400,
      message: 'Please enter both email and password'
    };
  }

  // 2) Get user from database
  const user = await User.findOne({ email }).select('+password');

  // 3) Check if user does not exist
  if (!user) {
    return {
      statusCode: 401,
      message: 'Incorrect email or password.'
    };
  }

  // 4) Match Passwords
  const isMatch = await user.isPasswordMatch(password);

  // 5) Check if passwords match
  if (!isMatch) {
    return {
      statusCode: 401,
      message: 'Incorrect email or password.'
    };
  }

  // 4) If everything ok, send token to client
  const tokens = await generateAuthTokens(user);

  return {
    type: 'Success',
    statusCode: 200,
    message: 'User logged in successfully.',
    user,
    tokens
  };
});

/**
 * Logout Service
 * @param { String } refreshToken
 */
export const logout = catchAsync(async (refreshToken) => {
  // 1) Find Token Document and Delete it
  const refreshTokenDoc = await Token.findOneAndDelete({
    token: refreshToken,
    type: tokenTypes.REFRESH
  });

  // 2) Check if Token Already Exist
  if (!refreshTokenDoc) {
    return {
      type: 'Error',
      statusCode: 401,
      message: 'Please login again!'
    };
  }
  return {
    type: 'Success',
    statusCode: 200,
    message: 'Logged out successfully.'
  };
});

/**
 * Refresh Auth Tokens Service
 * @param { String } refreshToken
 */
export const refreshAuth = catchAsync(async (refreshToken) => {
  // 1) Verify Refresh Token
  const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);

  if (!refreshTokenDoc) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'No token found.'
    };
  }

  const user = await User.findById(refreshTokenDoc.user);

  // 3) Check if User Already Exist
  if (!user) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'No user found.'
    };
  }

  const tokens = await generateAuthTokens(user);

  // 4) If Everything is OK, Send Generate Tokens
  return {
    type: 'Success',
    statusCode: 200,
    message: 'Tokens generated successfully.',
    tokens
  };
});

/**
 * Reset Password Service
 * @param { String } resetPasswordToken
 * @param { String } newPassword
 */
export const resetPassword = catchAsync(
  async (token, password, passwordConfirmation) => {
    // 1) Verify Reset Password Token
    const resetPasswordTokenDoc = await verifyToken(
      token,
      tokenTypes.RESET_PASSWORD
    );

    // 2) Find User and Update it's Password
    const user = await User.findByIdAndUpdate(resetPasswordTokenDoc.user, {
      password,
      passwordConfirmation
    });

    // 3) Check if User Already Exist
    if (!user) {
      return {
        type: 'Error',
        statusCode: 404,
        message: 'No user found.'
      };
    }

    // 4) Sending After Reset Password Mail
    await sendAfterResetPasswordMessage(user.email);

    // 5) Deleteing User Reset Token
    await Token.deleteMany({
      user: user.id,
      type: tokenTypes.RESET_PASSWORD
    });

    return {
      type: 'Success',
      statusCode: 200,
      message: 'Password changed successfully.'
    };
  }
);

/**
 * Verify Email Service
 * @param { String } verifyEmailToken
 */
export const verifyEmail = catchAsync(async (verifyEmailToken) => {
  // 1) Verify Email Token
  const verifyEmailTokenDoc = await verifyToken(
    verifyEmailToken,
    tokenTypes.VERIFY_EMAIL
  );

  // 2) Find User
  const user = await User.findById(verifyEmailTokenDoc.user);

  // 3) Check if User Already Exist
  if (!user) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'No user found.'
    };
  }

  // 4) Deleting User Verify Email Token
  await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });

  // 5) Update User isEmailVerified Filed (Set True)
  await User.findByIdAndUpdate(user.id, { isEmailVerified: true });

  return {
    type: 'Sucess',
    statusCode: 200,
    message: 'Email verified successfully.'
  };
});
