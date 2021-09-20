// Utils
import catchAsync from '../utils/catchAsync';

// Models
import { Cart, Product } from '../models/index';

/**
 * @desc    Add Product To Cart
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @param   { Number } quantity - Product quantity
 * @param   { String } selectedColor - Selected Color
 * @param   { String } selectedSize - Selected Size
 * @returns { Object<type|message|statusCode|cart> }
 */
export const addProductToCart = catchAsync(
  async (email, productId, quantity, selectedColor, selectedSize) => {
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

    const { priceAfterDiscount } = product;

    // 2) Check if cart exist
    if (cart) {
      // Find product index in the cart
      const indexFound = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      // Check product index
      if (indexFound !== -1 && quantity <= 0) {
        cart.items.splice(indexFound, 1);
      } else if (
        indexFound !== -1 &&
        cart.items[indexFound].selectedColor.toString() ===
          selectedColor.toString() &&
        cart.items[indexFound].selectedSize.toString() ===
          selectedSize.toString()
      ) {
        // In case product exist in the cart and have the same color and size.
        cart.items[indexFound].totalProductQuantity += quantity;
        cart.items[indexFound].totalProductPrice +=
          priceAfterDiscount * quantity;
        cart.totalQuantity += quantity;
        cart.totalPrice += priceAfterDiscount * quantity;
      } else if (quantity > 0) {
        // In case product doesn't exist & there is other products in the cart
        // then push the new product to the items array in the cart
        // Update totalQuantity & totalPrice
        cart.items.push({
          product: productId,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          totalProductQuantity: quantity,
          totalProductPrice: priceAfterDiscount * quantity
        });

        cart.totalQuantity += quantity;
        cart.totalPrice += priceAfterDiscount * quantity;
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
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          totalProductQuantity: quantity,
          totalProductPrice: priceAfterDiscount * quantity
        }
      ],
      totalQuantity: quantity,
      totalPrice: priceAfterDiscount * quantity
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
 * @param   { String } selectedColor - Selected Color
 * @param   { String } selectedSize - Selected Size
 * @returns { Object<type|message|statusCode|cart> }
 */
export const reduceByOne = catchAsync(
  async (email, productId, selectedColor, selectedSize) => {
    const cart = await Cart.findOne({ email });
    const product = await Product.findById(productId);
    const { priceAfterDiscount } = product;

    // 1) Check if cart already exist
    if (!cart) {
      return {
        type: 'Error',
        message: 'noCartForUser',
        statusCode: 404
      };
    }

    // 2) Find product index inside cart
    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === productId.toString()) a.push(i);
      return a;
    }, []);

    // 3) Check if product doesn't exist in the cart
    if (indexesFound === -1) {
      return {
        type: 'Error',
        message: `noProductInCartWithID`,
        statusCode: 404
      };
    }

    // 4) Update cart & product data
    for (const indexFound of indexesFound) {
      if (
        cart.items[indexFound].totalProductQuantity === 1 &&
        cart.items[indexFound].selectedColor._id.toString() ===
          selectedColor.toString() &&
        cart.items[indexFound].selectedSize._id.toString() ===
          selectedSize.toString()
      ) {
        cart.items.splice(indexFound, 1);
        cart.totalQuantity -= 1;
        cart.totalPrice -= priceAfterDiscount;
      } else if (
        cart.items[indexFound].selectedColor._id.toString() ===
          selectedColor.toString() &&
        cart.items[indexFound].selectedSize._id.toString() ===
          selectedSize.toString()
      ) {
        const updatedProductTotalQuantity =
          cart.items[indexFound].totalProductQuantity - 1;
        const updatedProductTotalPrice =
          cart.items[indexFound].totalProductPrice - priceAfterDiscount;
        const updatedCartTotalQuantity = cart.totalQuantity - 1;
        const updatedCartTotalPrice = cart.totalPrice - priceAfterDiscount;

        cart.items[indexFound].totalProductQuantity =
          updatedProductTotalQuantity;
        cart.items[indexFound].totalProductPrice = updatedProductTotalPrice;
        cart.totalQuantity = updatedCartTotalQuantity;
        cart.totalPrice = updatedCartTotalPrice;
      }
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
  }
);

/**
 * @desc    Increase Product Quantity By One
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @param   { String } selectedColor - Selected Color
 * @param   { String } selectedSize - Selected Size
 * @returns { Object<type|message|statusCode|cart> }
 */
export const increaseByOne = catchAsync(
  async (email, productId, selectedColor, selectedSize) => {
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

    const { priceAfterDiscount } = product;

    // 2) Check if cart doesn't exist
    if (!cart) {
      return {
        type: 'Error',
        message: 'noCartForUser',
        statusCode: 404
      };
    }

    // 3) Find products indexes inside cart
    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === productId.toString()) a.push(i);
      return a;
    }, []);

    // 4) Check if product doesn't exist in the cart
    if (indexesFound.length === 0) {
      return {
        type: 'Error',
        message: 'noProductInCartWithID',
        statusCode: 404
      };
    }

    // 5) Update cart & product data
    for (const indexFound of indexesFound) {
      if (
        cart.items[indexFound].selectedColor._id.toString() ===
          selectedColor.toString() &&
        cart.items[indexFound].selectedSize._id.toString() ===
          selectedSize.toString()
      ) {
        const updatedProductTotalQuantity =
          cart.items[indexFound].totalProductQuantity + 1;
        const updatedProductTotalPrice =
          cart.items[indexFound].totalProductPrice + priceAfterDiscount;
        const updatedCartTotalQuantity = cart.totalQuantity + 1;
        const updatedCartTotalPrice = cart.totalPrice + priceAfterDiscount;

        if (updatedProductTotalQuantity <= 0 && updatedProductTotalPrice <= 0) {
          cart.items.splice(indexFound, 1);
        } else {
          cart.items[indexFound].totalProductQuantity =
            updatedProductTotalQuantity;
          cart.items[indexFound].totalProductPrice = updatedProductTotalPrice;
          cart.totalQuantity = updatedCartTotalQuantity;
          cart.totalPrice = updatedCartTotalPrice;
        }
      }
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
  }
);

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
 * @param   { String } selectedColor - Selected Color
 * @param   { String } selectedSize - Selected Size
 * @returns { Object<type|message|statusCode|cart> }
 */
export const deleteItem = catchAsync(
  async (email, productId, selectedColor, selectedSize) => {
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

    const indexesFound = cart.items.reduce((a, e, i) => {
      if (e.product.toString() === productId.toString()) a.push(i);
      return a;
    }, []);

    for (const indexFound of indexesFound) {
      if (
        cart.items[indexFound].selectedColor._id.toString() ===
          selectedColor.toString() &&
        cart.items[indexFound].selectedSize._id.toString() ===
          selectedSize.toString()
      ) {
        const totalPrice =
          cart.totalPrice - cart.items[indexFound].totalProductPrice;
        const totalQuantity =
          cart.totalQuantity - cart.items[indexFound].totalProductQuantity;

        // await cart.children.id(itemId).remove();

        // 3) Update cart by deleting product
        // eslint-disable-next-line no-await-in-loop
        cart = await Cart.findOneAndUpdate(
          { email },
          {
            $pull: {
              items: {
                product: productId,
                selectedColor: selectedColor,
                selectedSize: selectedSize
              }
            },
            totalPrice,
            totalQuantity
          },
          { new: true }
        );
      }
    }

    // 4) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulDeleteItemFromCart',
      statusCode: 200,
      cart
    };
  }
);
