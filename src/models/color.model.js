// Packages
import mongoose from 'mongoose';

// Plugins
import toJSON from './plugins/index';

const colorSchema = mongoose.Schema(
  {
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],
    color: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
colorSchema.plugin(toJSON);

const Color = mongoose.model('Color', colorSchema);

export default Color;
