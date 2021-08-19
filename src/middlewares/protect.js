// Packages
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

// Configs
import config from '../config/config';

// Utils
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

// Models
import { User } from '../models/index';

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // 2) Check if token does not exist
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access.', 401)
    );
  }

  // 3) Token verification
  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);

  // 4) Extract user data from database
  const currentUser = await User.findById(decoded.sub);

  // 5) Check if user does not exist
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 6) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again!', 401)
    );
  }

  req.user = currentUser;

  next();
});

export default protect;
