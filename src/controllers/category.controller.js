// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { categoryService } from '../services/index';

/**
 * @desc      Get All Categories Data Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.query.sort - Sort returned data
 * @property  { String } req.query.select - Select specific fields from data
 * @property  { Number } req.query.page - Page number
 * @property  { Number } req.query.limit - number of items in page
 * @returns   { JSON } - A JSON object representing the type, message and categories
 */
export const getAllCategories = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting default params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Get all categories
  const { type, message, statusCode, categories } =
    await categoryService.queryCategories(req);

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
    categories
  });
});

/**
 * @desc      Get Category Using It's ID Category
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - Category ID
 * @returns   { JSON } - A JSON object representing the type, message, and the category
 */
export const getCategory = catchAsync(async (req, res) => {
  // 1) Get category using it's ID
  const { type, message, statusCode, category } =
    await categoryService.queryCategory(req.params.id);

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
    category
  });
});

/**
 * @desc      Create New Category Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.name - Category name
 * @property  { String } req.body.description - Category description
 * @property  { Object } req.file - Category image
 * @returns   { JSON } - A JSON object representing the type, message and the category
 */
export const addCategory = catchAsync(async (req, res) => {
  // 1) Create new category
  const { type, message, statusCode, category } =
    await categoryService.createCategory(
      { name: req.body.name, description: req.body.description },
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
    category
  });
});

/**
 * @desc      Update Category Details Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - Category ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message, and the category
 */
export const updateCategoryDetails = catchAsync(async (req, res) => {
  // 1) Update category details using it's ID
  const { type, message, statusCode, category } =
    await categoryService.updateCategoryDetails(req.params.id, req.body);

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
    category
  });
});

/**
 * @desc      Update Category Image Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - Category ID
 * @property  { Object } req.file - Category image
 * @returns   { JSON } - A JSON object representing the type, message, and the category
 */
export const updateCategoryImage = catchAsync(async (req, res) => {
  // 1) Update category image using it's ID
  const { type, message, statusCode, category } =
    await categoryService.updateCategoryImage(req.params.id, req.file);

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
    category
  });
});

/**
 * @desc      Delete Category Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - Category ID
 * @returns   { JSON } - A JSON object representing the type and message
 */
export const deleteCategory = catchAsync(async (req, res) => {
  // 1) Find category using it's ID & delete it
  const { type, message, statusCode } =
    await categoryService.deleteCategoryById(req.params.id);

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
