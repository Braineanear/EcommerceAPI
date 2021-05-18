// Utils
import catchAsync from '../utils/catchAsync';

// Models
import { Cart, Product } from '../models/index';

/**
 * Add Product To Cart
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @param     {Number}    quantity
 * @returns   {Object<type|message|statusCode|cart>}
 */
export const addProductToCart = catchAsync(
  async (user, productId, quantity) => {
    // 1) Get Cart Using User Email
    let cart = await Cart.findOne({ email: user.email });

    // 2) Get Product Using It's ID
    const product = await Product.findById(productId);

    if (!product) {
      return {
        type: 'Error',
        message: `No Product Found With This ID: ${productId}`,
        statusCode: 404
      };
    }

    // 3) Get Product Price
    const { price } = product;

    // 4) Check If Cart Exist
    if (cart) {
      // 1) Find Product Index In The Cart
      const indexFound = cart.items.findIndex(
        (item) => item.product.name === product.name
      );

      // 2) Check If Product Index
      if (indexFound !== -1 && quantity <= 0) {
        cart.items.splice(indexFound, 1);
      } else if (indexFound !== -1) {
        // In Case Product Exist In The Cart
        cart.items[indexFound].totalQuantity += quantity;
        cart.items[indexFound].totalPrice += price * quantity;
        cart.totalQuantity += quantity;
        cart.totalPrice += price * quantity;
      } else if (quantity > 0) {
        // In Case Product Doesn't Exist & There Is Other Products In The Cart
        // Then Push The New Product To The Items Array In The Cart & Update totalQuantity & totalPrice
        cart.items.push({
          product: productId,
          totalQuantity: quantity,
          totalPrice: price * quantity
        });
        cart.totalQuantity += quantity;
        cart.totalPrice += price * quantity;
      } else {
        return {
          type: 'Error',
          message: 'Invalid request',
          statusCode: 400
        };
      }

      // 3) Save Cart Data
      cart = await cart.save();

      // 4) If Everything is OK, Send Cart
      return {
        type: 'Success',
        message: 'Item Added To Cart Successfully',
        statusCode: 200,
        cart
      };
    }

    // 5) In Case User Doesn't Have Cart, Then Create New Cart For The User
    const cartData = {
      email: user.email,
      items: [
        {
          product: productId,
          totalQuantity: quantity,
          totalPrice: price * quantity
        }
      ],
      totalQuantity: quantity,
      totalPrice: price * quantity
    };

    // 6) Create New Cart
    cart = await Cart.create(cartData);

    // 7) We Didnt' Return The Result Of The Created Cart, Because We Want To Populate Product ID
    cart = await Cart.findById(cart._id);

    // 8) If Everything is OK, Send Cart
    return {
      type: 'Success',
      message: 'Item Added To Cart Successfully',
      statusCode: 200,
      cart
    };
  }
);

/**
 * Subtract Quantity From Product In Cart
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @param     {Number}    quantity
 * @returns   {Object<type|message|statusCode|cart>}
 */
