import { EnvironmentVariables } from '../EnvironmentVariables';

export const developmentEnv: Partial<EnvironmentVariables> = {
  server: {
    protocol: 'http',
    host: 'localhost',
    port: 3077,
  },
  db: {
    url: 'mongodb://mongodb:27017',
    dbName: 'task-management-dev',

  },
  auth: {
    jwtSecret: 'App.TaskManagementSecret',
    jwtLifetime: '14d',
    refreshTokenSecret: 'super secret app',
    refreshTokenLifetime: '14d',
  },
};
