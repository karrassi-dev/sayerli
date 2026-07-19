import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSION_KEY } from '../decorators/permission.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (user?.role === 'PROPRIETAIRE') return true;

    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user?.role)) {
        throw new ForbiddenException("Vous n'avez pas les permissions nécessaires pour cette action.");
      }
    }

    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredPermission) {
      const removed: string[] = user?.permissionsRetirees ?? [];
      if (removed.includes(requiredPermission)) {
        throw new ForbiddenException('Cette permission a été retirée de votre compte. Contactez votre administrateur.');
      }
    }

    return true;
  }
}
