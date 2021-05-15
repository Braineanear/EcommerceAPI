// Utils
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

// Models
import { Cart, Product } from '../models/index';

/**
 * Add Product To Cart
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @param     {Number}    quantity
 * @returns   {Promise<Cart>}
 */
export const addProductToCart = catchAsync(
  async (email, productId, quantity) => {
    // 1) Get Cart Using User Email
    let cart = await Cart.findOne({ email });

    // 2) Get Product Using It's ID
    const product = await Product.findById(productId);

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
        throw new AppError('Invalid request', 400);
      }

      // 3) Save Cart Data
      cart = await cart.save();

      // 4) If Everything is OK, Send Cart
      return cart;
    }

    // 5) In Case User Doesn't Have Cart, Then Create New Cart For The User
    const cartData = {
      email,
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
    return cart;
  }
);

/**
 * Subtract Quantity From Product In Cart
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @param     {Number}    quantity
 * @returns   {Promise<Cart>}
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
      throw new AppError('Quantity cannot be less than or equal to zero', 400);
    }

    // 5) Check If Cart Already Exist
    if (!cart) {
      throw new AppError(
        (`No Cart Found For User With The Email: ${email}`, 404)
      );
    }

    // 6) Find Product Index Inside Cart
    const indexFound = cart.items.findIndex(
      (item) => item.product.name === product.name
    );

    // 7) Check If Product Doesn't Exist In The Cart
    if (indexFound === -1) {
      throw new AppError(
        `No Product Found With This ID: ${productId} In The Cart`,
        404
      );
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
    return cart;
  }
);

/**
 * Reduce Product Quantity By One
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @returns   {Promise<Cart>}
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
    throw new AppError(
      (`No Cart Found For User With The Email: ${email}`, 404)
    );
  }

  // 5) Find Product Index Inside Cart
  const indexFound = cart.items.findIndex(
    (item) => item.product.name === product.name
  );

  // 6) Check If Product Doesn't Exist In The Cart
  if (indexFound === -1) {
    throw new AppError(
      `No Product Found With This ID: ${productId} In The Cart`,
      404
    );
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
  return cart;
});

/**
 * Increase Product Quantity By One
 * @param     {String}    email
 * @param     {ObjectId}  productId
 * @returns   {Promise<Cart>}
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
    throw new AppError(
      (`No Cart Found For User With The Email: ${email}`, 404)
    );
  }

  // 5) Find Product Index Inside Cart
  const indexFound = cart.items.findIndex(
    (item) => item.product.name === product.name
  );

  // 6) Check If Product Doesn't Exist In The Cart
  if (indexFound === -1) {
    throw new AppError(
      `No Product Found With This ID: ${productId} In The Cart`,
      404
    );
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
  return cart;
});

/**
 * Get Cart
 * @param     {String}    email
 * @returns   {Promise<Cart>}
 */
export const queryCart = catchAsync(async (email) => {
  // 1) Find Cart Using User Email
  const cart = await Cart.findOne({ email });

  // 2) Check If Cart Doesn't Exist
  if (!cart) {
    throw new AppError(
      `No Cart Found For The User With This Email: ${email}`,
      404
    );
  }

  // 3) If Everything is OK, Send Cart
  return cart;
});

/**
 * Delete Cart
 * @param     {String}    email
 */
export const deleteCart = catchAsync(async (email) => {
  // 1) Get Cart Using User Email
  const cart = await Cart.findOne({ email });

  // 2) Check If Cart Doesn't Exist
  if (!cart) {
    throw new AppError(
      `No Cart Found For The User With This Email: ${email}`,
      404
    );
  }

  // 3) Delete Cart
  await Cart.findOneAndDelete({ email });
});

/**
 * Delete Cart Item
 * @param     {String}    email
 * @param     {String}    productId
 * @returns   {Promise<Cart>}
 */
export const deleteItem = catchAsync(async (email, productId) => {
  // 1) Get Cart Using User Email
  let cart = await Cart.findOne({ email });

  // 2) Check If Cart Doesn't Exist
  if (!cart) {
    throw new AppError(
      `No Cart Found For The User With This Email: ${email}`,
      404
    );
  }

  // 3) Get Product Using It's ID
  const product = await Product.findById(productId);

  // 4) Check If Product Doesn't Exist
  if (!product) {
    throw new AppError(`No Product Found With This ID: ${productId}`, 404);
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
  return cart;
});
