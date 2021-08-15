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
    SMTP_HOST: Joi.string().description('Server That Will Send The Emails'),
    SMTP_PORT: Joi.number().description('Port to Connect to The Email Server'),
    SMTP_USERNAME: Joi.string().description('Username For Email Server'),
    SMTP_PASSWORD: Joi.string().description('Password For Email Server'),
    EMAIL_FROM: Joi.string().description(
      'The From Field in The Emails Sent By The App'
    ),
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
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
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
