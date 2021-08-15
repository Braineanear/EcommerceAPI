import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import config from '../config/config';

import catchAsync from '../utils/catchAsync';

export const token = catchAsync(async (token, secret) => {
  const decoded = await promisify(jwt.verify)(token, secret);
  return decoded;
});
