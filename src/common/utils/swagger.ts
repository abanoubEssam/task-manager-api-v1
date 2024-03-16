import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
  static setup(app: NestExpressApplication) {
    const options = new DocumentBuilder()
      .setTitle('Task Manager Api')
      .setDescription('this is Task Manager Api Description')
      .addBearerAuth()
      .setVersion('1.0')
      .addServer('/api/v1')
      .build();

    const document = SwaggerModule.createDocument(app, options, {
      ignoreGlobalPrefix: true,
    });

    SwaggerModule.setup('/docs', app, document, {
      swaggerOptions: {
        displayRequestDuration: true,
      },
    });
  }
}
