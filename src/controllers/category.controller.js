// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import dataUri from '../utils/datauri';
import pick from '../utils/pick';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Configs
import logger from '../config/logger';

// Services
import { categoryService, redisService } from '../services/index';

/**
 * Get All Categories Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON<Categories>}
 */
export const getAllCategories = catchAsync(async (req, res, next) => {
  let { page, sortBy, limit } = req.query;
  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sortBy) sortBy = 'sortField:asc';
  if (!limit) limit = 10;

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'categories',
    `page:${page}-sortBy:${sortBy}-limit:${limit}`
  );

  // 3) Getting Cached Data From Redis
  let categories = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!categories) {
    logger.error('No Caching Data');
  }

  categories = JSON.parse(categories);

  // 5) If Cached Data Exit Return it
  if (categories) {
    return res.status(200).json({
      status: 'success',
      message: 'Categories Found',
      categories
    });
  }

  // 6) Setting Filter & Options
  const filter = pick(req.query, ['name', 'description', 'status', 'image']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const select = ['name', 'description', 'image', 'status'];

  // 7) Get All Users
  categories = await categoryService.queryCategories(filter, options, select);

  // 8) Check If Categories Already Exist
  if (!categories) {
    return next(new AppError('No Categories Found', 404));
  }

  // 9) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(categories), 'EX', 60);

  // 10) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Categories Found',
    categories
  });
});

/**
 * Get Category's Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON<Category>}
 */
export const getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('category', `id:${id}`);

  // 2) Getting Cached Data From Redis
  let category = await redisService.get(key);

  // 3) Check If Cached Data Already Exist
  if (!category) {
    logger.error('No Caching Data');
  }

  category = JSON.parse(category);

  // 4) If Cached Data Exit Return it
  if (category) {
    return res.status(200).json({
      status: 'success',
      message: 'Category Found',
      category
    });
  }

  // 5) Get All Users
  category = await categoryService.getCategoryById(id);

  // 6) Check If Category Already Exist
  if (!category) {
    return next(new AppError(`No Category Found With This Name: ${id}`, 404));
  }

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(category), 'EX', 60);

  // 8) If Everything is OK, Send Category
  return res.status(200).json({
    status: 'success',
    message: 'Found Category Successfully',
    category
  });
});

/**
 * Create New Category
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON<Category>}
 */
export const addCategory = catchAsync(async (req, res, next) => {
  const { name, description, status } = req.body;
  let image = req.file;

  // 1) Check If The User Entered All Fields
  if (!name || !description || !status || !image) {
    return next(new AppError('All fields are required', 400));
  }

  // 2) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = 'Category';

  // 4) Generate a Buffer instance from a Data URI string
  image = dataUri(image);

  // 5) Upload Image to Cloudinary
  image = await uploadFile(image.content, folderName, 600);

  const categoryBody = {
    name,
    description,
    status,
    image: image.secure_url,
    imageId: image.public_id
  };

  // 6) Insert Data into The Database
  const result = await categoryService.createCategory(categoryBody);

  // 7) If Everything is OK, Send Result
  return res.status(201).json({
    status: 'success',
    message: 'Category Created Successfully',
    result
  });
});

/**
 * Update Category's Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON<Category>}
 */
export const updateCategory = catchAsync(async (req, res, next) => {
  const { name, description, status } = req.body;
  const { id } = req.params;
  let image = req.file;

  // 1) Check If The User Entered All Fields
  if (!name || !description || !status) {
    return next(new AppError('All fields are required', 400));
  }

  // 2) Get Category Data
  const category = await categoryService.getCategoryById(id);

  // 3) Check If Category Already Exist
  if (!category) {
    return next(new AppError(`No Category Found With This ID: ${id}`, 404));
  }

  // 4) Destroy Category Current Image From Cloudinary
  destroyFile(category.imageId);

  // 5) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = 'Category';
  image = dataUri(image);
  image = await uploadFile(image.content, folderName, 600);

  // 6) Create Category Body Object
  const categoryBody = {
    name,
    description,
    status,
    image: image.secure_url,
    imageId: image.public_id
  };

  // 7) Update Category
  const result = await categoryService.updateCategoryById(id, categoryBody);

  // 8) If Everything is OK, Send Category Data
  return res.status(200).json({
    status: 'success',
    message: 'Category Updated Successfully',
    result
  });
});

/**
 * Delete Category's Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1) Find Category By ID & Delete It
  await categoryService.deleteCategoryById(id);

  // 2) If Everything is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Category Deleted Successfully'
  });
});
