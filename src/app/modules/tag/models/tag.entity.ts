import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Tag {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  code: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
