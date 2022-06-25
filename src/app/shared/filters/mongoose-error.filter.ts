import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongooseErrorFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    switch (exception.code) {
      case 11000:
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          type: exception.name,
          message: 'Duplicate key error',
          errors: this.parseError(exception),
        });
        break;
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          type: exception.name,
          message: 'Internal server error',
          errors: this.parseError(exception),
        });
        break;
    }
  }
  parseError(error) {
    return error.errors ? error.errors : error;
  }
}
