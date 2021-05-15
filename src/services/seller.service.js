// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Models
import { Seller } from '../models/index';

/**
 * Create new user
 * @param {Object} req - Request
 * @returns {Promise<User>}
 */
export const createSeller = catchAsync(async (body, file) => {
  const {
    name,
    username,
    email,
    password,
    passwordConfirmation,
    companyName,
    phone,
    address
  } = body;
  let profileImage = file;

  // 1) Check If All Fields Provided
  if (
    !name ||
    !username ||
    !email ||
    !password ||
    !passwordConfirmation ||
    !companyName ||
    !phone ||
    !address ||
    profileImage.length === 0
  ) {
    throw new AppError('All fields are required', 400);
  }

  // 2) Check if The Email Already Taken
  const isEmailTaken = await Seller.isEmailTaken(email);

  if (isEmailTaken) {
    throw new AppError('Email already taken', 400);
  }

  // 3) Cloudinary Folder Name
  const folderName = `Seller/${name.trim().split(' ').join('')}`;

  // 4) Upload Profile Image To Cloudinary
  profileImage = await uploadFile(
    dataUri(profileImage).content,
    folderName,
    600
  );

  // 4) Create New Seller
  const seller = await Seller.create({
    name,
    username,
    email,
    password,
    passwordConfirmation,
    companyName,
    phone,
    address,
    profileImage: profileImage.secure_url,
    profileImageId: profileImage.public_id
  });

  // 5) If Everything is OK, Send Seller Data
  return seller;
});

/**
 * Query Sellers
 * @param {Object} req - Request
 * @returns {Promise<Sellers>}
 */
export const querySellers = catchAsync(async (req) => {
  // 1) Get All Sellers
  const sellers = await APIFeatures(req, Seller);

  // 2) Check if Sellers Doesn't Exist
  if (sellers.length === 0) {
    throw new AppError('Sellers Not Found', 404);
  }

  // 3) If Everything is OK, Send Sellers Data
  return sellers;
});

/**
 * Update Seller Details Using It's ID
 * @param {ObjectId} id - Seller ID
 * @param {Object} body - Updated Body
 * @returns {Promise<Seller>}
 */
export const updateSellerDetails = catchAsync(async (id, body) => {
  const seller = await Seller.findById(id);

  // 1) Check if Seller Doesn't Exist
  if (!seller) {
    throw new AppError(`No Seller Found With This ID: ${id}`, 404);
  }

  // 2) Check if Email Already Taken
  const isEmailTaken = await Seller.isEmailTaken(body.email, id);

  // 3) If Email Taken
  if (body.email && isEmailTaken) {
    throw new AppError('Email Already Taken', 400);
  }

  // 4) Find Seller Document and Update it
  const updatedSeller = await Seller.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 5) If Everything is OK, Send Sekker Data
  return updatedSeller;
});

/**
 * Update Seller Profile Inage Using It's ID
 * @param {ObjectId} id - Seller ID
 * @param {Object} file - Profile Image
 * @returns {Promise<Seller>}
 */
export const updateSellerProfileImage = catchAsync(async (id, file) => {
  const seller = await Seller.findById(id);

  // 1) Check If Seller Doesn't Exist
  if (!seller) {
    throw new AppError(`No Seller Found With This ID: ${id}`, 404);
  }

  // 2) Check If Seller Uploaded an Image
  if (file.length === 0) {
    throw new AppError('Please Upload an Image', 404);
  }

  // 3) Cloudinary Folder Name
  const folderName = `Seller/${seller.name.trim().split(' ').join('')}`;

  // 4) Upload Profile Image To Cloudinary
  const profileImage = await uploadFile(dataUri(file).content, folderName, 600);

  // 5) Updated Profile Image
  const updatedSeller = await Seller.findByIdAndUpdate(id, {
    profileImage: profileImage.secure_url,
    profileImageId: profileImage.public_id
  });

  // 6) If Everything is OK, Send Seller Data
  return updatedSeller;
});

/**
 * Delete Seller Using It's ID
 * @param {ObjectId} id - Seller ID
 */
export const deleteSeller = catchAsync(async (id) => {
  // 1) Find Seller Document and Delete it
  const seller = await Seller.findByIdAndDelete(id);

  // 2) Check if Seller Doesn't Exist
  if (!seller) {
    throw new AppError('Seller Not Found', 404);
  }

  destroyFile(seller.profileImageId);
});
