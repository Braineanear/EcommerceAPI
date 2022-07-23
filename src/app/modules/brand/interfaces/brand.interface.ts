import { Document } from 'mongoose';

export interface IBrandDocument extends Document {
  name: string;
  code: string;
  description: string;
  website?: string;
}
