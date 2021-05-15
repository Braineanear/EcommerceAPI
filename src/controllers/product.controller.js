// Config
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { productService, redisService } from '../services/index';

/**
 * Get All Products
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const getAllProducts = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'products',
    `page:${page}-sortBy:${sort}-limit:${limit}-select:${select}`
  );

  // 3) Getting Cached Data From Redis
  let products = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!products) {
    logger.error('No Caching Data');
  }

  products = JSON.parse(products);

  // 5) If Cached Data Exit Return it
  if (products) {
    return res.status(200).json({
      products
    });
  }

  // 6) Get All Products
  products = await productService.queryProducts(req);

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(products), 'EX', 60);

  // 8) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Found Products',
    products
  });
});

/**
 * Get Product
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const getProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Generating Redis key
  const key = redisService.generateCacheKey('product', `id:${id}`);

  // 2) Getting Cached Data From Redis
  let product = await redisService.get(key);

  // 3) Check If Cached Data Already Exist
  if (!product) {
    logger.error('No Caching Data');
  }

  product = JSON.parse(product);

  // 4) If Cached Data Exit Return it
  if (product) {
    return res.status(200).json({
      product
    });
  }

  // 5) Get Product Using It's ID
  product = await productService.queryProductById(id);

  // 6) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(product), 'EX', 60);

  // 7) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Found Product',
    product
  });
});

/**
 * Create New Product
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const addProduct = catchAsync(async (req, res) => {
  // 1) Create Product
  const product = await productService.createProduct(req);

  // 2) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Category Created Successfully',
    product
  });
});

/**
 * Update Product Details
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const updateProductDetails = catchAsync(async (req, res) => {
  // 1) Update Product Using It's ID
  const product = await productService.updateProductDetails(req);

  // 2) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Product Updated Successfully',
    product
  });
});

/**
 * Update Product Main Image
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const updateProductMainImage = catchAsync(async (req, res) => {
  // 1) Update Product Using It's ID
  const product = await productService.updateProductMainImage(req);

  // 2) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Product Updated Successfully',
    product
  });
});

/**
 * Update Product Images
 * @param   {Object} req
 * @param   {Object} res
 * @returns {JSON}
 */
export const updateProductImages = catchAsync(async (req, res) => {
  // 1) Update Product Using It's ID
  const product = await productService.updateProductImages(req);

  // 2) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Product Updated Successfully',
    product
  });
});

/**
 * Delete Product
 * @param   {Object} req
 * @param   {Object} res
 * @return  {JSON}
 */
export const deleteProduct = catchAsync(async (req, res) => {
  // 1) Delete Product
  await productService.deleteProduct(req);

  // 2) If Everything Is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Product Deleted Successfully'
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
