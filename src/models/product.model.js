import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index';

const productSchema = mongoose.Schema(
  {
    mainImage: {
      type: String,
      required: true
    },
    mainImageId: {
      type: String,
      required: true
    },
    images: {
      type: Array,
      required: true
    },
    imagesId: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
      min: 5,
      max: 30
    },
    description: {
      type: String,
      required: true,
      min: 5,
      max: 100
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'categories'
    },
    price: {
      type: Number,
      required: true
    },
    color: {
      type: String
    },
    size: {
      type: String
    },
    quantity: {
      type: String,
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    offer: {
      type: String,
      default: null
    },
    status: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
