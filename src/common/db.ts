import { Logger } from '@nestjs/common';
import { DbConfig, DbConfigurationReader } from './utils/dbClientUtils';
export class DbConnection {
  static connect(dbConfig: DbConfig) {
    const dbConfigurationReader = new DbConfigurationReader(dbConfig);

    const logger = new Logger('Db');
    logger.log(`Connecting To: ${dbConfigurationReader.getConnectionString()}`);

    return {
      uri: dbConfigurationReader.getConnectionString(),
      ...dbConfigurationReader.getConnectionOptions(),
    };
  }
}
