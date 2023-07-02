import { Document, Types } from 'mongoose';

export interface ICategoryDocument extends Document {
  code: string;
  name: string;
  description: string;
  image: Types.ObjectId;
}
