// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Models
import { Category } from '../models/index';

/**
 * Create New Category
 * @param   {Object} body
 * @param   {Object} file
 * @returns {Object<type|message|statusCode|category>}
 */
export const createCategory = catchAsync(async (body, file) => {
  const { name, description } = body;

  // 1) Check If The User Entered All Fields
  if (!name || !description || !file) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 2) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Category/${name.trim().split(' ').join('')}`;

  // 3) Generate a Buffer instance from a Data URI string
  let image = dataUri(file);

  // 4) Upload Image to Cloudinary
  image = await uploadFile(image.content, folderName, 600);

  // 5) Create Body
  const object = {
    name,
    description,
    image: image.secure_url,
    imageId: image.public_id
  };

  // 6) Create New Category & Save Data at Database
  const category = await Category.create(object);

  // 7) If Everything is OK, Send Data
  return {
    type: 'Success',
    message: 'successfulCategoryCreate',
    statusCode: 201,
    category
  };
});

/**
 * Query Categories
 * @param   {Object} req
 * @returns {Object<type|message|statusCode|categories>}
 */
export const queryCategories = catchAsync(async (req) => {
  // 1) Get All Categories
  const categories = await APIFeatures(req, Category);

  // 2) Check If Category Already Exist
  if (categories.length === 0) {
    return {
      type: 'Error',
      message: 'noCategories',
      statusCode: 404
    };
  }
  // 3) If Everything is OK, Send Categories
  return {
    type: 'Success',
    message: 'successfulCategoriesFound',
    statusCode: 200,
    categories
  };
});

/**
 * Query Category Using It's ID
 * @param   {String} id
 * @returns {Object<type|message|statusCode|category>}
 */
export const queryCategory = catchAsync(async (id) => {
  // 1) Get Category From Database
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Category
  return {
    type: 'Success',
    message: 'successfulCategoryFound',
    statusCode: 200,
    category
  };
});

/**
 * Update Category Details
 * @param   {String} id
 * @param   {Object} body
 * @returns {Object<type|message|statusCode|category>}
 */
export const updateCategoryDetails = catchAsync(async (id, body) => {
  // 1) Find Category Document
  let category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  // 3) Update Category
  category = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 3) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'successfulCategoryDetails',
    statusCode: 200,
    category
  };
});

/**
 * Update Category Image
 * @param   {ObjectId}  id
 * @param   {Object}    image
 * @returns {Object<type|message|statusCode|category>}
 */
export const updateCategoryImage = catchAsync(async (id, image) => {
  if (image === undefined) {
    return {
      type: 'Error',
      message: 'categoryImageRequired',
      statusCode: 400
    };
  }

  // 1) Get Category Data
  let category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  // 3) Destroy Category Current Image From Cloudinary
  destroyFile(category.imageId);

  // 4) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Category/${category.name.trim().split(' ').join('')}`;
  image = dataUri(image);
  image = await uploadFile(image.content, folderName, 600);

  // 5) Create Category Body Object
  const body = {
    image: image.secure_url,
    imageId: image.public_id
  };

  // 6) Update Category
  category = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 7) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'successfulCategoryImage',
    statusCode: 200,
    category
  };
});

/**
 * Delete Category
 * @param   {ObjectId} id
 * @returns {Object<type|message|statusCode>}
 */
export const deleteCategoryById = catchAsync(async (id) => {
  // 1) Find Category Document
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  destroyFile(category.imageId);

  // 3) Delete Category
  await Category.findByIdAndDelete(id);

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'successfulCategoryDelete',
    statusCode: 200
  };
});
