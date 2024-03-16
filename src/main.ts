import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { DefaultValidationPipe } from './common/pipes/default-validation.pipe';
import { I18n } from './common/utils/i18n';
import { Swagger } from './common/utils/swagger';
import { EnvironmentVariables } from './config/EnvironmentVariables';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.enableShutdownHooks();

  const reflector = app.get(Reflector);
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new DefaultValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  I18n.setup(app);

  Swagger.setup(app);
  app.setGlobalPrefix('api/v1');

  const port =
    process.env.PORT ||
    configService.get('server.port', { infer: true }) ||
    3007;
  await app.listen(port, () => {
    console.debug(`listening on port ${port}`);
  });
}
bootstrap();
