import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentVariables } from './config/EnvironmentVariables';
import { DbConnection } from './common/db';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        ...DbConnection.connect(configService.get('db', { infer: true })),
        connectionFactory: (connection) => {
          return connection;
        },
      }),
    }),
    UsersModule,
    AuthModule,
    TasksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
