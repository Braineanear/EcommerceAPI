// Packages
import mongoose from 'mongoose';

// Plugins
import toJSON from './plugins/index';

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
favoriteSchema.plugin(toJSON);

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