export const subtractItemFromCart = catchAsync(
  async (email, productId, quantity) => {
    // 1) Find Cart Using User Email
    let cart = await Cart.findOne({ email });

    // 2) Find Product Using It's ID
    const product = await Product.findById(productId);

    // 3) Get Product Price
    const { price } = product;

    // 4) Check If Quantity Less Than Or Equal To Zero
    if (quantity <= 0) {
      return {
        type: 'Error',
        message: 'Quantity cannot be less than or equal to zero',
        statusCode: 400
      };
    }

    // 5) Check If Cart Already Exist
    if (!cart) {
      return {
        type: 'Error',
        message: `No Cart Found For User With The Email: ${email}`,
        statusCode: 404
      };
    }

    // 6) Find Product Index Inside Cart
    const indexFound = cart.items.findIndex(
      (item) => item.product.name === product.name
    );

    // 7) Check If Product Doesn't Exist In The Cart
    if (indexFound === -1) {
      return {
        type: 'Error',
        message: `No Product Found With This ID: ${productId} In The Cart`,
        statusCode: 404
      };
    }

    // 8) Update Cart & Product Data
    const updatedProductTotalQuantity =
      cart.items[indexFound].totalQuantity - quantity;
    const updatedProductTotalPrice =
      cart.items[indexFound].totalPrice - price * quantity;
    const updatedCartTotalQuantity = cart.totalQuantity - quantity;
    const updatedCartTotalPrice = cart.totalPrice - price * quantity;

    if (updatedProductTotalQuantity <= 0 && updatedProductTotalPrice <= 0) {
      cart.items.splice(indexFound, 1);
    } else {
      cart.items[indexFound].totalQuantity = updatedProductTotalQuantity;
      cart.items[indexFound].totalPrice = updatedProductTotalPrice;
      cart.totalQuantity = updatedCartTotalQuantity;
      cart.totalPrice = updatedCartTotalPrice;
    }

    // 9) Save Updated Data
    cart = await cart.save();

    // 10) Find Cart Using It's ID
    cart = await Cart.findById(cart._id);

    // 11) If Everything is OK, Send Cart
    return {
      type: 'Success',
      message: 'Item Subtracted From Cart Successfully',
      statusCode: 200,
      cart
    };
  }
);

/**
 * Reduce Product Quantity By One
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @returns   {Object<type|message|statusCode|cart>}
 */
export const reduceByOne = catchAsync(async (email, productId) => {
  // 1) Find Cart Using User Email
  let cart = await Cart.findOne({ email });

  // 2) Find Product Using It's ID
  const product = await Product.findById(productId);

  // 3) Get Product Price
  const { price } = product;

  // 4) Check If Cart Already Exist
  if (!cart) {
    return {
      type: 'Error',
      message: `No Cart Found For User With The Email: ${email}`,
      statusCode: 404
    };
  }

  // 5) Find Product Index Inside Cart
  const indexFound = cart.items.findIndex(
    (item) => item.product.name === product.name
  );

  // 6) Check If Product Doesn't Exist In The Cart
  if (indexFound === -1) {
    return {
      type: 'Error',
      message: `No Product Found With This ID: ${productId} In The Cart`,
      statusCode: 404
    };
  }

  // 7) Update Cart & Product Data
  const updatedProductTotalQuantity = cart.items[indexFound].totalQuantity - 1;
  const updatedProductTotalPrice = cart.items[indexFound].totalPrice - price;
  const updatedCartTotalQuantity = cart.totalQuantity - 1;
  const updatedCartTotalPrice = cart.totalPrice - price;

  if (updatedProductTotalQuantity <= 0 && updatedProductTotalPrice <= 0) {
    cart.items.splice(indexFound, 1);
  } else {
    cart.items[indexFound].totalQuantity = updatedProductTotalQuantity;
    cart.items[indexFound].totalPrice = updatedProductTotalPrice;
    cart.totalQuantity = updatedCartTotalQuantity;
    cart.totalPrice = updatedCartTotalPrice;
  }

  // 8) Save Updated Data
  cart = await cart.save();

  // 9) Find Cart Using It's ID
  cart = await Cart.findById(cart._id);

  // 10) If Everything is OK, Send Cart
  return {
    type: 'Success',
    message: 'Item Reduced By One From Cart Successfully',
    statusCode: 200,
    cart
  };
});

/**
 * Increase Product Quantity By One
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @returns   {Object<type|message|statusCode|cart>}
 */
