import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { RoleTypeEnum } from '@shared/enums/role-type.enum';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Product {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Image', autopopulate: true })
  mainImage: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Image', autopopulate: true })
  images: Types.ObjectId[];

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', autopopulate: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', autopopulate: true })
  seller: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand', autopopulate: true })
  brand: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Size', autopopulate: true })
  sizes: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Color', autopopulate: true })
  colors: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Tag', autopopulate: true })
  tags: Types.ObjectId[];

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, default: 0 })
  priceDiscount: number;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: Boolean, default: false })
  isOutOfStock: boolean;

  @Prop({
    type: Number,
    default: 4.5,
    min: 1,
    max: 5,
    set: (val: number) => Math.round(val * 10) / 10,
  })
  ratingsAverage: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
