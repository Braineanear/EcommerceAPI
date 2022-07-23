import { Document } from 'mongoose';

export interface IColorDocument extends Document {
  name: string;
  code: string;
}
