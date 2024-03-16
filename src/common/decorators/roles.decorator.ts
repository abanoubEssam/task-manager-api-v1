import { SetMetadata } from '@nestjs/common';
import { AppRoles } from 'src/users/interfaces/users.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRoles[]) => SetMetadata(ROLES_KEY, roles);