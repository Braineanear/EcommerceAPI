import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LanguageEnum } from '../enums/language.enum';

@Schema({
  timestamps: false,
  versionKey: false,
})
export class Translation extends Document {
  @Prop({ type: String, enum: Object.values(LanguageEnum), required: true })
  language: string;

  @Prop({ type: String, required: true })
  name: string;
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);
