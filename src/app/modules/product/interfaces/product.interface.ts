import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { Document, Types } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  mainImage: Types.ObjectId;
  images: Types.ObjectId[];
  description: string;
  category: Types.ObjectId | string;
  seller: Types.ObjectId;
  brands: Types.ObjectId[] | string[];
  sizes: Types.ObjectId[] | string[];
  colors: Types.ObjectId[] | string[];
  tags: Types.ObjectId[] | string[];
  price: number;
  priceDiscount: number;
  quantity: number;
  sold: number;
  isOutOfStock: boolean;
  ratingsAverage: number;
  ratingsQuantity: number;
}
