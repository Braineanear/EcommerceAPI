import { Document, Types } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  description: string;
  image: Types.ObjectId;
}
