import { Request } from 'express';

import { IUserDocument } from '@modules/user/interfaces/user.interface';

export interface RequestWithUser extends Request {
  user: IUserDocument;
}
