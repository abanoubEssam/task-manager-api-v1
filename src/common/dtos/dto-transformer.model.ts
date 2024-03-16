import { ApiErrors } from "../utils/api-errors";

export abstract class DtoTransformer {
  private static _handleParsing(value: any, opts = { isArray: false }) {
    if (opts && opts.isArray && Array.isArray(value)) return value;
    const parsedData = JSON.parse(value);
    if (opts && opts.isArray) {
      return !Array.isArray(parsedData) ? [parsedData] : parsedData;
    }

    return parsedData;
  }

  static convertStringToArrayOfNumber(value: string) {
    try {
      return value
        .split(',')
        .map((stringValue: string) => +stringValue.replace(/"/g, '').trim());
    } catch (err) {
      return value;
    }
  }

  static convertStringToArrayOfStrings(value: string) {
    try {
      return value
        .split(',')
        .map((stringValue: string) => stringValue.replace(/"/g, '').trim());
    } catch (err) {
      return value;
    }
  }

  static tryParse(value: any) {
    try {
      return this._handleParsing(value);
    } catch (err) {
      return value;
    }
  }

  static tryParseAsArray(value: any) {
    try {
      value = value.replace(/^"+|"+$/g, ''); // trim swagger double quotes
      value = value.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g, '"');
      return this._handleParsing(value, { isArray: true });
    } catch (err) {
      console.log(err);
      return value;
    }
  }

  static parseStringToArrayOfObjects(value: any) {
    try {
      let parsedValue = this.tryParse(value);

      let valueWithoutSpecialCharacters = parsedValue
        .replace(/([a-zA-Z0-9]+?):/g, '"$1":')
        .replace(/'/g, '"')
        .replace(/[`~!@#$%^&*()_|+\-=?;.<>\\\\\\\/]/gi, '');

      return JSON.parse(valueWithoutSpecialCharacters);
    } catch (error) {
      throw ApiErrors.UnprocessableEntity({
        message: 'please send a valid array of items ',
      });
    }
  }

  static castArray = (value) => (Array.isArray(value) ? value : [value]);
}
