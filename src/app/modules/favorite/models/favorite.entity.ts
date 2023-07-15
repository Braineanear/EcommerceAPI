import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Favorite {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    autopopulate: true,
  })
  product: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
