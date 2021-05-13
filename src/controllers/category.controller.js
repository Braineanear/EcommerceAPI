// Utils
import catchAsync from '../utils/catchAsync';

// Configs
import logger from '../config/logger';

// Services
import { categoryService, redisService } from '../services/index';

/**
 * Get All Categories Data
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const getAllCategories = catchAsync(async (req, res, next) => {
  let { page, sort, limit, select } = req.query;
  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'categories',
    `page:${page}-sort:${sort}-limit:${limit}-select:${select}`
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

  // 6) Get All Users
  categories = await categoryService.queryCategories(req);

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(categories), 'EX', 60);

  // 8) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Categories Found',
    categories
  });
});

/**
 * Get Category Using It's ID
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
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

  // 6) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(category), 'EX', 60);

  // 7) If Everything is OK, Send Category
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
 * @returns {JSON}
 */
export const addCategory = catchAsync(async (req, res, next) => {
  // 1) Insert Data into The Database
  const result = await categoryService.createCategory(req);

  // 2) If Everything is OK, Send Result
  return res.status(201).json({
    status: 'success',
    message: 'Category Created Successfully',
    result
  });
});

/**
 * Update Category Details
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const updateCategoryDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1) Update Category
  const result = await categoryService.updateCategoryDetails(id, req.body);

  // 2) If Everything is OK, Send Category Data
  return res.status(200).json({
    status: 'success',
    message: 'Category Updated Successfully',
    result
  });
});

/**
 * Update Category Image
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const updateCategoryImage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let image = req.file;

  // 1) Update Category
  const result = await categoryService.updateCategoryImage(id, image);

  // 2) If Everything is OK, Send Category Data
  return res.status(200).json({
    status: 'success',
    message: 'Category Updated Successfully',
    result
  });
});

/**
 * Delete Category
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
