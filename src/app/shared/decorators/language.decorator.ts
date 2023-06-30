import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { DEFAULT_LANGUAGE } from '../constants/app.config';

export const Language = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const user = ctx.getRequest().user;
    const query = ctx.getRequest().query;
    const language = query.language
      ? query.language
      : user
      ? user.language
      : DEFAULT_LANGUAGE;
    return language;
  },
);
