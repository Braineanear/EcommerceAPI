// Utils
import catchAsync from '../utils/catchAsync';
import dataUri from '../utils/datauri';
import APIFeatures from '../utils/apiFeatures';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Model
import { Product, User } from '../models/index';

/**
 * Add product to favorite list service
 * @param     { Object } user
 * @property  { String } productId
 * @returns   { JSON }
 */
export const addFavoriteProduct = catchAsync(async (user, productId) => {
  // 1) Get id and favoriteProducts fields from user data
  const { id, favoriteProducts } = user;

  // 2) Get product data from database
  const product = await Product.findById(productId);

  // 3) Check if product already exist
  if (!product) {
    return {
      type: 'Error',
      statusCode: 404,
      message: `No product found with ID: ${productId}`
    };
  }

  // 4) Check if product already exist in favorite list
  if (favoriteProducts.includes(productId)) {
    return {
      type: 'Error',
      statusCode: 400,
      message: 'Product already exits.'
    };
  }

  // 4) Push the productId into the new favorite products array
  favoriteProducts.push(productId);

  // 5) Update user favoriteProducts field
  await User.findByIdAndUpdate(id, { favoriteProducts });

  // 6) If everything is OK, send data
  return {
    type: 'Success',
    statusCode: 200,
    message: 'Product added to favorite list successfully.'
  };
});

/**
 * Get product's favorite list service
 * @param     { Object } user
 * @returns   { JSON }
 */
export const getFavoriteList = catchAsync(async (user) => {
  // 1) Get id and favoriteProducts fields from user data
  const { favoriteProducts } = user;

  // 2) Check if favorite products already exist
  if (favoriteProducts.length === 0) {
    return {
      type: 'Error',
      statusCode: 404,
      message: `No products on the favorite list found`
    };
  }

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    statusCode: 200,
    message: 'Favorite list successfully retrieved.',
    favoriteProducts
  };
});

/**
 * Query products
 * @param   {Object} request
 * @returns {Object<type|message|statusCode|products>}
 */
