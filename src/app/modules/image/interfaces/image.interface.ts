import { Document } from 'mongoose';

export interface IImageDocument extends Document {
  path: string;
  pathWithFilename: string;
  filename: string;
  mime: string;
}
