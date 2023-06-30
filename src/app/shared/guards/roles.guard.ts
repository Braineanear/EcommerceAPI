import { UserService } from '@modules/user/user.service';
import {
    CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleTypeEnum } from '../enums/role-type.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleTypeEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findById(request.user.sub);
    const exist = requiredRoles.includes(RoleTypeEnum.All) ? true : requiredRoles.includes(user.role);

    if (!exist) {
      throw new HttpException(
        'You do not have permission to access this route',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return exist;
  }
}
