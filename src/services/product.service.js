// Utils
import catchAsync from '../utils/catchAsync';
import dataUri from '../utils/datauri';
import APIFeatures from '../utils/apiFeatures';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Model
import { Product } from '../models/index';

/**
 * @desc    Query products
 * @param   { Object } req - Request object
 * @returns { Object<type|message|statusCode|products> }
 */
export const queryProducts = catchAsync(async (req) => {
  const products = await APIFeatures(req, Product);

  // 1) Check if porducts doesn't exist
  if (!products) {
    return {
      type: 'Error',
      message: 'noProductsFound',
      statusCode: 404
    };
  }

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulProductsFound',
    statusCode: 200,
    products
  };
});

/**
 * @desc    Query Product Using It's ID
 * @param   { String } productId - Product ID
 * @returns { Object<type|message|statusCode|product> }
 */
export const queryProductById = catchAsync(async (productId) => {
  const product = await Product.findById(productId);

  // 1) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      message: 'noProductFound',
      statusCode: 404
    };
  }

  // 2) If everything is OK, send product
  return {
    type: 'Success',
    message: 'successfulProductFound',
    statusCode: 200,
    product
  };
});

/**
 * @desc    Create new product
 * @param   { Object } body - Body object data
 * @param   { Object } files - Product images
 * @param   { String } seller - Product seller ID
 * @returns { Object<type|message|statusCode|product> }
 */
export const createProduct = catchAsync(async (body, files, seller) => {
  const {
    name,
    description,
    category,
    price,
    priceDiscount,
    color,
    size,
    quantity,
    sold,
    isOutOfStock
  } = body;

  // 1) Make array Of main image (single image)
  const mainImage = files.filter((image) => image.fieldname === 'mainImage');

  // 2) Make array Of product images
  const images = files.filter((image) => image.fieldname === 'images');

  // 3) Cloudinary folder name
  const folderName = `Products/${name.trim().split(' ').join('')}`;

  // 4) Array Of images links
  const imagesLink = [];

  // 5) Array Of images IDs
  const imagesId = [];

  // 6) Check if there any empty field
  if (
    !name ||
    !description ||
    !category ||
    !price ||
    !priceDiscount ||
    !color ||
    !size ||
    !quantity ||
    !sold ||
    !isOutOfStock ||
    mainImage.length === 0 ||
    images.length === 0
  ) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 7) Upload images to cloudinary
  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName)
  );
  const imagesResult = await Promise.all(imagesPromises);
  const imageResult = await uploadFile(
    dataUri(mainImage[0]).content,
    folderName
  );

  // 8) Push images links & images IDs to the arrays
  imagesResult.forEach((image) => {
    imagesLink.push(image.secure_url);
    imagesId.push(image.public_id);
  });

  let priceAfterDiscount = Number(price);

  if (priceDiscount !== 0) {
    priceAfterDiscount =
      Number(price) - (Number(price) / 100) * Number(priceDiscount);
  }

  // 9) Create product
  let product = await Product.create({
    mainImage: imageResult.secure_url,
    mainImageId: imageResult.public_id,
    images: imagesLink,
    imagesId,
    name,
    description,
    category,
    price: Number(price),
    priceAfterDiscount,
    priceDiscount: Number(priceDiscount),
    color,
    size,
    seller,
    quantity: Number(quantity),
    sold: Number(sold),
    isOutOfStock
  });

  // 10) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulProductCreate',
    statusCode: 201,
    product
  };
});

/**
 * @desc    Update Product Details
 * @param   { Object } body - Body object data
 * @param   { String } id - Product ID
 * @returns { Object<type|message|statusCode|product> }
 */
export const updateProductDetails = catchAsync(async (id, body) => {
  const product = await Product.findById(id);

  // 1) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      message: 'noProductFound',
      statusCode: 404
    };
  }

  // 2) Update product by it's ID
  const result = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulProductDetails',
    statusCode: 200,
    result
  };
});

/**
 * @desc    Update Product Main Image
 * @param   { Object } image - Product main image
 * @param   { String } id - Product ID
 * @returns { Object<type|message|statusCode|product> }
 */
