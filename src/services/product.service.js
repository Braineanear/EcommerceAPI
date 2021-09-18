// Utils
import catchAsync from '../utils/catchAsync';
import dataUri from '../utils/datauri';
import APIFeatures from '../utils/apiFeatures';
import { uploadFile, destroyFile } from '../utils/cloudinary';

// Model
import { Product, Color, Size } from '../models/index';

/**
 * @desc    Query products
 * @param   { Object } req - Request object
 * @returns { Object<type|message|statusCode|products> }
 */
export const queryProducts = catchAsync(async (req) => {
  const populateQuery = [
    { path: 'colors', select: 'color' },
    { path: 'sizes', select: 'size' }
  ];

  const products = await APIFeatures(req, Product, populateQuery);

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
  const populateQuery = [
    { path: 'colors', select: 'color' },
    { path: 'sizes', select: 'size' }
  ];

  const product = await Product.findById(productId)
    .populate(populateQuery)
    .lean();

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
    colors,
    sizes,
    quantity,
    sold,
    isOutOfStock
  } = body;

  const mainImage = files.filter((image) => image.fieldname === 'mainImage');
  const images = files.filter((image) => image.fieldname === 'images');

  // 1) Check if there any empty field
  if (
    !name ||
    !description ||
    !category ||
    !price ||
    !priceDiscount ||
    !colors ||
    !sizes ||
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

  const folderName = `Products/${name.trim().split(' ').join('')}`;

  // 2) Upload images to cloudinary
  const imagesPromises = images.map((image) =>
    uploadFile(dataUri(image).content, folderName)
  );
  const imagesResult = await Promise.all(imagesPromises);
  const imageResult = await uploadFile(
    dataUri(mainImage[0]).content,
    folderName
  );

  const imagesLink = [];
  const imagesId = [];

  // 3) Push images links & images IDs to the arrays
  imagesResult.forEach((image) => {
    imagesLink.push(image.secure_url);
    imagesId.push(image.public_id);
  });

  let priceAfterDiscount = Number(price);

  if (priceDiscount !== 0) {
    priceAfterDiscount =
      Number(price) - (Number(price) / 100) * Number(priceDiscount);
  }

  // 4) Create product
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
    seller,
    quantity: Number(quantity),
    sold: Number(sold),
    isOutOfStock
  });

  // 5) Convert colors and sizes string into an array
  const colorsArray = colors.split(',').map((color) => color.trim());
  const sizesArray = sizes.split(',').map((size) => size.trim());
  const sizesDocIds = [];
  const colorsDocIds = [];

  /*
    6) Map through the colors and sizes array and check if there is a color or size document already exist in the colors or sizes collection.

    If there is no document then create new one and push it's id into the colorsDocIds array or into the sizesDocIds array.

    If the color or sizes document already exist then push the document id into the colorsDocIds or sizesDocIds array and push the product id into the color or sizes document product field and then save the document updates.

    I used Promise.all with map cause it turns an array of promises into a single promise that, if things work, resolves into the array you want.
  */
  await Promise.all(
    colorsArray.map(async (color) => {
      const colorDocument = await Color.findOne({ color });

      if (!colorDocument) {
        const newColor = await Color.create({ product: product.id, color });
        colorsDocIds.push(newColor.id);
      } else {
        colorsDocIds.push(colorDocument.id);
        colorDocument.product.push(product.id);
        await colorDocument.save();
      }
    })
  );

  await Promise.all(
    sizesArray.map(async (size) => {
      const sizeDocument = await Size.findOne({ size });

      if (!sizeDocument) {
        const newSize = await Size.create({ product: product.id, size });
        sizesDocIds.push(newSize.id);
      } else {
        sizesDocIds.push(sizeDocument.id);
        sizeDocument.product.push(product.id);
        await sizeDocument.save();
      }
    })
  );

  // 7) Update Product colors and sizes fields with the new array of color ids and size ids
  product.colors = colorsDocIds;
  product.sizes = sizesDocIds;

  await product.save();

  // 8) If everything is OK, send data
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
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @returns { Object<type|message|statusCode|product> }
 */
