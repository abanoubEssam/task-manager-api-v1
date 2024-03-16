import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppRoles } from 'src/users/interfaces/users.interface';
import { User } from 'src/users/schemas/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ApiErrors } from '../utils/api-errors';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRoles>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log("🚀 ~ RolesGuard ~ canActivate ~ user:", user)
    if (!user) {
      throw ApiErrors.Forbidden({
        message: 'not.allowed.error',
        isI18nMessage: true,
      });
    }
    const existsRole =  requiredRoles.includes((user as User).role);
    console.log("🚀 ~ RolesGuard ~ canActivate ~ existsRole:", existsRole)
    return existsRole
  }
}
