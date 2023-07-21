import { Types } from 'mongoose';

export interface IItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
}
