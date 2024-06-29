import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Size {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  code: string;
}

type SizeDocument = Size & Document;

const SizeSchema = SchemaFactory.createForClass(Size);

export { SizeDocument, SizeSchema };
