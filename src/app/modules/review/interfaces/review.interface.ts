import { Document, Types } from 'mongoose';

export interface IReviewDocument extends Document {
  review: string;
  rating: number;
  product: Types.ObjectId;
  user: Types.ObjectId;
}
