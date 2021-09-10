// Utils
import catchAsync from '../utils/catchAsync';

// Models
import { Cart, Product } from '../models/index';

/**
 * @desc    Add Product To Cart
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @param   { Number } quantity - Product quantity
 * @returns { Object<type|message|statusCode|cart> }
 */
export const addProductToCart = catchAsync(
  async (email, productId, quantity) => {
    const cart = await Cart.findOne({ email });
    const product = await Product.findById(productId);

    // 1) Check if product doesn't exist
    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    const { price } = product;

    // 2) Check if cart exist
    if (cart) {
      // Find product index in the cart
      const indexFound = cart.items.findIndex(
        (item) => item.product.name === product.name
      );

      // Check product index
      if (indexFound !== -1 && quantity <= 0) {
        cart.items.splice(indexFound, 1);
      } else if (indexFound !== -1) {
        // In case product exist in the cart
        cart.items[indexFound].totalProductQuantity += quantity;
        cart.items[indexFound].totalProductPrice += price * quantity;
        cart.totalQuantity += quantity;
        cart.totalPrice += price * quantity;
      } else if (quantity > 0) {
        // In case product doesn't exist & there is other products in the cart
        // then push the new product to the items array in the cart
        // Update totalQuantity & totalPrice
        cart.items.push({
          product: productId,
          totalProductQuantity: quantity,
          totalProductPrice: price * quantity
        });

        cart.totalQuantity += quantity;
        cart.totalPrice += price * quantity;
      } else {
        return {
          type: 'Error',
          message: 'invalidRequest',
          statusCode: 400
        };
      }

      // Save cart data
      await cart.save();

      // If everything is OK, send cart
      return {
        type: 'Success',
        message: 'successfulItemAddToCart',
        statusCode: 200,
        cart
      };
    }

    // 3) In case user doesn't have cart, then create new cart for the user
    const cartData = {
      email,
      items: [
        {
          product: productId,
          totalProductQuantity: quantity,
          totalProductPrice: price * quantity
        }
      ],
      totalQuantity: quantity,
      totalPrice: price * quantity
    };

    // 4) Create new cart
    const createdCart = await Cart.create(cartData);

    // 5) If everything is OK, send cart
    return {
      type: 'Success',
      message: 'successfulItemAddToCart',
      statusCode: 200,
      cart: createdCart
    };
  }
);

/**
 * @desc    Reduce Product Quantity By One
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @returns { Object<type|message|statusCode|cart> }
 */
export const reduceByOne = catchAsync(async (email, productId) => {
  const cart = await Cart.findOne({ email });
  const product = await Product.findById(productId);
  const { price } = product;

  // 1) Check if cart already exist
  if (!cart) {
    return {
      type: 'Error',
      message: 'noCartForUser',
      statusCode: 404
    };
  }

  // 2) Find product index inside cart
  const indexFound = cart.items.findIndex(
    (item) => item.product.toString() === product._id.toString()
  );

  // 3) Check if product doesn't exist in the cart
  if (indexFound === -1) {
    return {
      type: 'Error',
      message: `noProductInCartWithID`,
      statusCode: 404
    };
  }

  // 4) Update cart & product data
  const updatedProductTotalQuantity =
    cart.items[indexFound].totalProductQuantity - 1;
  const updatedProductTotalPrice =
    cart.items[indexFound].totalProductPrice - price;
  const updatedCartTotalQuantity = cart.totalQuantity - 1;
  const updatedCartTotalPrice = cart.totalPrice - price;

  if (updatedProductTotalQuantity <= 0 && updatedProductTotalPrice <= 0) {
    cart.items.splice(indexFound, 1);
  } else {
    cart.items[indexFound].totalProductQuantity = updatedProductTotalQuantity;
    cart.items[indexFound].totalProductPrice = updatedProductTotalPrice;
    cart.totalQuantity = updatedCartTotalQuantity;
    cart.totalPrice = updatedCartTotalPrice;
  }

  // 5) Save updated data
  await cart.save();

  // 6) Find cart using it's ID
  const updatedCart = await Cart.findById(cart._id);

  // 7) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulReduceByOne',
    statusCode: 200,
    cart: updatedCart
  };
});

