import { Document, Types } from 'mongoose';

import { TokenTypes } from '@shared/enums/token-type.enum';

export interface ITokenDocument extends Document {
  token: string;
  user: Types.ObjectId;
  expires: Date;
  type: TokenTypes;
}
