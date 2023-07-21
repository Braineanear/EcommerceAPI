import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ORDER_STATUS } from '@shared/enums/order-status.enum';

import { Item, ItemSchema } from './item.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({ type: [ItemSchema], ref: 'Product', autopopulate: true })
  products: Item[];

  @Prop({ type: Types.ObjectId, ref: 'User', autopopulate: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Boolean, default: false })
  isPaid: boolean;

  @Prop({ type: Boolean, default: false })
  isDelivered: boolean;

  @Prop({ type: Date })
  deliveredAt: Date;

  @Prop({ type: String, required: true })
  paymentMethod: string;

  @Prop({ type: String })
  paymentStripeId?: string;

  @Prop({ type: Number, required: true })
  taxPrice: number;

  @Prop({ type: Number, required: true })
  shippingPrice: number;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true, enum: Object.values(ORDER_STATUS) })
  status: ORDER_STATUS;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String })
  postalCode?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
