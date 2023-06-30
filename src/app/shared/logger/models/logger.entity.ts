import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ENUM_LOGGER_LEVEL } from '../enums/logger.enum';

@Schema({ timestamps: true, versionKey: false })
export class Logger {
  @Prop({
    required: true,
    enum: ENUM_LOGGER_LEVEL,
  })
  level: string;

  @Prop({
    required: false,
  })
  user?: Types.ObjectId;

  @Prop({
    required: true,
    default: true,
  })
  anonymous: boolean;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  description: string;

  @Prop({
    required: false,
  })
  tags?: string[];
}

export const LoggerSchema = SchemaFactory.createForClass(Logger);
