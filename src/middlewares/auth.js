import passport from 'passport';
import AppError from '../utils/appError';
import { roleRights } from '../config/roles';

const verifyCallback = (req, resolve, reject, requiredRights) => async (
  err,
  user,
  info
) => {
  if (err || info || !user) {
    return reject(new AppError('Please authenticate', 401));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) =>
      userRights.includes(requiredRight)
    );
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new AppError('Forbidden', 403));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject, requiredRights)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));

export default auth;
