import * as os from 'os';
type ReplicaSetInstance = {
  ip: string;
  port: string;
};

export type DbConfig = {
  dbName: string;
  url?: string;
  ip?: string;
  port?: number;
  user?: string;
  password?: string;
  replicaSet?: {
    name: string;
    shouldUseMachineName?: boolean;
    instances: ReplicaSetInstance[];
  };
};

export class DbConfigurationReader {
  constructor(private _dbConfig: DbConfig) {}

  getConnectionString() {
    if (this._dbConfig.url) {
      return `${this._dbConfig.url}/${this._dbConfig.dbName}`;
    }
    if ((this._dbConfig.ip || this._dbConfig.port) && this._dbConfig.replicaSet)
      throw new Error('you should not add replica set with direct connection');

    if (this._dbConfig.ip && this._dbConfig.port)
      return `mongodb://${this._dbConfig.ip}:${+this._dbConfig.port}/${
        this._dbConfig.dbName
      }?authSource=admin`;

    if (this._dbConfig.replicaSet) {
      const replicaSetInstances = this._dbConfig.replicaSet.instances.reduce(
        (previousString, replicaOpts, index) =>
          `${previousString}${index ? ',' : ''}${
            this._dbConfig.replicaSet &&
            this._dbConfig.replicaSet.shouldUseMachineName &&
            os.platform().includes('win')
              ? os.hostname()
              : replicaOpts.ip
          }:${+replicaOpts.port}`,
        '',
      );
      //authSource=admin&
      return this._dbConfig.user && this._dbConfig.password
        ? `mongodb://${this._dbConfig.user}:${this._dbConfig.password}@${replicaSetInstances}/${this._dbConfig.dbName}?replicaSet=${this._dbConfig.replicaSet.name}`
        : `mongodb://${replicaSetInstances}/${this._dbConfig.dbName}?replicaSet=${this._dbConfig.replicaSet.name}`;
    }

    throw new Error('invalid db configuration');
  }

  getConnectionOptions() {
    const mongooseOpts: any = {};

    if (this._dbConfig.user && this._dbConfig.password) {
      mongooseOpts.user = this._dbConfig.user;
      mongooseOpts.pass = this._dbConfig.password;
    }

    return mongooseOpts;
  }
}
