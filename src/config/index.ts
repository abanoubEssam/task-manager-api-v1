import { defaultEnv } from './environments/config.default';
import { developmentEnv } from './environments/config.development';
import { productionEnv } from './environments/config.production';
import { stagingEnv } from './environments/config.staging';

const env = process.env.NODE_ENV || 'development';

// Injects default values to current environment
const environmentFactory = (env: Record<string, any>) => ({
  ...defaultEnv,
  ...env,
});

const configurations = {
  development: developmentEnv,
  production: productionEnv,
  staging: stagingEnv,
};

const config = configurations[env];

export default () => environmentFactory(config);
