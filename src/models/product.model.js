import mongoose from 'mongoose';
import slugify from 'slugify';

// Plugins
import toJSON from './plugins/index';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A product name must have less or equal then 40 characters'
      ],
      minlength: [
        10,
        'A product name must have more or equal then 10 characters'
      ]
    },
    slug: String,
    mainImage: {
      type: String,
      required: [true, 'A product must have a main image']
    },
    mainImageId: {
      type: String
    },
    images: {
      type: [String],
      required: [true, 'A product must have sub images']
    },
    imagesId: {
      type: [String]
    },
    description: {
      type: String,
      required: [true, 'A product must have a description'],
      min: [
        10,
        'A product description must have more or equal than 10 characters'
      ],
      max: [
        100,
        'A product description must have less or equal than 100 characters'
      ]
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
    color: {
      type: String
    },
    size: {
      type: String
    },
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

productSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: 'seller',
      select: 'name email profileImage companyName address phone'
    },
    {
      path: 'category',
      select: 'name description image status'
    }
  ]);

  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
