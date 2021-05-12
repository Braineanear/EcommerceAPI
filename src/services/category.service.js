// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/apiFeatures';

// Models
import { Category } from '../models/index';

/**
 * Create New Category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
export const createCategory = catchAsync(async (categoryBody) => {
  // 1) Create New Category & Save Data at Database
  const category = await Category.create(categoryBody);

  // 2) If Everything is OK, Send Data
  return category;
});

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {Array} select - Select Certain Fields
 * @returns {Promise<Categories>}
 */
export const queryCategories = catchAsync(async (req) => {
  // 1) Get All Categories
  const categories = APIFeatures(req, Category);

  // 2) Send Categories Data
  return categories;
});

/**
 * Get Category By Name
 * @param {String} categoryName
 * @returns {Promise<Category>}
 */
export const getCategoryByName = catchAsync(async (categoryName) => {
  // 1) Get Category From Database
  const category = await Category.findOne({ name: categoryName });

  // 2) Send Category
  return category;
});

/**
 * Get Category By Id
 * @param {String} categoryId
 * @returns {Promise<Category>}
 */
export const getCategoryById = catchAsync(async (categoryId) => {
  // 1) Get Category From Database
  const category = await Category.findById(categoryId);

  // 2) Send Category
  return category;
});

/**
 * Update Category
 * @param {String} categoryId
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
export const updateCategoryById = catchAsync(
  async (categoryId, categoryBody) => {
    // 1) Find Category Document and Update it
    const category = await Category.findByIdAndUpdate(
      categoryId,
      categoryBody,
      {
        new: true,
        runValidators: true
      }
    );

    // 2) Check If Category Already Exist
    if (!category) {
      throw new AppError(`No Category Found With This ID: ${categoryId}`, 404);
    }

    // 3) If Everything is OK, Send Category
    return category;
  }
);

/**
 * Delete Category
 * @param {String} categoryId
 */
export const deleteCategoryById = catchAsync(async (categoryId) => {
  // 1) Find Category Document and Delete it
  const category = await Category.findByIdAndDelete(categoryId);

  // 2) Check If Category Already Exist
  if (!category) {
    throw new AppError(`No Category Found With This ID: ${categoryId}`, 404);
  }
});
