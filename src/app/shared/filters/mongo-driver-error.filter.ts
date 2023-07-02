import { Response } from 'express';
import { MongoError } from 'mongodb';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { MongoErrorCodes } from '../constants/mongo-error-codes.constant';
import { PathErrorDto } from '../dtos/path-error.dto';

@Catch(MongoError)
export class MongoDriverErrorFilter implements ExceptionFilter {
  env: string;

  constructor(
    public reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.env = this.configService.get<string>('app.env');
  }

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
      errors:
        this.env === 'development' ? this.parseError(exception) : undefined,
    });
  }
  parseError(error): PathErrorDto[] {
    const status = MongoErrorCodes[error.code]
      ? MongoErrorCodes[error.code]
      : HttpStatus.SERVICE_UNAVAILABLE;
    return [
      {
        status: status,
        message: this.env === 'development' ? error.message : undefined,
        path:
          this.env === 'development'
            ? Object.keys(error.keyPattern).join(',')
            : undefined,
        code: error.code,
      },
    ];
  }
}