export const queryProducts = catchAsync(async (req) => {
  // 1) Get All Products
  const products = await APIFeatures(req, Product);

  // 2) Check if Porducts Already Exist
  if (!products) {
    return {
      type: 'Error',
      message: 'No Products Found',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Products Data
  return {
    type: 'Success',
    message: 'Products Found Successfully',
    statusCode: 200,
    products
  };
});

/**
 * Query Product Using It's ID
 * @param   {ObjectId} productId
 * @returns {Object<type|message|statusCode|product>}
 */
export const queryProductById = catchAsync(async (productId) => {
  // 1) Get Product Using It's ID
  const product = await Product.findById(productId).populate('user');

  // 2) Check if Product Already Exist
  if (!product) {
    return {
      type: 'Error',
      message: `No Product Found With This ID: ${productId}`,
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Product
  return {
    type: 'Success',
    message: 'Product Found Successfully',
    statusCode: 200,
    product
  };
});

/**
 * Create new product
 * @param   {Object}   body
 * @param   {Object}   files
 * @param   {ObjectId} seller
 * @returns {Object<type|message|statusCode|product>}
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

  // 1) Make Array Of Main Image (Single Image)
  const mainImage = files.filter((image) => image.fieldname === 'mainImage');

  // 2) Make Array Of Product Images
  const images = files.filter((image) => image.fieldname === 'images');

  // 3) Cloudinary Folder Name
  const folderName = `Products/${name.trim().split(' ').join('')}`;

  // 4) Array Of Images Links
  const imagesLink = [];

  // 5) Array Of Images IDs
  const imagesId = [];

  // 6) Check If There Any Empty Field
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
      message: 'All Fields Are Required',
      statusCode: 400
    };
  }

  // 7) Upload Images To Cloudinary
  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName)
  );
  const imagesResult = await Promise.all(imagesPromises);
  const imageResult = await uploadFile(
    dataUri(mainImage[0]).content,
    folderName
  );

  // 8) Push Images Links & Images IDs to The Arrays
  imagesResult.forEach((image) => {
    imagesLink.push(image.secure_url);
    imagesId.push(image.public_id);
  });

  let priceAfterDiscount = Number(price);

  if (priceDiscount !== 0) {
    priceAfterDiscount =
      Number(price) - (Number(price) / 100) * Number(priceDiscount);
  }

  // 9) Create Product
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

  // 10) If Everything is OK, Send Data
  return {
    type: 'Success',
    message: 'Products Created Successfully',
    statusCode: 201,
    product
  };
});

/**
 * Update Product Details
 * @param   {Object}    body
 * @param   {ObjectId}  id
 * @returns {Object<type|message|statusCode|product>}
 */
export const updateProductDetails = catchAsync(async (id, body) => {
  const product = await Product.findById(id);

  // 1) Check If Product Already Exist
  if (!product) {
    return {
      type: 'Error',
      message: `No Product Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 2) Update Product By It's ID
  const result = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 3) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'Product Detials Updated Successfully',
    statusCode: 200,
    result
  };
});

/**
 * Update Product Main Image
 * @param   {Object}    body
 * @param   {ObjectId}  id
 * @returns {Object<type|message|statusCode|product>}
 */
export const updateProductMainImage = catchAsync(async (id, image) => {
  // 1) Check If Image Provided
  if (image.length === 0) {
    return {
      type: 'Error',
      message: 'Please Select an Image',
      statusCode: 400
    };
  }

  // 2) Check If Product Already Exist
  const product = await Product.findById(id);

  if (!product) {
    return {
      type: 'Error',
      message: `No Product Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Make Array Of Main Image (Single Image)
  let mainImage = image.filter((img) => img.fieldname === 'mainImage');

  // 4) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Products/${product.name.trim().split(' ').join('')}`;

  // 5) Destroy Image From Cloudinary
  const productMainImageID = product.mainImageId;
  destroyFile(productMainImageID);

  // 6) Upload Image to Cloudinary
  mainImage = await uploadFile(dataUri(mainImage[0]).content, folderName, 600);

  // 7) Create Product Body
  const productBody = {
    mainImage: mainImage.secure_url,
    mainImageId: mainImage.public_id
  };

  // 8) Update Product Using It's ID
  await Product.findByIdAndUpdate(id, productBody, {
    new: true,
    runValidators: true
  });

  // 9) If Everything is OK, Send Product
  return {
    type: 'Success',
    message: 'Product Main Image Updated Successfully',
    statusCode: 200
  };
});

/**
 * Update Product Images
 * @param   {Object}    images
 * @param   {ObjectId}  id
 * @returns {Object<type|message|statusCode|product>}
 */
export const updateProductImages = catchAsync(async (id, images) => {
  // 1) Check If Images Provided
  if (images.length === 0) {
    return {
      type: 'Error',
      message: 'Please Select One or More Image',
      statusCode: 400
    };
  }

  // 2) Check If Product Already Exist
  const product = await Product.findById(id);

  if (!product) {
    return {
      type: 'Error',
      message: `No Product Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Make Array Of Images
  images = images.filter((image) => image.fieldname === 'images');

  // 4) Specifiy Folder Name Where The Images Are Going To Be Uploaded In Cloudinary
  const folderName = `Products/${product.name.trim().split(' ').join('')}`;

  // 5) Array Of Images Links
  const imagesLinks = [];

  // 6) Array Of Images IDs
  const imagesIDs = [];

  // 7) Destroy Images From Cloudinary
  const productImagesID = product.imagesId;
  productImagesID.forEach((image) => destroyFile(image));

  // 8) Upload Images to Cloudinary
  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName, 600)
  );

  const imagesResult = await Promise.all(imagesPromises);

  // 9) Push Images Links & IDs to The Arrays
  imagesResult.forEach((image) => {
    imagesLinks.push(image.secure_url);
    imagesIDs.push(image.public_id);
  });

  // 10) Create Product Body
  const productBody = {
    images: imagesLinks,
    ImagesId: imagesIDs
  };

  // 11) Update Product Using It's ID
  await Product.findByIdAndUpdate(id, productBody, {
    new: true,
    runValidators: true
  });

  // 12) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'Product Sub Images Updated Successfully',
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
      message: `No Product Found With This ID: ${id}`,
      statusCode: 404
    };
  }

  // 3) Delete Product Using It's ID
  await Product.findByIdAndDelete(id);

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'Product Deleted Successfully',
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
