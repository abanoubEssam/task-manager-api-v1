import { AppRoles } from "src/users/interfaces/users.interface";

export interface IJwtPayload {
  sub: string;
  role: AppRoles
}
