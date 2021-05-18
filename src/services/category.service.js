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
 * @returns {Object<type|message|statusCode|category>}
 */
export const createCategory = catchAsync(async (req) => {
  const { name, description, status } = req.body;
  let image = req.file;

  // 1) Check If The User Entered All Fields
  if (!name || !description || !status || !image) {
    return {
      type: 'Error',
      message: 'All Fields Are Required',
      statusCode: 400
    };
  }

  // 2) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Category/${name.trim().split(' ').join('')}`;

  // 3) Generate a Buffer instance from a Data URI string
  image = dataUri(image);

  // 4) Upload Image to Cloudinary
  image = await uploadFile(image.content, folderName, 600);

  // 5) Create Body
  const body = {
    name,
    description,
    status,
    image: image.secure_url,
    imageId: image.public_id
  };

  // 7) Create New Category & Save Data at Database
  const category = await Category.create(body);

  // 8) If Everything is OK, Send Data
  return {
    type: 'Success',
    message: 'Category Created Successfully',
    statusCode: 201,
    category
  };
});

/**
 * Query users
 * @param   {Object} request
 * @returns {Object<type|message|statusCode|categories>}
 */
export const queryCategories = catchAsync(async (req) => {
  // 1) Get All Categories
  const categories = await APIFeatures(req, Category);

  // 2) Check If Category Already Exist
  if (categories.length === 0) {
    return {
      type: 'Error',
      message: 'No Categories Found',
      statusCode: 404
    };
  }
  // 3) If Everything is OK, Send Categories
  return {
    type: 'Success',
    message: 'Found Categories Successfully',
    statusCode: 200,
    categories
  };
});

/**
 * Query Category Using It's Name
 * @param   {String} name
 * @returns {Object<type|message|statusCode|category>}
 */
export const getCategoryByName = catchAsync(async (name) => {
  // 1) Get Category From Database
  const category = await Category.findOne({ name });

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: `No Category Found With This Name: ${name}`,
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Category
  return {
    type: 'Success',
    message: 'Category Found Successfully',
    statusCode: 200,
    category
  };
});

/**
 * Query Category Using It's Id
 * @param {String} id
 * @returns {Promise<Category>}
 */
export const getCategoryById = catchAsync(async (id) => {
  // 1) Get Category From Database
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: `No Category Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Category
  return {
    type: 'Success',
    message: 'Category Found Successfully',
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
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: `No Category Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Update Category
  const result = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 3) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'Category Details Updated Successfully',
    statusCode: 200,
    result
  };
});

/**
 * Update Category Image
 * @param   {Object} image
 * @returns {Object<type|message|statusCode|category>}
 */
export const updateCategoryImage = catchAsync(async (id, image) => {
  // 1) Get Category Data
  const category = await Category.findById(id);

  // 2) Check If Category Already Exist
  if (!category) {
    return {
      type: 'Error',
      message: `No Category Found With This ID: ${id}`,
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
  const result = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 7) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'Category Image Updated Successfully',
    statusCode: 200,
    result
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
      message: `No Category Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Delete Category
  await Category.findByIdAndDelete(id);

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'Category Deleted Successfully',
    statusCode: 200
  };
});
