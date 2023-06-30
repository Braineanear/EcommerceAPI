import { Response } from 'express';
import { MongoError } from 'mongodb';
import * as mongoose from 'mongoose';

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { MongoErrorCodes } from '../constants/mongo-error-codes.constant';
import { PathErrorDto } from '../dtos/path-error.dto';

@Catch(MongoError)
export class MongoDriverErrorFilter implements ExceptionFilter {
  constructor(public reflector: Reflector) {}

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception.code && MongoErrorCodes[exception.code]
        ? MongoErrorCodes[exception.code]
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: status,
      message: HttpStatus[status],
      errors: this.parseError(exception),
    });
  }
  parseError(error): PathErrorDto[] {
    const status = MongoErrorCodes[error.code]
      ? MongoErrorCodes[error.code]
      : HttpStatus.SERVICE_UNAVAILABLE;
    return [
      {
        status: status,
        message: error.message,
        path: Object.keys(error.keyPattern).join(','),
        code: error.code,
      },
    ];
    if (error instanceof mongoose.Error.ValidationError) {
      return Object.keys(error.errors).map((errPath) => {
        const err = error.errors[errPath];
        return {
          status: HttpStatus.BAD_REQUEST,
          message: err.name,
          path: err.path,
          code: err.kind,
        };
      });
    }
  }
}
