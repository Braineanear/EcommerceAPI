import mongoose from 'mongoose';
import toJSON from './plugins/index';

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users'
    },
    expires: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

export default Token;
