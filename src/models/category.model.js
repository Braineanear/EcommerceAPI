import mongoose from 'mongoose';
import { toJSON, paginate } from './plugins/index';

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    imageId: {
      type: String,
      required: true
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
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model('Category', categorySchema);

export default Category;
