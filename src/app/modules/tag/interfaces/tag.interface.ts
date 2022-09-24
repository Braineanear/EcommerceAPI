import { Document } from 'mongoose';

export interface ITagDocument extends Document {
  name: string;
  code: string;
}
