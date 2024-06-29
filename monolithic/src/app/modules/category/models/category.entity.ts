import { Types, Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
class Category {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Image', autopopulate: true })
  image: Types.ObjectId;
}

type CategoryDocument = Category & Document;

const CategorySchema = SchemaFactory.createForClass(Category);

export { Category, CategoryDocument, CategorySchema };
