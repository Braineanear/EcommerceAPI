import { Types, Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: false,
  versionKey: false,
})
class Item {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  total: number;
}

type ItemDocument = Item & Document;

const ItemSchema = SchemaFactory.createForClass(Item);

@Schema({
  timestamps: true,
  versionKey: false,
})
class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', autopopulate: true })
  user: Types.ObjectId;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, required: true })
  totalQuantity: number;
}

type CartDocument = Cart & Document;

const CartSchema = SchemaFactory.createForClass(Cart);

export { Item, ItemDocument, Cart, CartDocument, CartSchema };
