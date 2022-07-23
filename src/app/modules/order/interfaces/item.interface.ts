import { Types } from 'mongoose';

export interface IItem {
  product: Types.ObjectId;
  selectedColor: Types.ObjectId;
  selectedSize: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
}
