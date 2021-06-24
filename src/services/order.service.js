import STRIPE_SDK from 'stripe';
import moment from 'moment';

// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Configs
import config from '../config/config';

// Models
import { Order, Cart } from '../models/index';

const stripe = STRIPE_SDK(config.stripe.secret_key);

/**
 * Create New Order
 * @param   {Object} body
 * @param   {Object} user
 * @returns {Object<type|message|statusCode|order>}
 */
export const createOrder = catchAsync(async (body, user) => {
  // 1) Extract Data From Parameters
  const { shippingAddress, paymentMethod, phone } = body;
  const { address, city, country, postalCode } = shippingAddress;

  // 2) Check If User Entered All Fields
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
      message: 'All Fields Are Required',
      statusCode: 400
    };
  }

  // 3) Get User Cart
  const cart = await Cart.findOne({ email: user.email });

  // 4) Check If Cart Doesn't Exist
  if (!cart) {
    return {
      type: 'Error',
      message: 'No Cart Found',
      statusCode: 404
    };
  }

  // 4) Check Payment Method
  if (paymentMethod === 'cash') {
    // 1) If Payment Method Is Cash The Create New Order For The Cash Method
    const order = await Order.create({
      products: cart.items,
      user: user._id,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      phone
    });

    // 2) If Everything is OK, Send Order Data
    return {
      type: 'Success',
      message: 'Order Created Successfully',
      order
    };
  }

  // 5) If Payment Method Is Card Then Extract Card Data From Body
  const { cardNumber, expMonth, expYear, cvc } = body;

  // 6) Check If User Entered Card Data
  if (!cardNumber || !expMonth || !expYear || !cvc) {
    return {
      type: 'Error',
      message: 'All Fields Are Required',
      statusCode: 400
    };
  }

  // 7) Create Stripe Card Token
  const token = await stripe.tokens.create({
    card: {
      number: cardNumber,
      exp_month: expMonth,
      exp_year: expYear,
      cvc
    }
  });

  // 8) Create Stripe Charge
  const charge = stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: 'egp',
    source: token.id,
    description: 'Charge For Products'
  });

  // 9) Create Order With Payment Method Card
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

  // 10) If Everything is OK, Send Order Data
  return {
    type: 'Success',
    message: 'Order Created Successfully',
    statusCode: 201,
    order
  };
});

/**
 * Query Orders
 * @param   {Object} req
 * @returns {Object<type|message|statusCode|orders>}
 */
export const queryOrders = catchAsync(async (req) => {
  req.query.user = req.user._id;

  // 1) Get All Orders
  const orders = await APIFeatures(req, Order);

  // 2) Check If Orders Doesn't Exist
  if (!orders) {
    return {
      type: 'Error',
      message: 'No Orders Found',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Orders Data
  return {
    type: 'Success',
    message: 'Orders Found Successfully',
    statusCode: 200,
    orders
  };
});

/**
 * Query Order Using It's ID
 * @param   {ObjectId} id - Order ID
 * @returns {Object<type|message|statusCode|order>}
 */
export const queryOrder = catchAsync(async (id) => {
  // 1) Get Order Document Using It's ID
  const order = await Order.findById(id);

  // 2) Check If Order Doesn't Exist
  if (!order) {
    return {
      type: 'Error',
      message: 'No Order Found',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Order Data
  return {
    type: 'Success',
    message: 'Order Found Successfully',
    statusCode: 200,
    order
  };
});

/**
 * Cancel Order
 * @param     {ObjectId} id
 * @returns   {Object<type|message|statusCode>}
 */
export const cancelOrder = catchAsync(async (id) => {
  // 1) Find Order Document and Delete It
  const order = await Order.findByIdAndDelete(id);

  // 2) Check If Order Doesn't Exist
  if (!order) {
    return {
      type: 'Error',
      message: 'No Order Found',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'Order Cancelled Successfully',
    statusCode: 200
  };
});
