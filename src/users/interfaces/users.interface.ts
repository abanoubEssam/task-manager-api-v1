export interface IUser {
  name: string;
  email: string;
  password?: string;
  verified?: boolean;
  allowed?: boolean;
  role: AppRoles;
  readonly _id?: string;
}

export enum AppRoles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
}
