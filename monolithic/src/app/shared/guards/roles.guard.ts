import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleTypeEnum } from '../enums/role-type.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;  // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
    }

    const hasRole = requiredRoles.includes(RoleTypeEnum.All) || requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new HttpException(
        'You do not have permission to access this route',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
