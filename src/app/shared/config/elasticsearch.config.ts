import { registerAs } from '@nestjs/config';

export default registerAs(
  'elasticsearch',
  (): Record<string, any> => ({
    host: process.env.ELASTIC_SEARCH_HOST,
  }),
);
