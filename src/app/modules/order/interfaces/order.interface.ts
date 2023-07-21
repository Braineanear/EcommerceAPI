import { Document, Types } from 'mongoose';

import { IItem } from './item.interface';

export interface IOrderDocument extends Document {
  products: IItem[];
  user: Types.ObjectId | string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  deliveredAt: Date;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  paymentMethod: string;
  paymentStripeId: string;
  taxPrice: number;
  shippingPrice: number;
  phone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
