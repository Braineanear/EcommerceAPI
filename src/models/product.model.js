import mongoose from 'mongoose';
import slugify from 'slugify';

// Plugins
import toJSON from './plugins/index';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      trim: true
    },
    slug: String,
    mainImage: {
      type: String,
      required: [true, 'A product must have a main image']
    },
    mainImageId: String,
    images: {
      type: [String],
      required: [true, 'A product must have sub images']
    },
    imagesId: Array,
    description: {
      type: String,
      required: [true, 'A product must have a description']
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW documnet creation
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    colors: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Color'
      }
    ],
    sizes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Size'
      }
    ],
    quantity: {
      type: Number,
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    isOutOfStock: {
      type: Boolean,
      default: false
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);

productSchema.index(
  { name: 1, category: 1, price: 1, ratingsAverage: -1 },
  { unique: true }
);
productSchema.index({ slug: 1 });

// Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() !.update()
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
