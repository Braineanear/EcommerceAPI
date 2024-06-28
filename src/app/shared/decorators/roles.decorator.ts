import { SetMetadata } from '@nestjs/common';
import { RoleTypeEnum } from '../enums/role-type.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleTypeEnum[]): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles);
