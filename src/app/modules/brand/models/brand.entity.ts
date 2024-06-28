import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
class Brand {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String, required: true, unique: true })
  code: string;
}

type BrandDocument = Brand & Document;

const BrandSchema = SchemaFactory.createForClass(Brand);

export { Brand, BrandDocument, BrandSchema };
