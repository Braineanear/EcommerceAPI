import { SetMetadata } from '@nestjs/common';

import { RoleTypeEnum } from '../enums/role-type.enum';

export const Roles = (...roles: RoleTypeEnum[]) => SetMetadata('role', roles);
