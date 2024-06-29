import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DEFAULT_LANGUAGE } from '../constants/app.config';

export const Language = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const { user, query } = request;

    return query.language || user?.language || DEFAULT_LANGUAGE;
  },
);
