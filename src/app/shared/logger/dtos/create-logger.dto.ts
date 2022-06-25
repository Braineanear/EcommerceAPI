import { Types } from 'mongoose';

export class CreateLoggerDto {
  description: string;
  user: string | Types.ObjectId | null;
  tags?: string[];
}
