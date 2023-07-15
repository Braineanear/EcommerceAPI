import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Item, ItemSchema } from './item.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', autopopulate: true })
  user: Types.ObjectId;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, required: true })
  totalQuantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
