import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    jwt: {
      accessToken: {
        secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
        expirationTime: 30,
      },
      refreshToken: {
        secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY,
        expirationTime: 7,
      },
      forgotPasswordToken: {
        secretKey: process.env.AUTH_JWT_FORGOT_PASSWORD_TOKEN_SECRET_KEY,
        expirationTime: 1,
      },
      verifyEmailToken: {
        secretKey: process.env.AUTH_JWT_VERIFY_EMAIL_TOKEN_SECRET_KEY,
        expirationTime: 1,
      },
    },
  }),
);
