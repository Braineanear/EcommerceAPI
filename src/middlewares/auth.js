import passport from 'passport';
import AppError from '../utils/appError';

const verifyCallback = (req, resolve, reject, roles) => async (
  err,
  user,
  info
) => {
  if (err || info || !user) {
    return reject(new AppError('Please authenticate', 401));
  }
  req.user = user;

  if (!roles.includes(user.role)) {
    return reject(new AppError('You do not have permission', 403));
  }

  resolve();
};

const auth = (...roles) => async (req, res, next) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject, roles)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));

export default auth;
