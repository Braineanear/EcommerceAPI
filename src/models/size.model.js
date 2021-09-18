// Packages
import mongoose from 'mongoose';

// Plugins
import toJSON from './plugins/index';

const sizeSchema = mongoose.Schema(
  {
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],
    size: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
sizeSchema.plugin(toJSON);

const Size = mongoose.model('Size', sizeSchema);

export default Size;
