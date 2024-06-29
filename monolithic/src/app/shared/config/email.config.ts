import { registerAs } from '@nestjs/config';

export default registerAs(
  'email',
  (): Record<string, any> => ({
    from: process.env.CLIENT_EMAIL,
    client: {
      id: process.env.CLIENT_ID,
      secret: process.env.CLIENT_SECRET,
    },
    RedirectUri: process.env.REDIRECT_URI,
    RefreshToken: process.env.REFRESH_TOKEN,
  }),
);
