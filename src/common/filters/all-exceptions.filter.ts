import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrors, ClassValidatorErrors, ClassValidatorFieldError } from '../utils/api-errors';
import { Errors } from 'src/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let message = '',
      status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ApiErrors) {
      if (exception.name === Errors.UnprocessableEntity) {
        return this.formatClassValidatorError(exception, request, response);
      }
      return exception.handle(request, response);
    } else if (exception instanceof HttpException) {
      message += exception.message;
      status = exception.getStatus();
    } else if (exception.name === Errors.AccessControlError) {
      message += 'Forbidden Resource';
      status = HttpStatus.FORBIDDEN;
    } else {
      message += exception.message;
    }

    response.status(status).json({
      error: {
        errors: [
          {
            message,
          },
        ],
      },
    });

    if (process.env.NODE_ENV !== 'testing') {
      console.log('Server Response With An Error:\n', exception);
    }
  }

  private formatClassValidatorError(err: ApiErrors, req, res) {
    const message = err.message as ClassValidatorErrors;
    const values = message
      .map((error, index) => {
        return {
          param: err.param[index],
          message: error,
        };
      })
      .map((error) => {
        const { param } = error;
        const formattedMessages = this.formatI18Message(error.message);

        return {
          param,
          message: formattedMessages,
        };
      });

    return err.handleClassValidatorErrors(req, res, values);
  }

  private formatI18Message(messages: ClassValidatorFieldError) {
    const formattedMessages: ClassValidatorFieldError = Object.keys(messages)
      .map((key) => {
        if (!messages[key].startsWith('i18n')) {
          return { key: messages[key] };
        }
        const [, i18Message] = messages[key].split(':');
        return { [key]: i18Message };
      })
      .reduce((acc, current) => {
        acc = {
          ...acc,
          ...current,
        };

        return acc;
      }, {} as Record<string, string>);

    return formattedMessages;
  }
}
