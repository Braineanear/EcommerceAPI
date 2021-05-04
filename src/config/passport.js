import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import catchAsync from '../utils/catchAsync';
import config from './config';
import tokenTypes from './tokens';
import { User } from '../models/index';
import logger from './logger';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload, done) => {
  if (payload.type !== tokenTypes.ACCESS) {
    throw new Error('Invalid token type');
  }
  const [err, user] = await catchAsync(User.findById(payload.sub));
  if (!user) {
    return done(null, false);
  }
  if (err) {
    logger.error(err);
  }
  done(null, user);
};

const jwtLogin = new JWTStrategy(jwtOptions, jwtVerify);

export default jwtLogin;
