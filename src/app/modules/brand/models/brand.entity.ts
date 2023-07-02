import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Brand {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String, required: true, unique: true })
  code: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
