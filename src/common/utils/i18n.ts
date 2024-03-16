import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as nodeI18n from 'i18n';
import { SupportedLanguages } from 'src/constants';

export class I18n {
  static setup(app: NestExpressApplication) {
    nodeI18n.configure({
      locales: [SupportedLanguages.AR, SupportedLanguages.EN],
      defaultLocale: SupportedLanguages.AR,
      directory:
        process.env.NODE_ENV != 'testing'
          ? path.join(__dirname, '..', 'assets', 'locales')
          : undefined,
      autoReload: true,
      logWarnFn: (msg) => console.log('I18n warn', msg),
      logErrorFn: (msg) => console.log('I18n error', msg),
    });

    app.use(nodeI18n.init);
  }
}
