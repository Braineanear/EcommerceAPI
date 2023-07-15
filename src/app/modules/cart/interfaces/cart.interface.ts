import { Document, Types } from 'mongoose';

export interface ICartDocument extends Document {
  user: Types.ObjectId | string;
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalPrice: number;
  totalQuantity: number;
}
