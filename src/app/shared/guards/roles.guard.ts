import { UserService } from '@modules/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RoleTypeEnum } from '../enums/role-type.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }

    const roleAll = requiredRoles.includes(RoleTypeEnum.All);

    if (roleAll) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const exist = requiredRoles.includes(user.role);

    if (!exist) {
      throw new HttpException(
        'You do not have permission to access this route',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return exist;
  }
}
