import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

type TagDocument = Tag & Document;

const TagSchema = SchemaFactory.createForClass(Tag);

export { TagDocument, TagSchema };
