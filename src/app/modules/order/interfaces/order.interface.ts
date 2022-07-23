import { Document, Types } from 'mongoose';
import { IItem } from './item.interface';

export interface IOrderDocument extends Document {
  products: IItem[];
  user: Types.ObjectId;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  paymentMethod: string;
  paymentStripeId: string;
  taxPrice: number;
  shippingPrice: number;
  phone: string;
  status: string;
}