export const increaseByOne = catchAsync(async (email, productId) => {
  // 1) Find Cart Using User Email
  let cart = await Cart.findOne({ email });

  // 2) Find Product Using It's ID
  const product = await Product.findById(productId);

  // 3) Get Product Price
  const { price } = product;

  // 4) Check If Cart Already Exist
  if (!cart) {
    return {
      type: 'Error',
      message: `No Cart Found For User With The Email: ${email}`,
      statusCode: 404
    };
  }

  // 5) Find Product Index Inside Cart
  const indexFound = cart.items.findIndex(
    (item) => item.product.name === product.name
  );

  // 6) Check If Product Doesn't Exist In The Cart
  if (indexFound === -1) {
    return {
      type: 'Error',
      message: `No Product Found With This ID: ${productId} In The Cart`,
      statusCode: 404
    };
  }

  // 7) Update Cart & Product Data
  const updatedProductTotalQuantity = cart.items[indexFound].totalQuantity + 1;
  const updatedProductTotalPrice = cart.items[indexFound].totalPrice + price;
  const updatedCartTotalQuantity = cart.totalQuantity + 1;
  const updatedCartTotalPrice = cart.totalPrice + price;

  if (updatedProductTotalQuantity <= 0 && updatedProductTotalPrice <= 0) {
    cart.items.splice(indexFound, 1);
  } else {
    cart.items[indexFound].totalQuantity = updatedProductTotalQuantity;
    cart.items[indexFound].totalPrice = updatedProductTotalPrice;
    cart.totalQuantity = updatedCartTotalQuantity;
    cart.totalPrice = updatedCartTotalPrice;
  }

  // 8) Save Updated Data
  cart = await cart.save();

  // 9) Find Cart Using It's ID
  cart = await Cart.findById(cart._id);

  // 10) If Everything is OK, Send Cart
  return {
    type: 'Success',
    message: 'Item Increased By One In Cart Successfully',
    statusCode: 200,
    cart
  };
});

/**
 * Get Cart
 * @param     {String}    email
 * @returns   {Object<type|message|statusCode|cart>}
 */
export const queryCart = catchAsync(async (email) => {
  // 1) Find Cart Using User Email
  const cart = await Cart.findOne({ email });

  // 2) Check If Cart Doesn't Exist
  if (!cart) {
    return {
      type: 'Error',
      message: `No Cart Found For The User With This Email: ${email}`,
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Cart
  return {
    type: 'Success',
    message: 'Cart Found Successfully',
    statusCode: 200,
    cart
  };
});

/**
 * Delete Cart
 * @param     {String}    email
 * @return    {Object<type|message|statusCode>}
 */
export const deleteCart = catchAsync(async (email) => {
  // 1) Get Cart Using User Email
  const cart = await Cart.findOne({ email });

  // 2) Check If Cart Doesn't Exist
  if (!cart) {
    return {
      type: 'Error',
      message: `No Cart Found For The User With This Email: ${email}`,
      statusCode: 404
    };
  }

  // 3) Delete Cart
  await Cart.findOneAndDelete({ email });

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'Cart Deleted Successfully',
    statusCode: 200
  };
});

/**
 * Delete Cart Item
 * @param     {String}    email
 * @param     {String}    productId
 * @returns   {Object<type|message|statusCode|cart>}
 */
export const deleteItem = catchAsync(async (email, productId) => {
  // 1) Get Cart Using User Email
  let cart = await Cart.findOne({ email });

  // 2) Check If Cart Doesn't Exist
  if (!cart) {
    return {
      type: 'Error',
      message: `No Cart Found For The User With This Email: ${email}`,
      statusCode: 404
    };
  }

  // 3) Get Product Using It's ID
  const product = await Product.findById(productId);

  // 4) Check If Product Doesn't Exist
  if (!product) {
    return {
      type: 'Error',
      message: `No Product Found With This ID: ${productId}`,
      statusCode: 404
    };
  }

  const indexFound = cart.items.findIndex(
    (item) => item.product.name === product.name
  );

  const totalPrice = cart.totalPrice - cart.items[indexFound].totalPrice;
  const totalQuantity =
    cart.totalQuantity - cart.items[indexFound].totalQuantity;

  // 5) Update Cart By Deleting Product
  cart = await Cart.findOneAndUpdate(
    { email },
    {
      $pull: { items: { product: productId } },
      totalPrice,
      totalQuantity
    },
    { new: true }
  );

  // 6) If Everything is OK, Send Cart
  return {
    type: 'Success',
    message: 'Item Deleted From Cart Successfully',
    statusCode: 200,
    cart
  };
});
