export interface EnvironmentVariables {
  server: {
    protocol?: string;
    host: string;
    port: number;
  };
  auth: {
    jwtSecret: string;
    jwtLifetime: string;
    refreshTokenSecret: string;
    refreshTokenLifetime: string;
  };
  super_admin: {
    name: string;
    email: string;
    password: string;
  };
  db: {
    url: string;
    dbName: string;
  };
}
