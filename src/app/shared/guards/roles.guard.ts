import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '@modules/user/user.service';
import { RoleTypeEnum } from '../enums/role-type.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleTypeEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findById(request.user.sub);

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
