// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Models
import { Category } from '../models/index';

/**
 * @desc    Create New Category
 * @param   { Object } body - Body object data
 * @param   { Object } file - Category image
 * @returns { Object<type|message|statusCode|category> }
 */
export const createCategory = catchAsync(async (body, file) => {
  const { name, description } = body;

  // 1) Check if the user entered all fields
  if (!name || !description || !file) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 2) Specifiy folder name where the images are going to be uploaded in cloudinary
  const folderName = `Category/${name.trim().split(' ').join('')}`;

  // 3) Generate a buffer instance from a data uri string
  let image = dataUri(file);

  // 4) Upload image to cloudinary
  image = await uploadFile(image.content, folderName, 600);

  // 5) Create body
  const object = {
    name,
    description,
    image: image.secure_url,
    imageId: image.public_id
  };

  // 6) Create new category
  const category = await Category.create(object);

  // 7) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulCategoryCreate',
    statusCode: 201,
    category
  };
});

/**
 * @desc    Query Categories
 * @param   { Object } req - Request object
 * @returns { Object<type|message|statusCode|categories> }
 */
export const queryCategories = catchAsync(async (req) => {
  // 1) Get all categories
  const categories = await APIFeatures(req, Category);

  // 2) Check if there are no categories
  if (categories.length === 0) {
    return {
      type: 'Error',
      message: 'noCategories',
      statusCode: 404
    };
  }
  // 3) If everything is OK, send categories
  return {
    type: 'Success',
    message: 'successfulCategoriesFound',
    statusCode: 200,
    categories
  };
});

/**
 * @desc    Query Category Using It's ID
 * @param   { String } id - Category ID
 * @returns { Object<type|message|statusCode|category> }
 */
export const queryCategory = catchAsync(async (id) => {
  const category = await Category.findById(id);

  // 1) Check if category doesn't exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  // 2) If everything is OK, send date
  return {
    type: 'Success',
    message: 'successfulCategoryFound',
    statusCode: 200,
    category
  };
});

/**
 * @desc    Update Category Details
 * @param   { String } id - Category ID
 * @param   { Object } body - Category details
 * @returns { Object<type|message|statusCode|category> }
 */
export const updateCategoryDetails = catchAsync(async (id, body) => {
  let category = await Category.findById(id);

  // 1) Check if category doesn't exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  // 2) Update category
  category = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 3) If everything is OK, send date
  return {
    type: 'Success',
    message: 'successfulCategoryDetails',
    statusCode: 200,
    category
  };
});

/**
 * @desc    Update Category Image
 * @param   { String } id - Category ID
 * @param   { Object } image - Category image
 * @returns { Object<type|message|statusCode|category> }
 */
export const updateCategoryImage = catchAsync(async (id, image) => {
  // 1) Check if image provided
  if (image === undefined) {
    return {
      type: 'Error',
      message: 'categoryImageRequired',
      statusCode: 400
    };
  }

  let category = await Category.findById(id);

  // 2) Check if category doesn't exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  // 3) Destroy category current image from cloudinary
  destroyFile(category.imageId);

  // 4) Specifiy folder name where the images are going to be uploaded in cloudinary
  const folderName = `Category/${category.name.trim().split(' ').join('')}`;
  image = dataUri(image);
  image = await uploadFile(image.content, folderName, 600);

  // 5) Create category body object
  const body = {
    image: image.secure_url,
    imageId: image.public_id
  };

  // 6) Update category
  category = await Category.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 7) If everything is OK, send date
  return {
    type: 'Success',
    message: 'successfulCategoryImage',
    statusCode: 200,
    category
  };
});

/**
 * @desc    Delete Category
 * @param   { String } id - Category ID
 * @returns { Object<type|message|statusCode> }
 */
export const deleteCategoryById = catchAsync(async (id) => {
  const category = await Category.findById(id);

  // 1) Check if category doesn't exist
  if (!category) {
    return {
      type: 'Error',
      message: 'noCategoryFound',
      statusCode: 404
    };
  }

  // 2) Destroy category image
  destroyFile(category.imageId);

  // 3) Delete category
  await Category.findByIdAndDelete(id);

  // 4) If everything is OK, send date
  return {
    type: 'Success',
    message: 'successfulCategoryDelete',
    statusCode: 200
  };
});
