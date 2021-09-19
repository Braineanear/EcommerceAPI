import mongoose from 'mongoose';
import toJSON from './plugins/index';

const cartItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    selectedColor: {
      type: mongoose.Types.ObjectId,
      ref: 'Color',
      required: true
    },
    selectedSize: {
      type: mongoose.Types.ObjectId,
      ref: 'Size',
      required: true
    },
    totalProductQuantity: {
      type: Number,
      required: true
    },
    totalProductPrice: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const cartSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      match: [
        /[\w]+?@[\w]+?\.[a-z]{2,4}/,
        'The value of path {PATH} ({VALUE}) is not a valid email address.'
      ]
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true
    },
    totalQuantity: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
