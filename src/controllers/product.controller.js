// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import dataUri from '../utils/datauri';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Model
import { Product } from '../models/index';

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({}).populate('category', 'name');

  if (!products) {
    return next(new AppError('No Products Found', 404));
  }

  return res.status(200).json({
    status: 'success',
    message: 'Found Products',
    products
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate('user');

  if (!product) {
    return next(new AppError(`No Product Found With This ID: ${id}`, 404));
  }

  return res.status(200).json({
    status: 'success',
    message: 'Found Product',
    product
  });
});

export const addProduct = catchAsync(async (req, res, next) => {
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

  const mainImage = req.files.filter(
    (image) => image.fieldname === 'mainImage'
  );
  const images = req.files.filter((image) => image.fieldname === 'images');

  const folderName = `Products/${name.trim().split(' ').join('')}`;
  const imagesLink = [];
  const imagesId = [];

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
    return next(new AppError('All fields are required', 400));
  }

  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName)
  );

  const imagesResult = await Promise.all(imagesPromises);
  const imageResult = await uploadFile(
    dataUri(mainImage[0]).content,
    folderName
  );

  imagesResult.forEach((image) => {
    imagesLink.push(image.secure_url);
    imagesId.push(image.public_id);
  });

  let result = await Product.create({
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

  result = await Product.findById(result._id);

  return res.status(200).json({
    status: 'success',
    message: 'Category Created Successfully',
    result
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
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

  const mainImage = req.files.filter(
    (image) => image.fieldname === 'mainImage'
  );
  const images = req.files.filter((image) => image.fieldname === 'images');

  const folderName = `Products/${name.trim().split(' ').join('')}`;
  const imagesLink = [];
  const imagesId = [];

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
    return next(new AppError('All fields are required', 400));
  }

  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError(`No Product Found With This ID: ${id}`, 404));
  }

  const productImagesID = product.imagesId;
  const productMainImageID = product.mainImageId;

  productImagesID.forEach((image) => destroyFile(image));
  destroyFile(productMainImageID);

  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName)
  );

  const imagesResult = await Promise.all(imagesPromises);
  const imageResult = await uploadFile(
    dataUri(mainImage[0]).content,
    folderName
  );

  imagesResult.forEach((image) => {
    imagesLink.push(image.secure_url);
    imagesId.push(image.public_id);
  });

  let result = await Product.create({
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

  result = await Product.findById(result._id);

  return res.status(200).json({
    status: 'success',
    message: 'Category Updated Successfully',
    result
  });
});
