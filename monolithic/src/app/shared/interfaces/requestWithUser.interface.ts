import { Request } from 'express';

import { UserDocument } from '@modules/user/models/user.entity';

export interface RequestWithUser extends Request {
  user: UserDocument;
}
