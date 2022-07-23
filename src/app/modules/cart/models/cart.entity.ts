import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Item, ItemSchema } from './item.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Cart {
  @Prop({ type: String, required: true, match: /[\w]+?@[\w]+?\.[a-z]{2,4}/ })
  email: string;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, required: true })
  totalQuantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
