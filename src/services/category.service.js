// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Models
import { Category } from '../models/index';

/**
 * Create New Category
 * @param {Object} body
 * @returns {Promise<Category>}
 */
export const createCategory = catchAsync(async (req) => {
  const { name, description, status } = req.body;
  let image = req.file;

  // 1) Check If The User Entered All Fields
  if (!name || !description || !status || !image) {
    throw new AppError('All fields are required', 400);
  }

  // 2) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Category/${name.trim().split(' ').join('')}`;

  // 3) Generate a Buffer instance from a Data URI string
  image = dataUri(image);

  // 4) Upload Image to Cloudinary
  image = await uploadFile(image.content, folderName, 600);

  // 5) Create Body
  const body = {
    name,
    description,
    status,
    image: image.secure_url,
    imageId: image.public_id
  };

  // 7) Create New Category & Save Data at Database
  const category = await Category.create(body);

  // 8) If Everything is OK, Send Data
  return category;
});

/**
 * Query users
 * @param {Object} request
 * @returns {Promise<Categories>}
 */
export const queryCategories = catchAsync(async (req) => {
  // 1) Get All Categories
  const categories = await APIFeatures(req, Category);

  // 2) Check If Category Already Exist
  if (categories.length === 0) {
    throw new AppError('No Categories Found', 404);
  }
  // 3) If Everything is OK, Send Categories
  return categories;
});

/**
 * Query Category Using It's Name
 * @param {String} name
 * @returns {Promise<Category>}
 */
export const getCategoryByName = catchAsync(async (name) => {
  // 1) Get Category From Database
  const category = await Category.findOne({ name });

  // 2) Check If Category Already Exist
  if (!category) {
    throw new AppError(`No Category Found With This Name: ${name}`, 404);
  }

  // 3) If Everything is OK, Send Category
  return category;
});

/**
 * Query Category Using It's Id
 * @param {String} id
 * @returns {Promise<Category>}
 */
export const getCategoryById = catchAsync(async (id) => {
  // 1) Get Category From Database
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    throw new AppError(`No Category Found With This ID: ${id}`, 404);
  }

  // 3) If Everything is OK, Send Category
  return category;
});

/**
 * Update Category Details
 * @param {String} id
 * @param {Object} body
 * @returns {Promise<Category>}
 */
export const updateCategoryDetails = catchAsync(async (id, body) => {
  // 1) Find Category Document
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    throw new AppError(`No Category Found With This ID: ${id}`, 404);
  }

  // 3) Update Category
  const result = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 3) If Everything is OK, Send Result
  return result;
});

/**
 * Update Category Image
 * @param {Object} image
 * @returns {Promise<Category>}
 */
export const updateCategoryImage = catchAsync(async (id, image) => {
  // 1) Get Category Data
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    throw new AppError(`No Category Found With This ID: ${id}`, 404);
  }

  // 3) Destroy Category Current Image From Cloudinary
  destroyFile(category.imageId);

  // 4) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Category/${category.name.trim().split(' ').join('')}`;
  image = dataUri(image);
  image = await uploadFile(image.content, folderName, 600);

  // 5) Create Category Body Object
  const body = {
    image: image.secure_url,
    imageId: image.public_id
  };

  // 6) Update Category
  const result = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 7) If Everything is OK, Send Result
  return result;
});
/**
 * Delete Category
 * @param {String} id
 */
export const deleteCategoryById = catchAsync(async (id) => {
  // 1) Find Category Document
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    throw new AppError(`No Category Found With This ID: ${id}`, 404);
  }

  // 3) Delete Category
  await Category.findByIdAndDelete(id);
});
