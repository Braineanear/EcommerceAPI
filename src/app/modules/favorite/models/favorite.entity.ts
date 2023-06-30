import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: false,
  versionKey: false,
})
export class Favorite {
  @Prop({ type: [Types.ObjectId], ref: 'Product', required: true })
  products: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
