// Config
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { productService } from '../services/index';

/**
 * Get All Products
 * @param     {Object} req
 * @param     {Object} res
 * @property  {String} req.query.sort
 * @property  {String}  req.query.select
 * @property  {Number}  req.query.page
 * @property  {Number}  req.query.limit
 * @returns   {JSON}
 */
export const getAllProducts = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 1) Get All Products
  const { type, message, statusCode, products } =
    await productService.queryProducts(req);

  // 2) Check If Thers is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Data
  return res.status(statusCode).json({
    type,
    message,
    products
  });
});

/**
 * Get Product Using It's ID
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {ObjectId}  req.params.id
 * @returns   {JSON}
 */
export const getProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Get Product Using It's ID
  const { type, message, statusCode, product } =
    await productService.queryProductById(id);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Product
  return res.status(statusCode).json({
    type,
    message,
    product
  });
});

/**
 * Create New Product
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {Object}    req.body
 * @property  {Object}    req.files
 * @property  {ObjectId}  req.user._id
 * @returns   {JSON}
 */
export const addProduct = catchAsync(async (req, res) => {
  const { body, files, user } = req;
  // 1) Create Product
  const { type, message, statusCode, product } =
    await productService.createProduct(body, files, user._id);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Category
  return res.status(statusCode).json({
    type,
    message,
    product
  });
});

/**
 * Update Product Details
 * @param     {Object}    req
 * @param     {Object}    res
 * @returns   {JSON}
 */
export const updateProductDetails = catchAsync(async (req, res) => {
  // 1) Update Product Using It's ID
  const { type, message, statusCode, product } =
    await productService.updateProductDetails(req.params.id, req.body);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Product
  return res.status(statusCode).json({
    type,
    message,
    product
  });
});

/**
 * Update Product Main Image
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {Object}    req.files
 * @property  {ObjectId}  req.params.id
 * @returns   {JSON}
 */
export const updateProductMainImage = catchAsync(async (req, res) => {
  // 1) Update Product Using It's ID
  const { type, message, statusCode, product } =
    await productService.updateProductMainImage(req.params.id, req.files);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }
  // 3) If Everything is OK, Send Product
  return res.status(statusCode).json({
    type,
    message,
    product
  });
});

/**
 * Update Product Images
 * @param     {Object}    req
 * @param     {Object}    res
 * @property  {Object}    req.files
 * @property  {ObjectId}  req.params.id
 * @returns   {JSON}
 */
export const updateProductImages = catchAsync(async (req, res) => {
  // 1) Update Product Using It's ID
  const { type, message, statusCode, product } =
    await productService.updateProductImages(req.params.id, req.files);

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything is OK, Send Product
  return res.status(statusCode).json({
    type,
    message,
    product
  });
});

/**
 * Delete Product
 * @param     {Object}     req
 * @param     {Object}     res
 * @property  {ObjectId}   req.params.id
 * @return    {JSON}
 */
export const deleteProduct = catchAsync(async (req, res) => {
  // 1) Delete Product
  const { type, message, statusCode } = await productService.deleteProduct(
    req.params.id
  );

  // 2) Check If There is an Error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message
    });
  }

  // 3) If Everything Is OK, Send Message
  return res.status(statusCode).json({
    type,
    message
  });
});

/**
 * Get Top 5 Cheapeast Products
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 */
export const top5Cheap = catchAsync(async (req, res, next) => {
  // Limiting Products To Top 5 Products
  // Sorting Products According to It's Price Asc and According To Ratings Average Des
  // Selecting Name, Price and Ratings Average
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.select = 'name,price,ratingsAverage';

  next();
});

/**
 * Get Products Statics
 * @param   {Object} req
 * @param   {Object} res
 * @return  {JSON}
 */
export const productStats = catchAsync(async (req, res) => {
  // 1) Get Product Stats
  const stats = await productService.getProductStats();

  // 2) If Everything Is OK, Send Stats
  return res.status(200).json({
    status: 'success',
    message: 'Product Statics',
    stats
  });
});
