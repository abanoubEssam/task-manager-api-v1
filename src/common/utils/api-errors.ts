import { Errors, HttpErrors } from "src/constants";

type ApiErrorArgs = {
  errorType: string;
  message?: string | Array<string>;
  param?: string | Array<string>;
  isI18nMessage?: boolean;
  messageOpts?: ApiErrorMessageOptions;
};

type ApiErrorMessageOptions = {
  isI18nMessage?: boolean;
  replacements: i18n.Replacements;
};

export type ApiErrorStaticFunArgs = {
  param?: string | Array<string>;
  message?: string | Array<string>;
  isI18nMessage?: boolean;
  messageOpts?: ApiErrorMessageOptions;
};

export type ErrorMessage = {
  message: string | ClassValidatorFieldError;
  param: string;
};

export type ErrorResponse = {
  error: {
    errors: ErrorMessage[];
  };
};
export enum ErrorMessages {
  NOT_FOUND = 'Not Found',
  FORBIDDEN = 'You are not allowed to access this resource',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export type ClassValidatorErrors = Record<string, string>[];
export type ClassValidatorFieldError = Record<string, string>;

export class ApiErrors extends Error {
  public message: string[] | ClassValidatorErrors | any;
  public name: string;
  public status: number;
  public param: Array<string>;
  public isI18nMessage: boolean;
  public messageOpts?: ApiErrorMessageOptions;

  constructor({
    errorType,
    message = [],
    param = [],
    isI18nMessage = false,
    messageOpts,
  }: ApiErrorArgs) {
    super();

    if (!Array.isArray(param)) param = [param];
    if (!Array.isArray(message)) message = [message];

    this.message = message;
    this.isI18nMessage = isI18nMessage;
    this.param = param;
    this.name = errorType;
    this.status = +HttpErrors[errorType];
    this.messageOpts = messageOpts;
  }

  static BadRequest = (args: ApiErrorStaticFunArgs) =>
    new ApiErrors({ errorType: Errors.BadRequest, ...args });
  static Unauthorized = (args: ApiErrorStaticFunArgs) =>
    new ApiErrors({ errorType: Errors.Unauthorized, ...args });
  static NotFound = (args: ApiErrorStaticFunArgs) =>
    new ApiErrors({
      errorType: Errors.NotFound,
      message: ErrorMessages.NOT_FOUND,
      ...args,
    });
  static InternalServerError = (params?: any) =>
    new ApiErrors({
      errorType: Errors.InternalServerError,
      param: params,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  static UnprocessableEntity = (args: ApiErrorStaticFunArgs) =>
    new ApiErrors({ errorType: Errors.UnprocessableEntity, ...args });

  /**
   * USED ONLY WITH CLASS VALIDATOR DEFAULT PIPE
   */
  static ClassValidatorUnProcessableEntity = (args: ApiErrorStaticFunArgs) =>
    new ApiErrors({
      errorType: Errors.UnprocessableEntity,
      isI18nMessage: true,
      ...args,
    });

  static Conflict = (args: ApiErrorStaticFunArgs) =>
    new ApiErrors({ errorType: Errors.Conflict, ...args });
  static Forbidden = (messageOrArgs?: string | ApiErrorStaticFunArgs) => {
    if (typeof messageOrArgs === 'string') {
      messageOrArgs = {
        message: messageOrArgs,
      };
    }

    return new ApiErrors({
      errorType: Errors.Forbidden,
      ...messageOrArgs,
    });
  };

  handle(req, res) {
    const errors: ErrorMessage[] = this.message.map(
      (message: string, messageIndex: number) => {
        const result: any = { message };
        if (
          this.isI18nMessage ||
          (this.messageOpts && this.messageOpts.isI18nMessage)
        ) {
          if (this.messageOpts && this.messageOpts.replacements)
            result.message = req.__mf(message, this.messageOpts.replacements);
          else {
            result.message = req.__(message);
          }
        }

        if (this.param[messageIndex]) result.param = this.param[messageIndex];

        return result;
      },
    );

    res.status(this.status || 500).json({
      error: {
        errors,
      },
    } as ErrorResponse);
  }

  handleClassValidatorErrors(req, res, messages: ErrorMessage[]) {
    const errors: ErrorMessage[] = messages;
    const translatedErrors = errors.map((err) => {
      return {
        param: err.param,
        message: this.translateError(
          req,
          err.message as ClassValidatorFieldError,
        ),
      };
    });

    res.status(this.status || 500).json({
      error: { errors: translatedErrors },
    } as ErrorResponse);
  }

  private translateError(req, errors: ClassValidatorFieldError) {
    // ** Steps **
    // * Step 1: map over keys to translate each one
    // * Step 2: reduce array of single objects to one object containing all errors
    const translatedErrors: ClassValidatorFieldError = Object.keys(errors)
      .map((errorKey) => {
        const value = errors[errorKey];
        const translatedError = req.__mf(value) as string;
        return {
          [errorKey]: translatedError,
        };
      })

      .reduce((errorsCollection, currentError) => {
        errorsCollection = { ...errorsCollection, ...currentError };
        return errorsCollection;
      }, {} as ClassValidatorFieldError);

    return translatedErrors;
  }
}
