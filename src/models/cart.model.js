import mongoose from 'mongoose';
import toJSON from './plugins/index';

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
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        totalQuantity: {
          type: Number,
          required: true
        },
        totalPrice: {
          type: Number,
          required: true
        }
      }
    ],
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

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.product',
    select:
      '-mainImageId -imagesId -color -size -slug -sold -quantity -ratingsAverage -ratingsQuantity -user'
  });

  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
