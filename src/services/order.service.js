/* eslint-disable no-await-in-loop */
// Packages
import STRIPE_SDK from 'stripe';
import moment from 'moment';

// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Configs
import config from '../config/config';

// Models
import { Order, Cart, Product } from '../models/index';

const stripe = STRIPE_SDK(config.stripe.secret_key);

/**
 * @desc    Create New Order
 * @param   { Object } body - Body object data
 * @param   { Object } user - An object contains logged in user data
 * @returns { Object<type|message|statusCode|order> }
 */
export const createOrder = catchAsync(async (body, user) => {
  // 1) Extract data from parameters
  const { shippingAddress, paymentMethod, phone } = body;
  const { address, city, country, postalCode } = shippingAddress;

  // 2) Check if user entered all fields
  if (
    !address ||
    !city ||
    !postalCode ||
    !country ||
    !paymentMethod ||
    !phone
  ) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 3) Get user cart
  const cart = await Cart.findOne({ email: user.email });

  // 4) Check if cart doesn't exist
  if (!cart || cart.items.length === 0) {
    return {
      type: 'Error',
      message: 'noCartFound',
      statusCode: 404
    };
  }

  // 4) Check payment method
  if (paymentMethod === 'cash') {
    // 1) If payment method is cash the create new order for the cash method
    const order = await Order.create({
      products: cart.items,
      user: user._id,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      phone
    });

    // 2) Update product sold and quantity fields
    for (const item of cart.items) {
      const { id } = item.product;
      const { totalProductQuantity } = item;
      const product = await Product.findById(id);
      const sold = product.sold + totalProductQuantity;
      const quantity = product.quantity - totalProductQuantity;
      await Product.findByIdAndUpdate(id, { sold, quantity });
    }

    // 3) Delete cart
    await Cart.findByIdAndDelete(cart._id);

    // 4) Remove user discount code
    user.discountCode = '';
    await user.save();

    // 5) If everything is OK, send data
    return {
      type: 'Success',
      message: 'successfulOrderCreate',
      order
    };
  }

  // 5) If payment method is card then extract card data from body
  const { cardNumber, expMonth, expYear, cvc } = body;

  // 6) Check if user entered card data
  if (!cardNumber || !expMonth || !expYear || !cvc) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 7) Create stripe card token
  const token = await stripe.tokens.create({
    card: {
      number: cardNumber,
      exp_month: expMonth,
      exp_year: expYear,
      cvc
    }
  });

  // 8) Create stripe charge
  const charge = stripe.charges.create({
    amount: Math.round(cart.totalPrice),
    currency: 'usd',
    source: token.id,
    description: 'Charge For Products'
  });

  // 9) Create order with payment method card
  const order = await Order.create({
    products: cart.items,
    user: user._id,
    totalPrice: cart.totalPrice,
    isPaid: true,
    paidAt: moment(),
    shippingAddress,
    paymentMethod,
    paymentStripeId: charge.id,
    phone
  });

  // 10) Update product sold and quantity fields
  for (const item of cart.items) {
    const id = item.product;
    const { totalProductQuantity } = item;
    const product = await Product.findById(id);
    const sold = product.sold + totalProductQuantity;
    const quantity = product.quantity - totalProductQuantity;
    await Product.findByIdAndUpdate(id, { sold, quantity });
  }

  // 11) Delete cart
  await Cart.findByIdAndDelete(cart._id);

  // 12) Remove user discount code
  user.discountCode = '';
  await user.save();

  // 13) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulOrderCreate',
    statusCode: 201,
    order
  };
});

/**
 * @desc    Update Order Status
 * @param   { String } status - Order status
 * @param   { String } id - Order ID
 * @returns { Object<type|message|statusCode> }
 */
export const orderStatus = catchAsync(async (status, id) => {
  // 1) All fields are required
  if (!status) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 2) Check if status doesn't meet the enum
  if (
    ![
      'Not Processed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ].includes(status)
  ) {
    return {
      type: 'Error',
      message: 'notInStatusEnum',
      statusCode: 400
    };
  }

  const order = await Order.findById(id);

  // 3) Check if order doesn't exist
  if (!order) {
    return {
      type: 'Error',
      message: 'noOrder',
      statusCode: 404
    };
  }

  // 4) Check if order have been cancelled
  if (status === 'Cancelled') {
    for (const item of order.products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return {
          type: 'Error',
          message: 'noProductFound',
          statusCode: 404
        };
      }

      await Product.findByIdAndUpdate(item.product, {
        quantity: product.quantity + item.totalProductQuantity,
        sold: product.sold - item.totalProductQuantity
      });
    }

    await Order.findByIdAndDelete(id);

    return {
      type: 'Success',
      message: 'successfulOrderCancel',
      statusCode: 200
    };
  }

  // 5) Save order new status
  order.status = status;

  await order.save();

  // 6) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulStatusUpdate',
    statusCode: 200
  };
});

/**
 * @desc    Query Orders
 * @param   { Object } req - Request object
 * @returns { Object<type|message|statusCode|orders> }
 */
export const queryOrders = catchAsync(async (req) => {
  req.query.user = req.user._id;

  // 1) Get all orders
  const orders = await APIFeatures(req, Order);

  // 2) Check of orders doesn't exist
  if (!orders) {
    return {
      type: 'Error',
      message: 'noOrders',
      statusCode: 404
    };
  }

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulOrdersFound',
    statusCode: 200,
    orders
  };
});

/**
 * @desc    Query Order Using It's ID
 * @param   { String } id - Order ID
 * @returns { Object<type|message|statusCode|order> }
 */
export const queryOrder = catchAsync(async (id) => {
  // 1) Get order document using it's ID
  const order = await Order.findById(id);

  // 2) Check if order doesn't exist
  if (!order) {
    return {
      type: 'Error',
      message: 'noOrder',
      statusCode: 404
    };
  }

  // 3) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulOrderFound',
    statusCode: 200,
    order
  };
});

/**
 * @desc    Cancel Order
 * @param   { String } id - Order ID
 * @returns { Object<type|message|statusCode> }
 */
export const cancelOrder = catchAsync(async (id) => {
  // 1) Find order document and delete it
  const order = await Order.findById(id);

  // 2) Check if order doesn't exist
  if (!order) {
    return {
      type: 'Error',
      message: 'noOrder',
      statusCode: 404
    };
  }

  // 3) Increase product quantity and reduce product sold
  for (const item of order.products) {
    const product = await Product.findById(item.product);

    if (!product) {
      return {
        type: 'Error',
        message: 'noProductFound',
        statusCode: 404
      };
    }

    await Product.findByIdAndUpdate(item.product, {
      quantity: product.quantity + item.totalProductQuantity,
      sold: product.sold - item.totalProductQuantity
    });
  }

  await Order.findByIdAndDelete(id);

  // 4) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulOrderCancel',
    statusCode: 200
  };
});
