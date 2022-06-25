import { Types, Document } from 'mongoose';

export interface IImageDocument extends Document {
  _id?: string | Types.ObjectId;
  path: string;
  pathWithFilename: string;
  filename: string;
  mime: string;
}
