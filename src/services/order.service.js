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
  if (!cart) {
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

    cart.items.forEach(async (item) => {
      const { id } = item.product;
      const { totalProductQuantity } = item;
      const product = await Product.findById(id);
      const sold = product.sold + totalProductQuantity;
      const quantity = product.quantity - totalProductQuantity;
      await Product.findByIdAndUpdate(id, { sold, quantity });
    });

    await Cart.findByIdAndDelete(cart._id);

    // 2) If everything is OK, send data
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
    amount: cart.totalPrice * 100,
    currency: 'egp',
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

  cart.items.forEach(async (item) => {
    const id = item.product;
    const { totalProductQuantity } = item;
    const product = await Product.findById(id);
    const sold = product.sold + totalProductQuantity;
    const quantity = product.quantity - totalProductQuantity;
    await Product.findByIdAndUpdate(id, { sold, quantity });
  });

  await Cart.findByIdAndDelete(cart._id);

  // 10) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulOrderCreate',
    statusCode: 201,
    order
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
  order.products.forEach(async (item) => {
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
  });

  await Order.findByIdAndDelete(id);

  // 4) If everything is OK, send data
  return {
    type: 'Success',
    message: 'successfulOrderCancel',
    statusCode: 200
  };
});