/**
 * @desc    Increase Product Quantity By One
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @returns { Object<type|message|statusCode|cart> }
 */
export const increaseByOne = catchAsync(async (email, productId) => {
  let cart = await Cart.findOne({ email });
  const product = await Product.findById(productId);

  // 1) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      statusCode: 404,
      message: 'noProductFound'
    };
  }

  const { price } = product;

  // 2) Check if cart doesn't exist
  if (!cart) {
    return {
      type: 'Error',
      message: 'noCartForUser',
      statusCode: 404
    };
  }

  // 3) Find product index inside cart
  const indexFound = cart.items.findIndex(
    (item) => item.product.toString() === product._id.toString()
  );

  // 4) Check if product doesn't exist in the cart
  if (indexFound === -1) {
    return {
      type: 'Error',
      message: 'noProductInCartWithID',
      statusCode: 404
    };
  }

  // 5) Update cart & product data
  const updatedProductTotalQuantity =
    cart.items[indexFound].totalProductQuantity + 1;
  const updatedProductTotalPrice =
    cart.items[indexFound].totalProductPrice + price;
  const updatedCartTotalQuantity = cart.totalQuantity + 1;
  const updatedCartTotalPrice = cart.totalPrice + price;

  if (updatedProductTotalQuantity <= 0 && updatedProductTotalPrice <= 0) {
    cart.items.splice(indexFound, 1);
  } else {
    cart.items[indexFound].totalProductQuantity = updatedProductTotalQuantity;
    cart.items[indexFound].totalProductPrice = updatedProductTotalPrice;
    cart.totalQuantity = updatedCartTotalQuantity;
    cart.totalPrice = updatedCartTotalPrice;
  }

  // 6) Save updated data
  await cart.save();

  // 7) Find cart using it's ID
  const updatedCart = await Cart.findById(cart._id);

  // 8) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulIncreaseByOne',
    statusCode: 200,
    cart: updatedCart
  };
});

/**
 * @desc    Get Cart
 * @param   { String } email - User email address
 * @returns { Object<type|message|statusCode|cart> }
 */
export const queryCart = catchAsync(async (email) => {
  const cart = await Cart.findOne({ email });

  // 1) Check if cart doesn't exist
  if (!cart) {
    return {
      type: 'Error',
      message: 'noCartForUser',
      statusCode: 404
    };
  }

  // 2) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulCartFound',
    statusCode: 200,
    cart
  };
});

/**
 * @desc    Delete Cart
 * @param   { String } email - User email address
 * @return  { Object<type|message|statusCode> }
 */
export const deleteCart = catchAsync(async (email) => {
  const cart = await Cart.findOne({ email });

  // 1) Check if cart doesn't exist
  if (!cart) {
    return {
      type: 'Error',
      message: 'noCartForUser',
      statusCode: 404
    };
  }

  // 2) Delete cart
  await Cart.findOneAndDelete({ email });

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulCartDelete',
    statusCode: 200
  };
});

/**
 * @desc    Delete Cart Item
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @returns { Object<type|message|statusCode|cart> }
 */
export const deleteItem = catchAsync(async (email, productId) => {
  let cart = await Cart.findOne({ email });

  // 1) Check if cart doesn't exist
  if (!cart) {
    return {
      type: 'Error',
      message: 'noCartForUser',
      statusCode: 404
    };
  }

  const product = await Product.findById(productId);

  // 2) Check if product doesn't exist
  if (!product) {
    return {
      type: 'Error',
      message: 'noProductInCartWithID',
      statusCode: 404
    };
  }

  const indexFound = cart.items.findIndex(
    (item) => item.product.name === product.name
  );

  const totalPrice = cart.totalPrice - cart.items[indexFound].totalProductPrice;
  const totalQuantity =
    cart.totalQuantity - cart.items[indexFound].totalProductQuantity;

  // 3) Update cart by deleting product
  cart = await Cart.findOneAndUpdate(
    { email },
    {
      $pull: { items: { product: productId } },
      totalPrice,
      totalQuantity
    },
    { new: true }
  );

  // 4) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulDeleteItemFromCart',
    statusCode: 200,
    cart
  };
});
