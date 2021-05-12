// Config
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

// Services
import { productService, redisService } from '../services/index';

export const getAllProducts = catchAsync(async (req, res, next) => {
  let { page, sortBy, limit } = req.query;
  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sortBy) sortBy = 'sortField:asc';
  if (!limit) limit = 10;

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'products',
    `page:${page}-sortBy:${sortBy}-limit:${limit}`
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

  // 7) Get All Users
  products = await productService.queryProducts(req);

  // 8) Check If Products Already Exist
  if (!products) {
    return next(new AppError('No Products Found', 404));
  }

  // 9) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(products), 'EX', 60);

  // 10) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Found Products',
    products
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
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

  // 6) Check If Product Already Exist
  if (!product) {
    return next(new AppError(`No Product Found With This ID: ${id}`, 404));
  }

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(product), 'EX', 60);

  // 8) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Found Product',
    product
  });
});

export const addProduct = catchAsync(async (req, res, next) => {
  // 1) Create Product
  const products = await productService.createProduct(req);

  // 2) Check If Products Already Exist
  if (!products) {
    return next(new AppError('No Products Found', 404));
  }

  // 3) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Category Created Successfully',
    products
  });
});

export const updateProductDetails = catchAsync(async (req, res, next) => {
  // 1) Update Product Using It's ID
  const product = await productService.updateProductDetails(req);

  // 2) Check If Product Already Exist
  if (!product) {
    return next(new AppError(`No Product Found With This ID: ${req.id}`, 404));
  }

  // 3) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Product Updated Successfully',
    product
  });
});

export const updateProductMainImage = catchAsync(async (req, res, next) => {
  // 1) Update Product Using It's ID
  const product = await productService.updateProductMainImage(req);

  // 2) Check If Product Already Exist
  if (!product) {
    return next(new AppError(`No Product Found With This ID: ${req.id}`, 404));
  }

  // 3) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Product Updated Successfully',
    product
  });
});

export const updateProductImages = catchAsync(async (req, res, next) => {
  // 1) Update Product Using It's ID
  const product = await productService.updateProductImages(req);

  // 2) Check If Product Already Exist
  if (!product) {
    return next(new AppError(`No Product Found With This ID: ${req.id}`, 404));
  }

  // 3) If Everything is OK, Send Product
  return res.status(200).json({
    status: 'success',
    message: 'Product Updated Successfully',
    product
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  await productService.deleteProduct(req);

  return res.status(200).json({
    status: 'success',
    message: 'Product Deleted Successfully'
  });
});
