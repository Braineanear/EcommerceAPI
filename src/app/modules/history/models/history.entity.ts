import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class History {
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    autopopulate: true,
  })
  product: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', autopopulate: true })
  user: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isAnonymous: boolean;
}

export const HistorySchema = SchemaFactory.createForClass(History);
