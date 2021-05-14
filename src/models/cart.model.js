import mongoose from 'mongoose';
import toJSON from './plugins/index';

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        productId: {
          type: mongoose.SchemaType.ObjectId,
          ref: 'Product',
          required: true
        },
        productQuanitity: {
          type: Number,
          required: true
        }
      }
    ],
    totalQuantity: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    numberOfItems: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
