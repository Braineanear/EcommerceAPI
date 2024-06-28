import { SetMetadata } from '@nestjs/common';

export const ALLOW_ANONYMOUS_KEY = 'isPublic';

export const AllowAnonymous = (): MethodDecorator & ClassDecorator => SetMetadata(ALLOW_ANONYMOUS_KEY, true);
