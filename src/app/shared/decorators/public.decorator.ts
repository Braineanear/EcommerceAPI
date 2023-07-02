import { SetMetadata } from '@nestjs/common';

export const AllowAnonymous = () => SetMetadata('isPublic', true);
