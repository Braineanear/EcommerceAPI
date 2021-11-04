import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: 'config.env' });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    DATABASE_CONNECTION: Joi.string().required().description('MongoDB URL'),
    DATABASE_PASSWORD: Joi.string().required().description('MongoDB Password'),
    JWT_SECRET: Joi.string().required().description('JWT Secret Key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('Minutes After Which Access Tokens Expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('Days After Which Refresh Tokens Expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('Minutes After Which Reset Password Token Expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('Minutes After Which Verify Email Token Expires'),
    CLIENT_EMAIL: Joi.string().description('Gmail Client Email'),
    CLIENT_ID: Joi.string().description('Gmail Client ID'),
    CLIENT_SECRET: Joi.string().description('Gmail Client Secret'),
    REDIRECT_URI: Joi.string().description('Gmail Redirect URI'),
    REFRESH_TOKEN: Joi.string().description('Gmail Refresh Token'),
    CLOUD_NAME: Joi.string().description('Cloudinary Storage Name'),
    CLOUD_API_KEY: Joi.string().description('Cloudinary Api Key'),
    CLOUD_API_SECRET: Joi.string().description('Cloudinary Api Secret'),
    CLOUD_PROJECT: Joi.string().description('Projct Folder'),
    STRIPE_SECRET_KEY: Joi.string().description('Stripe Secret Key')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  server: {
    port: envVars.PORT
  },
  db: {
    url: envVars.DATABASE_CONNECTION,
    password: envVars.DATABASE_PASSWORD
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    from: envVars.CLIENT_EMAIL,
    client: {
      id: envVars.CLIENT_ID,
      secret: envVars.CLIENT_SECRET
    },
    RedirectUri: envVars.REDIRECT_URI,
    RefreshToken: envVars.REFRESH_TOKEN
  },
  cloud: {
    name: envVars.CLOUD_NAME,
    api_key: envVars.CLOUD_API_KEY,
    api_secret: envVars.CLOUD_API_SECRET,
    project: envVars.CLOUD_PROJECT
  },
  stripe: {
    secret_key: envVars.STRIPE_SECRET_KEY
  }
};

export default config;