export const updateProductMainImage = catchAsync(async (id, image) => {
  // 1) Check if image provided
  if (image.length === 0) {
    return {
      type: 'Error',
      message: 'selectImage',
      statusCode: 400
    };
  }

  const product = await Product.findById(id);

  // 2) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      message: 'noProductFound',
      statusCode: 404
    };
  }

  // 3) Make array of main image (single image)
  let mainImage = image.filter((img) => img.fieldname === 'mainImage');

  // 4) Specifiy folder name where the image is going to be uploaded in cloudinary
  const folderName = `Products/${product.name.trim().split(' ').join('')}`;

  // 5) Destroy image from cloudinary
  const productMainImageID = product.mainImageId;
  destroyFile(productMainImageID);

  // 6) Upload image to cloudinary
  mainImage = await uploadFile(dataUri(mainImage[0]).content, folderName, 600);

  // 7) Create product body
  const productBody = {
    mainImage: mainImage.secure_url,
    mainImageId: mainImage.public_id
  };

  // 8) Update product using it's ID
  await Product.findByIdAndUpdate(id, productBody, {
    new: true,
    runValidators: true
  });

  // 9) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulProductMainImage',
    statusCode: 200
  };
});

/**
 * @desc    Update Product Images
 * @param   { Object } images - Product images
 * @param   { String } id - Product ID
 * @returns { Object<type|message|statusCode|product> }
 */
export const updateProductImages = catchAsync(async (id, images) => {
  // 1) Check if images provided
  if (images.length === 0) {
    return {
      type: 'Error',
      message: 'selectImages',
      statusCode: 400
    };
  }

  const product = await Product.findById(id);

  // 2) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      message: 'noProductFound',
      statusCode: 404
    };
  }

  // 3) Make array of images
  images = images.filter((image) => image.fieldname === 'images');

  // 4) Specifiy folder name where the images are going to be uploaded in cloudinary
  const folderName = `Products/${product.name.trim().split(' ').join('')}`;

  // 5) Array of images links
  const imagesLinks = [];

  // 6) Array of images IDs
  const imagesIDs = [];

  // 7) Destroy images from cloudinary
  const productImagesID = product.imagesId;
  productImagesID.forEach((image) => destroyFile(image));

  // 8) Upload images to cloudinary
  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName, 600)
  );

  const imagesResult = await Promise.all(imagesPromises);

  // 9) Push images links & IDs to the arrays
  imagesResult.forEach((image) => {
    imagesLinks.push(image.secure_url);
    imagesIDs.push(image.public_id);
  });

  // 10) Create product body
  const productBody = {
    images: imagesLinks,
    ImagesId: imagesIDs
  };

  // 11) Update product using it's ID
  await Product.findByIdAndUpdate(id, productBody, {
    new: true,
    runValidators: true
  });

  // 12) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulProductSubImages',
    statusCode: 200
  };
});

/**
 * Delete Product Using It's ID
 * @param   {ObjectId} id
 * @returns {Object<type|message|statusCode>}
 */
export const deleteProduct = catchAsync(async (id) => {
  // 1) Find Product Using It's ID
  const product = await Product.findById(id);

  // 2) Check If Product Doesn't Exist
  if (!product) {
    return {
      type: 'Error',
      message: `noProductFound`,
      statusCode: 404
    };
  }

  // 3) Delete Product Using It's ID
  await Product.findByIdAndDelete(id);

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'successfulProductDelete',
    statusCode: 200
  };
});

/**
 * Get Products Statics
 * @return  {Array<Stats>}
 */
export const getProductStats = catchAsync(async () => {
  const stats = await Product.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$category',
        'Number Of Products': { $sum: 1 },
        'Number Of Ratings': { $sum: '$ratingsQuantity' },
        'Average Rating': { $avg: '$ratingsAverage' },
        'Average Price': { $avg: '$price' },
        'Minimum Price': { $min: '$price' },
        'Maximum Price': { $max: '$price' },
        Quantity: { $sum: '$quantity' }
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'Category'
      }
    },
    {
      $unwind: '$Category'
    },
    {
      $project: {
        _id: 0,
        'Number Of Products': 1,
        'Number Of Ratings': 1,
        'Average Rating': 1,
        'Average Price': 1,
        'Minimum Price': 1,
        'Maximum Price': 1,
        Quantity: 1,
        Category: {
          name: 1
        }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  return stats;
});
