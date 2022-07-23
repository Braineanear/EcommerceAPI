import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: false,
  versionKey: false,
})
export class Item {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Color', required: true })
  selectedColor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Size', required: true })
  selectedSize: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
