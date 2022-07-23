import { Document, Types } from 'mongoose';

export interface ICartDocument extends Document {
  email: string;
  items: {
    product: Types.ObjectId;
    selectedColor: Types.ObjectId;
    selectedSize: Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalPrice: number;
  totalQuantity: number;
}
