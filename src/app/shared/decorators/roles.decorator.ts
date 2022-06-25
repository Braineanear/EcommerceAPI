import { SetMetadata } from '@nestjs/common';
import { RoleTypeEnum } from '../enums/role-type.enum';

export const ROLES_KEY = 'role';
export const Roles = (...roles: RoleTypeEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
