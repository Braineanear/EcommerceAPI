// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import dataUri from '../utils/datauri';
import apiFeatures from '../utils/apiFeatures';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Model
import { Product } from '../models/index';

export const queryProducts = catchAsync(async (req) => {
  // 1) Get All Products
  const products = await apiFeatures(req, Product, {
    path: 'user',
    select: 'name email role'
  });

  // 2) Check if Porducts Already Exist
  if (!products) {
    throw new AppError('No Products Found', 404);
  }

  // 3) If Everything is OK, Send Products Data
  return products;
});

export const queryProductById = catchAsync(async (productId) => {
  // 1) Get Product Using It's ID
  const product = await Product.findById(productId).populate('user');

  // 2) Check if Product Already Exist
  if (!product) {
    throw new AppError(`No Product Found With This ID: ${productId}`, 404);
  }

  // 3) If Everything is OK, Send Product
  return product;
});

export const createProduct = catchAsync(async (req) => {
  const {
    name,
    description,
    category,
    price,
    oldPrice,
    color,
    size,
    quantity,
    quality,
    isPopular,
    sold,
    offer,
    status,
    isOutOfStock
  } = req.body;

  // 1) Make Array Of Main Image (Single Image)
  const mainImage = req.files.filter(
    (image) => image.fieldname === 'mainImage'
  );

  // 2) Make Array Of Product Images
  const images = req.files.filter((image) => image.fieldname === 'images');

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
    !oldPrice ||
    !color ||
    !size ||
    !quantity ||
    !quality ||
    !isPopular ||
    !sold ||
    !offer ||
    !status ||
    !isOutOfStock ||
    mainImage.length === 0 ||
    images.length === 0
  ) {
    throw new AppError('All fields are required', 400);
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

  // 9) Create Product
  let product = await Product.create({
    mainImage: imageResult.secure_url,
    mainImageId: imageResult.public_id,
    images: imagesLink,
    imagesId,
    name,
    description,
    category,
    price,
    oldPrice,
    color,
    size,
    user: req.user._id,
    quantity,
    quality,
    isPopular,
    sold,
    offer,
    status,
    isOutOfStock
  });

  // 10) Populate User
  product = await Product.findById(product._id).populate('user');

  // 11) If Everything is OK, Send Data
  return product;
});

export const updateProductDetails = catchAsync(async (req) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  // 1) Check If Product Already Exist
  if (!product) {
    throw new AppError(`No Product Found With This ID: ${id}`, 404);
  }

  // 2) Update Product By It's ID
  const result = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  // 3) If Everything is OK, Send Result
  return result;
});

export const updateProductMainImage = catchAsync(async (req) => {
  let mainImage = req.files;
  const { id } = req.params;

  // 1) Check If Image Provided
  if (mainImage.length === 0) {
    throw new AppError(`Please Insert an Image`, 400);
  }

  // 2) Check If Product Already Exist
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(`No Product Found With This ID: ${id}`, 404);
  }

  // 3) Make Array Of Main Image (Single Image)
  mainImage = req.files.filter((image) => image.fieldname === 'mainImage');

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
  const result = await Product.findByIdAndUpdate(id, productBody, {
    new: true,
    runValidators: true
  });

  // 9) If Everything is OK, Send Result
  return result;
});

export const updateProductImages = catchAsync(async (req) => {
  let images = req.files;
  const { id } = req.params;

  // 1) Check If Images Provided
  if (images.length === 0) {
    throw new AppError('Please Insert one image or more', 400);
  }

  // 2) Check If Product Already Exist
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(`No Product Found With This ID: ${id}`, 404);
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
  const result = await Product.findByIdAndUpdate(id, productBody, {
    new: true,
    runValidators: true
  });

  // 12) If Everything is OK, Send Result
  return result;
});

export const deleteProduct = catchAsync(async (req) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  // 1) Check If Product Already Exist
  if (!product) {
    throw new AppError(`No Product Found With This ID: ${id}`, 404);
  }

  // 2) Delete Product Using It's ID
  await Product.findByIdAndDelete(id);
});
