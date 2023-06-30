import { Document, Types } from 'mongoose';

import { ENUM_LOGGER_LEVEL } from '../enums/logger.enum';

export interface ILoggerDocument extends Document {
  level: ENUM_LOGGER_LEVEL;
  anonymous?: boolean;
  description: string;
  user?: string | Types.ObjectId;
  tags?: string[];
}
