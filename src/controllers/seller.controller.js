// Configs
import logger from '../config/logger';

// Utils
import catchAsync from '../utils/catchAsync';

// Services
import { sellerService, redisService } from '../services/index';

/**
 * Create New Seller
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const createSeller = catchAsync(async (req, res, next) => {
  // 1) Create Seller
  const seller = await sellerService.createSeller(req);

  // 2) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Seller Created Successfully',
    seller
  });
});

/**
 * Get All Sellers
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const getAllSellers = catchAsync(async (req, res, next) => {
  let { page, sort, limit, select } = req.query;

  // 1) Setting Default Params
  if (!page) page = 1;
  if (!sort) sort = '';
  if (!limit) limit = 10;
  if (!select) select = '';

  // 2) Generating Redis key
  const key = redisService.generateCacheKey(
    'sellers',
    `page:${page}-sortBy:${sort}-limit:${limit}-select:${select}`
  );

  // 3) Getting Cached Data From Redis
  let sellers = await redisService.get(key);

  // 4) Check If Cached Data Already Exist
  if (!sellers) {
    logger.error('No Caching Data');
  }

  sellers = JSON.parse(sellers);

  // 5) If Cached Data Exit Return it
  if (sellers) {
    return res.status(200).json({
      sellers
    });
  }

  // 6) Get All Sellers
  sellers = await sellerService.querySellers(req);

  // 7) Put Data into Redis With a Specific Key
  redisService.set(key, JSON.stringify(sellers), 'EX', 60);

  // 8) If Everything is OK, Send Data
  return res.status(200).json({
    status: 'success',
    message: 'Found Sellers',
    sellers
  });
});

/**
 * Update Seller Details Using It's ID
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const updateSellerDetails = catchAsync(async (req, res, next) => {
  // 1) Update Seller Using It's ID
  const seller = await sellerService.updateSellerDetails(
    req.params.id,
    req.body
  );

  // 2) If Everything is OK, Send Seller
  return res.status(200).json({
    status: 'success',
    message: 'Seller Updated Successfully',
    seller
  });
});

/**
 * Update Seller Profile Image Using It's ID
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const updateSellerProfileImage = catchAsync(async (req, res, next) => {
  // 1) Update Seller Using It's ID
  const seller = await sellerService.updateSellerProfileImage(req.file);

  // 2) If Everything is OK, Send Seller
  return res.status(200).json({
    status: 'success',
    message: 'Seller Updated Successfully',
    seller
  });
});

/**
 * Delete Seller Using It's ID
 * @param   {Object} req
 * @param   {Object} res
 * @param   {Object} next
 * @returns {JSON}
 */
export const deleteSeller = catchAsync(async (req, res, next) => {
  // 1) Delete Seller
  await sellerService.deleteSeller(req.params.id);

  // 2) If Everything Is OK, Send Message
  return res.status(200).json({
    status: 'success',
    message: 'Seller Deleted Successfully'
  });
});
