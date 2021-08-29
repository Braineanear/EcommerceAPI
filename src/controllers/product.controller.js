// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { productService } from '../services/index';

/**
 * Get product's favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { Object }  req.user
 * @returns   { JSON }
 */
export const getFavoriteList = catchAsync(async (req, res) => {
  // 1) Extract user data
  const { user } = req;

  // 2) Calling addFavoriteProduct service
  const { type, message, statusCode, favoriteProducts } =
    await productService.getFavoriteList(user);

  // 3) Check if something went wrong
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
    products: favoriteProducts
  });
});

/**
 * Add product to favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.body.productId
 * @property  { Object }  req.user
 * @returns   { JSON }
 */
export const addFavoriteProduct = catchAsync(async (req, res) => {
  // 1) Extract productId and user data
  const { productId } = req.body;
  const { user } = req;

  // 2) Calling addFavoriteProduct service
  const { type, message, statusCode } = await productService.addFavoriteProduct(
    user,
    productId
  );

  // 3) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 4) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});

/**
 * delete product from favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.params.productId
 * @property  { Object }  req.user
 * @returns   { JSON }
 */
export const deleteProductFromFavorite = catchAsync(async (req, res) => {
  // 1) Extract productId and user data
  const { id } = req.params;
  const { user } = req;

  // 2) Calling deleteProductFromFavorite service
  const { type, message, statusCode } =
    await productService.deleteProductFromFavorite(user, id);

  // 3) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 4) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});

/**
 * Check if product in favorite list controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.body.productId
 * @property  { Object }  req.user
 * @returns   { JSON }
 */
export const checkProductInFavoriteList = catchAsync(async (req, res) => {
  // 1) Extract productId and user data
  const { productId } = req.body;
  const { user } = req;

  // 2) Calling checkProductInFavoriteList service
  const { type, message, statusCode } =
    await productService.checkProductInFavoriteList(user, productId);

  // 3) Check if something went wrong
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 4) If everything is OK, send data
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message)
  });
});

/**
 * Get All Products Controller
 * @param     { Object } req
 * @param     { Object } res
 * @property  { String } req.query.sort
 * @property  { String }  req.query.select
 * @property  { Number }  req.query.page
 * @property  { Number }  req.query.limit
 * @returns   { JSON }
 */
export const getAllProducts = catchAsync(async (req, res) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting default params
  if (!page) req.query.page = 1;
  if (!sort) req.query.sort = '';
  if (!limit) req.query.limit = 10;
  if (!select) req.query.select = '';

  // 1) Get all products
  const { type, message, statusCode, products } =
    await productService.queryProducts(req);

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
    products
  });
});

/**
 * Get Product Using It's ID Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @returns   { JSON }
 */
export const getProduct = catchAsync(async (req, res) => {
  const { id } = req.params;

  // 1) Get product using it's ID
  const { type, message, statusCode, product } =
    await productService.queryProductById(id);

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
    product
  });
});

/**
 * Create New Product Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { Object }    req.body
 * @property  { Object }    req.files
 * @property  { ObjectId }  req.user._id
 * @returns   { JSON }
 */
export const addProduct = catchAsync(async (req, res) => {
  const { body, files, user } = req;

  // 1) Create product
  const { type, message, statusCode, product } =
    await productService.createProduct(body, files, user._id);

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
    product
  });
});

/**
 * Update Product Details Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { ObjectId }  req.params.id
 * @property  { Object }    req.body
 * @returns   { JSON }
 */
export const updateProductDetails = catchAsync(async (req, res) => {
  // 1) Update product details using it's ID
  const { type, message, statusCode, product } =
    await productService.updateProductDetails(req.params.id, req.body);

  // 2) Check if there is an error
  if (type === 'Error') {
    return res.status(statusCode).json({
      type,
      message: req.polyglot.t(message)
    });
  }

  // 3) If everything is OK, send product
  return res.status(statusCode).json({
    type,
    message: req.polyglot.t(message),
    product
  });
});

/**
 * Update Product Main Image Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { Object }    req.files
 * @property  { ObjectId }  req.params.id
 * @returns   { JSON }
 */
export const updateProductMainImage = catchAsync(async (req, res) => {
  // 1) Update product main image using it's ID
  const { type, message, statusCode, product } =
    await productService.updateProductMainImage(req.params.id, req.files);

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
    product
  });
});

/**
 * Update Product Images Controller
 * @param     { Object }    req
 * @param     { Object }    res
 * @property  { Object }    req.files
 * @property  { ObjectId }  req.params.id
 * @returns   { JSON }
 */
export const updateProductImages = catchAsync(async (req, res) => {
  // 1) Update product images using it's ID
  const { type, message, statusCode, product } =
    await productService.updateProductImages(req.params.id, req.files);

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
    product
  });
});

/**
 * Delete Product Controller
 * @param     { Object }     req
 * @param     { Object }     res
 * @property  { ObjectId }   req.params.id
 * @return    { JSON }
 */
export const deleteProduct = catchAsync(async (req, res) => {
  // 1) Delete product using it's ID
  const { type, message, statusCode } = await productService.deleteProduct(
    req.params.id
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
    message: req.polyglot.t(message)
  });
});

/**
 * Get Top 5 Cheapeast Products Controller
 * @param   { Object } req
 * @param   { Object } res
 * @param   { Object } next
 */
export const top5Cheap = catchAsync(async (req, res, next) => {
  // Limiting products to top 5 products
  // Sorting products according to it's price asc and according to ratings average des
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
});

/**
 * Get Products Statics Controller
 * @param   { Object } req
 * @param   { Object } res
 * @return  { JSON }
 */
export const productStats = catchAsync(async (req, res) => {
  // 1) Get product stats
  const stats = await productService.getProductStats();

  // 2) If everything is OK, send data
  return res.status(200).json({
    status: 'success',
    message: req.polyglot.t('productStatics'),
    stats
  });
});
