import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class NameRef extends Document {
  @Prop({ type: String, required: true })
  name: string;
}

export const NameRefSchema = SchemaFactory.createForClass(NameRef);