export const updateProductDetails = catchAsync(
  async (productId, sellerId, body) => {
    const product = await Product.findById(productId);

    // 1) Check if product doesn't exist
    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    // 2) Check if user isn't the owner of product
    if (sellerId.toString() !== product.seller.toString()) {
      return {
        type: 'Error',
        message: 'notSeller',
        statusCode: 403
      };
    }

    // 3) Check if user try to update colors or sizes fields
    if (body.colors || body.sizes) {
      return {
        type: 'Error',
        message: 'notColorOrSizesRoute',
        statusCode: 401
      };
    }

    // 3) Update product by it's ID
    const result = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true
    });

    // 4) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulProductDetails',
      statusCode: 200,
      result
    };
  }
);

/**
 * @desc    Update Product Color
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } color - Product color
 * @returns { Object<type|message|statusCode|color> }
 */
export const addProductColor = catchAsync(
  async (productId, sellerId, color) => {
    const product = await Product.findById(productId);

    // 1) Check if product doesn't exist
    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    // 2) Check if user isn't the owner of the product
    if (sellerId.toString() !== product.seller.toString()) {
      return {
        type: 'Error',
        message: 'notSeller',
        statusCode: 403
      };
    }

    let colorDocument = await Color.findOne({ product: productId, color });

    // 3) Check if color already exist
    if (colorDocument) {
      return {
        type: 'Error',
        message: 'colorExists',
        statusCode: 401
      };
    }

    // 4) Create new color
    colorDocument = await Color.create({ product: productId, color });

    product.colors.push(colorDocument.id);

    await product.save();

    // 5) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulAddProductColor',
      statusCode: 200,
      color: colorDocument
    };
  }
);

/**
 * @desc    Update Product Size
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } size - Product size
 * @returns { Object<type|message|statusCode|size> }
 */
export const addProductSize = catchAsync(async (productId, sellerId, size) => {
  const product = await Product.findById(productId);

  // 1) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      message: 'noProductFound',
      statusCode: 404
    };
  }

  // 2) Check if user isn't the owner of the product
  if (sellerId.toString() !== product.seller.toString()) {
    return {
      type: 'Error',
      message: 'notSeller',
      statusCode: 403
    };
  }

  let sizeDocument = await Size.findOne({ product: productId, size });

  // 3) Check if size already exist
  if (sizeDocument) {
    return {
      type: 'Error',
      message: 'sizeExists',
      statusCode: 401
    };
  }

  // 4) Create new size
  sizeDocument = await Size.create({ product: productId, size });

  product.sizes.push(sizeDocument.id);

  await product.save();

  // 5) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulAddProductSize',
    statusCode: 200,
    size: sizeDocument
  };
});

/**
 * @desc    Delete Product Color
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } color - Product color
 * @returns { Object<type|message|statusCode> }
 */
export const deleteProductColor = catchAsync(
  async (productId, sellerId, color) => {
    const product = await Product.findById(productId);

    // 1) Check if product doesn't exist
    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    // 2) Check if user isn't the owner of the product
    if (sellerId.toString() !== product.seller.toString()) {
      return {
        type: 'Error',
        message: 'notSeller',
        statusCode: 403
      };
    }

    const colorDocument = await Color.findOne({ product: productId, color });

    // 3) Check if color doesn't exist
    if (!colorDocument) {
      return {
        type: 'Error',
        message: 'noColorExists',
        statusCode: 404
      };
    }

    product.colors = product.colors.filter(
      (item) => item !== colorDocument.color
    );

    await product.save();

    // 4) Delete color
    await Color.findOneAndDelete({ product: productId, color });

    // 5) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulDeleteProductColor',
      statusCode: 200
    };
  }
);

/**
 * @desc    Delete Product Size
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } size - Product size
 * @returns { Object<type|message|statusCode> }
 */
export const deleteProductSize = catchAsync(
  async (productId, sellerId, size) => {
    const product = await Product.findById(productId);

    // 1) Check if product doesn't exist
    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    // 2) Check if user isn't the owner of the product
    if (sellerId.toString() !== product.seller.toString()) {
      return {
        type: 'Error',
        message: 'notSeller',
        statusCode: 403
      };
    }

    const sizeDocument = await Size.findOne({ product: productId, size });

    // 3) Check if size doesn't exist
    if (!sizeDocument) {
      return {
        type: 'Error',
        message: 'noSizeExists',
        statusCode: 404
      };
    }

    product.sizes = product.sizes.filter((item) => item !== sizeDocument.size);

    await product.save();

    // 4) Delete size
    await Size.findOneAndDelete({ product: productId, size });

    // 5) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulDeleteProductSize',
      statusCode: 200
    };
  }
);

