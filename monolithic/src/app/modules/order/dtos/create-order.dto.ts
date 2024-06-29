
import { ORDER_STATUS } from '@shared/enums/order-status.enum';
import { Types } from 'mongoose';

export class CreateOrderDTO {
  phone: string;
  paymentMethod: string;
  address: string;
  products: Types.ObjectId[];
  status: ORDER_STATUS;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  country: string;
  postalCode: string;
  cvc: string;
  taxPrice: number;
  shippingPrice: number;
  expYear: string;
  expMonth: string;
  cardNumber: string;
}
