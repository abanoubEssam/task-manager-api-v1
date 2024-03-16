import { HttpStatus } from '@nestjs/common';

export enum Strategies {
  JWT = 'jwt',
}
export enum SupportedLanguages {
  AR = 'ar',
  EN = 'en',
}

export enum Errors {
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  NotFound = 'NotFound',
  InternalServerError = 'InternalServerError',
  Conflict = 'Conflict',
  UnprocessableEntity = 'UnprocessableEntity',
  Forbidden = 'Forbidden',
  BadGateWay = 'BadGateWay',
  TooManyRequests = 'TooManyRequests',
  AccessControlError = 'AccessControlError',
}

export enum HttpErrors {
  BadRequest = HttpStatus.BAD_REQUEST,
  Unauthorized = HttpStatus.UNAUTHORIZED,
  Forbidden = HttpStatus.FORBIDDEN,
  NotFound = HttpStatus.NOT_FOUND,
  Conflict = HttpStatus.CONFLICT,
  UnprocessableEntity = HttpStatus.UNPROCESSABLE_ENTITY,
  InternalServerError = HttpStatus.INTERNAL_SERVER_ERROR,
  BadGateWay = HttpStatus.BAD_GATEWAY,
  TooManyRequests = HttpStatus.TOO_MANY_REQUESTS,
}

export interface LocalizedText {
  ar: string;
  en: string;
}