/**
 * @desc    Update Product Main Image
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { Object } image - Product main image
 * @returns { Object<type|message|statusCode|product> }
 */
export const updateProductMainImage = catchAsync(
  async (productId, sellerId, image) => {
    // 1) Check if image provided
    if (image.length === 0) {
      return {
        type: 'Error',
        message: 'selectImage',
        statusCode: 400
      };
    }

    const product = await Product.findById(productId);

    // 2) Check if product doesn't exist
    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    // 3) Check if the user isn't the owner of the product
    if (sellerId.toString() !== product.seller.toString()) {
      return {
        type: 'Error',
        message: 'notSeller',
        statusCode: 403
      };
    }

    let mainImage = image.filter((img) => img.fieldname === 'mainImage');

    const folderName = `Products/${product.name.trim().split(' ').join('')}`;
    const productMainImageID = product.mainImageId;

    // 4) Destroy Image
    destroyFile(productMainImageID);

    // 5) Upload image to cloudinary
    mainImage = await uploadFile(
      dataUri(mainImage[0]).content,
      folderName,
      600
    );

    const productBody = {
      mainImage: mainImage.secure_url,
      mainImageId: mainImage.public_id
    };

    // 6) Update product using it's ID
    await Product.findByIdAndUpdate(productId, productBody, {
      new: true,
      runValidators: true
    });

    // 7) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulProductMainImage',
      statusCode: 200
    };
  }
);

/**
 * @desc    Update Product Images
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { Object } images - Product images
 * @returns { Object<type|message|statusCode|product> }
 */
export const updateProductImages = catchAsync(
  async (productId, sellerId, images) => {
    // 1) Check if images provided
    if (images.length === 0) {
      return {
        type: 'Error',
        message: 'selectImages',
        statusCode: 400
      };
    }

    const product = await Product.findById(productId);

    // 2) Check if product doesn't exist
    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    // 3) Check if user isn't the owner of the product
    if (sellerId.toString() !== product.seller.toString()) {
      return {
        type: 'Error',
        message: 'notSeller',
        statusCode: 403
      };
    }

    images = images.filter((image) => image.fieldname === 'images');

    const folderName = `Products/${product.name.trim().split(' ').join('')}`;
    const imagesLinks = [];
    const imagesIDs = [];
    const productImagesID = product.imagesId;

    // 4) Destroy Image
    productImagesID.forEach((image) => destroyFile(image));

    // 5) Upload images to cloudinary
    const imagesPromises = images.map((image) =>
      uploadFile(dataUri(image).content, folderName, 600)
    );

    const imagesResult = await Promise.all(imagesPromises);

    // 6) Push images links & IDs to the arrays
    imagesResult.forEach((image) => {
      imagesLinks.push(image.secure_url);
      imagesIDs.push(image.public_id);
    });

    const productBody = {
      images: imagesLinks,
      ImagesId: imagesIDs
    };

    // 7) Update product using it's ID
    await Product.findByIdAndUpdate(productId, productBody, {
      new: true,
      runValidators: true
    });

    // 8) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulProductSubImages',
      statusCode: 200
    };
  }
);

/**
 * @desc    Delete Product Using It's ID
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @returns { Object<type|message|statusCode> }
 */
export const deleteProduct = catchAsync(async (productId, sellerId) => {
  const product = await Product.findById(productId);

  // 1) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      message: `noProductFound`,
      statusCode: 404
    };
  }

  // 2) Check if user isn't the owner of the product
  if (sellerId.toString() !== product.seller.toString()) {
    return {
      type: 'Error',
      message: 'notSeller',
      statusCode: 403
    };
  }

  // 3) Delete product using it's ID
  await Product.findByIdAndDelete(productId);

  // 4) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulProductDelete',
    statusCode: 200
  };
});

/**
 * @desc    Get Products Statics
 * @return  { Array<Stats> }
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
