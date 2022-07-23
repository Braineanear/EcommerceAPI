import { Document } from 'mongoose';

export interface ISizeDocument extends Document {
  name: string;
  code: string;
}
