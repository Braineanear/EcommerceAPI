// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { categoryService } from '../services/index';

/**
 * Get All Categories Data Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.query.sort
 * @property  { String } req.query.select
 * @property  { Number } req.query.page
 * @property  { Number } req.query.limit
 * @returns   { JSON }
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
 * Get Category Using It's ID Category
 * @param     { Object } req
 * @param     { Object } res
 * @property  { ObjectID } req.params.id
 * @returns   { JSON }
 */
export const getCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Get category using it's ID
  const { type, message, statusCode, category } =
    await categoryService.queryCategory(id);

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
 * Create New Category Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.body.name
 * @property  { String } req.body.description
 * @property  { Object } req.file
 * @returns   { JSON }
 */
export const addCategory = catchAsync(async (req, res) => {
  const { name, description } = req.body;
  const { file } = req;

  // 1) Create new category
  const { type, message, statusCode, category } =
    await categoryService.createCategory({ name, description }, file);

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
 * Update Category Details Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @property  { Object }    req.body
 * @returns   { JSON }
 */
export const updateCategoryDetails = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Update category details using it's ID
  const { type, message, statusCode, category } =
    await categoryService.updateCategoryDetails(id, req.body);

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
 * Update Category Image Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @property  { Object }    req.file
 * @returns   { JSON }
 */
export const updateCategoryImage = catchAsync(async (req, res) => {
  const { id } = req.params;
  let image = req.file;

  // 1) Update category image using it's ID
  const { type, message, statusCode, category } =
    await categoryService.updateCategoryImage(id, image);

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
 * Delete Category Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @returns   { JSON }
 */
export const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Find category using it's ID & delete it
  const { type, message, statusCode } =
    await categoryService.deleteCategoryById(id);

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
