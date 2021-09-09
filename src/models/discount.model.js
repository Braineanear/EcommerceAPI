import mongoose from 'mongoose';
import toJSON from './plugins/index';

const discountSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    discount: {
      type: String,
      required: true
    },
    available: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
discountSchema.plugin(toJSON);

const Discount = mongoose.model('Discount', discountSchema);

export default Discount;
