import { registerAs } from '@nestjs/config';

export default registerAs(
  'aws',
  (): Record<string, any> => ({
    bucketCreate: process.env.AWS_BUCKET_CREATE,
    credential: {
      key: process.env.AWS_CREDENTIAL_KEY,
      secret: process.env.AWS_CREDENTIAL_SECRET,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
      baseUrl: process.env.AWS_S3_BASE_URL,
    },
  }),
);
