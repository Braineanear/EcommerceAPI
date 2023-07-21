import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    env: process.env.NODE_ENV,
    versioning: process.env.VERSIONING,
    port: parseInt(process.env.PORT),
    debug: process.env.DEBUG,
    stripSecretKey: process.env.STRIP_SECRET_KEY,
    productionURL: process.env.PRODUCTION_URL,
    stagingURL: process.env.STAGING_URL,
    developmentURL: process.env.DEVELOPMENT_URL,
    localURL: process.env.LOCAL_URL,
  }),
);
