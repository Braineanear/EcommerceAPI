import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
class Color {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  code: string;
}

type ColorDocument = Color & Document;

const ColorSchema = SchemaFactory.createForClass(Color);

export { Color, ColorDocument, ColorSchema };
