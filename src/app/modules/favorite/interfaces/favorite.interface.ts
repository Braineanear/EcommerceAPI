import { Document, Types } from 'mongoose';

export interface IFavoriteDocument extends Document {
  products: Types.ObjectId[];
  user: Types.ObjectId;
}
