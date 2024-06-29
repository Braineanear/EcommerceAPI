import { Types, Document } from 'mongoose';

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

type HistoryDocument = History & Document;

const HistorySchema = SchemaFactory.createForClass(History);

export { HistoryDocument, HistorySchema };
