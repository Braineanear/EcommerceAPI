import { Document, Types } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  mainImage: Types.ObjectId;
  images: Types.ObjectId[];
  description: string;
  category: Types.ObjectId | string;
  seller: Types.ObjectId;
  brand: Types.ObjectId | string;
  size: Types.ObjectId | string;
  color: Types.ObjectId | string;
  tags: Types.ObjectId[] | string[];
  price: number;
  currency: string;
  priceDiscount: number;
  quantity: number;
  sold: number;
  isOutOfStock: boolean;
  ratingsAverage: number;
  ratingsQuantity: number;
  details: object;
}
