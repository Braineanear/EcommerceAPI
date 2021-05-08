import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      min: 5
    },
    mainImage: {
      type: String,
      required: true
    },
    mainImageId: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      required: true
    },
    imagesId: {
      type: [String],
      required: true
    },
    description: {
      type: String,
      required: true,
      min: 5,
      max: 100
    },
    category: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    price: {
      type: String,
      required: true,
      default: '0'
    },
    oldPrice: {
      type: Number,
      required: true,
      default: '0'
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
    quality: {
      type: String,
      required: true,
      default: 'New'
    },
    isPopular: {
      type: Boolean,
      required: true
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
    },
    isOutOfStock: {
      type: Boolean,
      default: false
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
