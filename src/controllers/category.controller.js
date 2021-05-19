// Utils
import catchAsync from '../utils/catchAsync';

// Configs
import logger from '../config/logger';

// Services
import { categoryService, redisService } from '../services/index';

/**
 * Get All Categories Data
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.query.sort
 * @property  {String} req.query.select
 * @property  {Number} req.query.page
 * @property  {Number} req.query.limit
 * @returns {JSON}
 */
export const getAllCategories = catchAsync(async (req, res) => {
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
  let cached = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!cached) {
    logger.error('No Caching Data');
  }

  cached = JSON.parse(cached);

  // 5) If Cached Data Exit Return it
  if (cached) {
    return res.status(200).json({
      type: 'Success',
      message: 'Categories Found Successfully',
      categories: cached
    });
  }

  // 6) Get All Users
  const { type, message, statusCode, categories } =
    await categoryService.queryCategories(req);

  // 7) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 8) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(categories), 'EX', 60);

  // 9) If Everything is OK, Send Data
  return res.status(statusCode).json({
    type,
    message,
    categories
  });
});

/**
 * Get Category Using It's ID
 * @param     {Object} req
 * @param     {Object} res
 * @property  {ObjectID} req.params.id
 * @returns   {JSON}
 */
export const getCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('category', `id:${id}`);

  // 2) Getting Cached Data From Redis
  let cached = await redisService.get(key);

  // 3) Check If Cached Data Already Exist
  if (!cached) {
    logger.error('No Caching Data');
  }

  cached = JSON.parse(cached);

  // 4) If Cached Data Exit Return it
  if (cached) {
    return res.status(200).json({
      type: 'Success',
      message: 'Category Found Successfully',
      category: cached
    });
  }

  // 5) Get All Users
  const { type, message, statusCode, category } =
    await categoryService.queryCategory(id);

  // 6) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(category), 'EX', 60);

  // 8) If Everything is OK, Send Category
  return res.status(statusCode).json({
    type,
    message,
    category
  });
});

/**
 * Create New Category
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.body.name
 * @property  {String} req.body.description
 * @property  {Object} req.file
 * @returns   {JSON}
 */
export const addCategory = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const { file } = req;

  // 1) Insert Data into The Database
  const { type, message, statusCode, category } =
    await categoryService.createCategory({ name, description }, file);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Result
  return res.status(statusCode).json({
    type,
    message,
    category
  });
});

/**
 * Update Category Details
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.id
 * @property  {Object}    req.body
 * @returns   {JSON}
 */
export const updateCategoryDetails = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Update Category
  const { type, message, statusCode, category } =
    await categoryService.updateCategoryDetails(id, req.body);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Category Data
  return res.status(statusCode).json({
    type,
    message,
    category
  });
});

/**
 * Update Category Image
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.id
 * @property  {Object}    req.file
 * @returns   {JSON}
 */
export const updateCategoryImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  let image = req.file;

  // 1) Update Category
  const { type, message, statusCode, category } =
    await categoryService.updateCategoryImage(id, image);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Category Data
  return res.status(statusCode).json({
    type,
    message,
    category
  });
});

/**
 * Delete Category
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.id
 * @returns   {JSON}
 */
export const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Find Category By ID & Delete It
  const { type, message, statusCode } =
    await categoryService.deleteCategoryById(id);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Message
  return res.status(statusCode).json({
    type,
    message
  });
});
