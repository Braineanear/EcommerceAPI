import { Document, Types } from 'mongoose';

export interface IHistoryDocument extends Document {
  product: Types.ObjectId;
  user?: Types.ObjectId;
  isAnonymous: boolean;
}
