import { Document, Types } from 'mongoose';

export interface IFavoriteDocument extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
}
